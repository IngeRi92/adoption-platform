# Backend development setup

Run the commands below from `adoption-platform/backend/`. The backend is Django + Django REST Framework. Frontend and PostgreSQL setup are separate; SQLite lets you work while those are being prepared.

## Team baseline

- CPython **3.14.3**, recorded in `.python-version`.
- Django **5.2.17**, plus exact direct and transitive dependency versions in `requirements.txt`.
- PowerShell instructions below target Windows. Other platforms have not been verified for this baseline.

`.python-version` documents the interpreter for version managers; it does not install Python or change an existing virtual environment. Install the specified interpreter and verify it before continuing. Python and dependency security updates should be reviewed and tested regularly; these pins are a reproducible baseline, not a promise to stay on these versions forever.

## 1. Create an isolated Python environment

```powershell
python --version
# Expect Python 3.14.3. If another version appears, use the correct
# interpreter's full path for the next command.
python -m venv .venv
./.venv/Scripts/python.exe -m pip install -r requirements.txt
./.venv/Scripts/python.exe -m pip check
```

A virtual environment keeps this project's packages separate from other projects. Calling its Python directly avoids PowerShell activation-policy problems. If `.venv` already exists, check `./.venv/Scripts/python.exe --version`; do not assume creating it again switches Python versions. Preserve or rename an old environment before creating a replacement.

On macOS/Linux, the corresponding interpreter path is `.venv/bin/python`; use a Python 3.14.3 interpreter to create it and run the same pip/manage.py commands. Those platforms need their own verification.

## 2. Configure local settings

If `backend/.env` does not already exist:

```powershell
Copy-Item .env.example .env
./.venv/Scripts/python.exe -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Paste the generated value into `SECRET_KEY` in `.env`, enclosed in single quotes. Keep `.env` private and ignored by Git; `.env.example` contains placeholders only. If you already have `.env`, add missing settings manually instead of overwriting it.

The example selects SQLite and the local frontend origins on port 3000. Leave `DB_NAME` absent to use `backend/db.sqlite3`. An empty value is not the same as an absent value.

Settings precedence is: existing process environment variables, then `backend/.env`, then the repository-root `.env`, then code defaults. If a setting appears ignored, check for an existing shell variable or root configuration. Restart Django after changing settings.

For PostgreSQL, replace `DB_ENGINE` and fill in the commented database values using the [database teammate's handoff](../Database/README.md). `Database/.env` is not automatically read by Django. PostgreSQL must be running before migrations or application requests can connect.

## 3. Create tables and sample data

```powershell
./.venv/Scripts/python.exe manage.py check
./.venv/Scripts/python.exe manage.py migrate
./.venv/Scripts/python.exe manage.py seed_demo_data
./.venv/Scripts/python.exe manage.py runserver
```

Keep the server terminal open. Visit `http://localhost:8000/api/dogs/`; an empty database seeded by this command should now contain three dogs and two shelters. Repeating the seed command does not duplicate those demo records. Stop the development server with Ctrl+C.

To manage listings and upload photos, create a local admin account if needed:

```powershell
./.venv/Scripts/python.exe manage.py createsuperuser
```

Sign in at `http://localhost:8000/admin/`. Public API listing writes are intentionally disabled. Files go into `backend/media/` and are served locally only with `DEBUG=True`. See the [image-storage guide](../Documents/IMAGE_STORAGE.md).

## 4. Run checks and tests

```powershell
./.venv/Scripts/python.exe -m pip check
./.venv/Scripts/python.exe manage.py check
./.venv/Scripts/python.exe manage.py makemigrations --check --dry-run
./.venv/Scripts/python.exe manage.py test shelters --noinput
```

The migration check reports model changes missing a committed migration; it does not create files. Tests create a separate test database. When using PostgreSQL, the development test account needs permission to create that database; never point tests at a production environment.

To explicitly run the SQLite tests regardless of PostgreSQL values in `.env`, use a **new terminal** in `backend/`:

```powershell
$env:DB_ENGINE='django.db.backends.sqlite3'
$env:DB_NAME=':memory:'
./.venv/Scripts/python.exe manage.py test shelters --noinput
```

Close that terminal afterward so its overrides do not affect normal startup. Media tests use temporary files and do not upload pictures into your development media folder.

## Dependency and migration changes

Use `pip install -r requirements.txt` after pulling dependency changes. Exact pins cover transitive dependencies too; do not install an unrelated Django release to match an old migration comment. Migration 0002's generated-by header is historical metadata; its operations must work under the selected team version. Keep existing migration history intact.

When upgrading, update the selected interpreter/pins deliberately, install into a new environment, run all checks and migrate an empty database. Update this guide and `.python-version` if the Python baseline changes. Pins are not artifact hashes: this setup is repeatable by version, not a cryptographically locked/offline build. See [pip repeatable installs](https://pip.pypa.io/en/stable/topics/repeatable-installs/).

## Verification scope and next steps

Verified in a fresh Windows virtual environment with Python 3.14.3: pinned dependency installation, `pip check`, Django system checks, no missing model migrations, migrations on an empty SQLite database, two seed runs without duplicates, and an API response with three dogs. All 17 tests pass in a separate clean test process. PostgreSQL, another operating system, and the actual Next.js browser flow require separate checks. This guide is for development, not production deployment.

Frontend integration instructions: [API contract](API_CONTRACT.md). Outstanding work: [backend plan](BACKEND_PLAN.md).
