# Database ownership and backend handoff

This folder belongs to the database teammate. Its purpose is to provide a reproducible PostgreSQL environment that the Django backend can connect to, plus documentation of the data design and database operations.

This is a proposed handoff contract, based on the existing code and the team leader's [task overview](../Documents/Get%20a%20Pet%20-%20Backend%20Frontend%20Database%20Task%20Overview.pdf), especially pages 5–6. Docker is our suggested local starting point. Only this guide exists so far; the files and commands below describe the expected implementation.

## Architecture and ownership

```text
Frontend browser -> Django REST API -> PostgreSQL
frontend/           backend/           Database/ (setup and documentation)
```

The frontend uses HTTP endpoints and never connects directly to PostgreSQL. The backend connects to a running database using environment variables; it does not import this folder.

| Area | Owner and deliverable |
| --- | --- |
| PostgreSQL environment | Database teammate: Docker Compose, persistence, connection settings, health check and troubleshooting |
| Data design | Database teammate: relationship diagram, data dictionary, proposed constraints, indexes, roles and naming decisions; review together with backend |
| Application schema changes | Backend teammate: translate agreed design into Django models and migrations in `backend/`; database teammate reviews SQL and database effects |
| API and business rules | Backend teammate: serializers, validation, permissions, queries and API contract |
| Integration | All three: verify search, dog detail and inquiry submission end to end |

Keep Django migrations as the single executable history of application tables. Do not independently create the same tables with `schema.sql` or edit them manually. Database-specific SQL, when needed for application schema changes, should be coordinated through migrations. Bootstrap SQL may create database roles or agreed infrastructure prerequisites.

This lets everyone mainly work in their own folder while coordinating changes that cross boundaries. See [Django's migration workflow](https://docs.djangoproject.com/en/5.2/topics/migrations/).

## Expected contents

| File or directory to deliver | Purpose |
| --- | --- |
| `compose.yaml` | A PostgreSQL service named `db`, an explicit supported image version, named data volume and readiness check |
| `.env.example` | Placeholder local configuration; copy to ignored `.env` and choose a local password |
| `schema.md` | Entity relationships, column meanings, allowed values, nullability, deletion rules and differences from the wiki |
| `operations.md` | Start/stop, inspect logs, connect with a SQL client, backup/restore and explicitly documented destructive reset steps |
| `init/` (if needed) | Reviewed role/bootstrap scripts; document that image initialization runs against an empty data directory |

Commit configuration and documentation, not passwords, database data directories or database dumps. The repository already ignores `.env`. Keep backups outside version control.

## Local PostgreSQL requirements

- Run PostgreSQL in Docker initially; Django can continue running directly on each developer's machine.
- Choose and record one supported PostgreSQL image version compatible with the team's agreed Django version. Avoid `latest`; document the volume path appropriate to that image version.
- Persist data in a named volume so stopping/recreating the container preserves it.
- Publish only to the local interface, with a default host endpoint of `127.0.0.1:5432`. Allow another host port if 5432 is occupied.
- Include a `pg_isready` health check. See [Docker's readiness guidance](https://docs.docker.com/compose/how-tos/startup-order/).
- Provide an application login with database access and schema permissions needed for local migrations. Keep administrative credentials separate; document any simplified local role setup.
- Each teammate should be able to create their own database from the same configuration. Sharing the configuration does not require sharing one live database.

## Backend connection contract

The existing [Django settings](../backend/adoption_backend/settings.py) already read the following keys. Put them in `backend/.env`; the backend does **not** load `Database/.env` automatically.

```dotenv
DB_ENGINE=django.db.backends.postgresql
DB_NAME=adoption_db
DB_USER=adoption_app
DB_PASSWORD=replace_with_your_local_password
DB_HOST=127.0.0.1
DB_PORT=5432
```

The database teammate must create `adoption_db` and the `adoption_app` login with the matching password. `DB_ENGINE` is essential: without it, the current backend defaults to SQLite. Existing shell environment variables can override values in `.env`.

For the proposed Compose configuration, document these separate provisioning settings in `Database/.env.example`:

```dotenv
POSTGRES_DB=adoption_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=replace_with_local_admin_password
APP_DB_USER=adoption_app
APP_DB_PASSWORD=replace_with_your_local_password
POSTGRES_PORT=5432
```

`APP_DB_USER`, `APP_DB_PASSWORD` and `POSTGRES_PORT` are proposed project settings: Compose/bootstrap code must explicitly use them. The PostgreSQL image does not automatically create an application role from these names. `POSTGRES_USER` is the bootstrap administrator, not the backend login. The application password must match `DB_PASSWORD` above.

If Django is later containerized on the same Compose network, its host becomes `db` and its port is the container's `5432`. A Django process running on Windows uses the published host address and port shown above.

## Schema handoff

Start from the existing models and migrations, not a second implementation of the original vision document:

- `Shelter`: identity, location/country, contact information, website and verification flag.
- `Dog`: age, breed, size, sex, medical/personality information, adoption status, shelter relationship and one optional image.
- `ContactFormInquiry`: dog relationship, optional sender name, email, message and submission timestamp.

The current relationships are shelter -> many dogs -> many inquiries. Deletion currently cascades down these relationships; document and review this before using real records. `Dog.photos` currently stores one image path, despite its plural name; image files belong in media storage. See the [agreed image-storage approach](../Documents/IMAGE_STORAGE.md) for the rationale, cost considerations, ownership and backup responsibilities.

Record these decisions in `schema.md`:

1. Age units and search boundaries; currently `age` is an integer without a nonnegative constraint.
2. Size values (`small`, `medium`, `large`) and whether the frontend's `xlarge` option should be supported.
3. Country representation, allowed adoption statuses and required/optional values.
4. Differences from the wiki, including users/accounts and proposed audit fields. Django auth is installed already; design account-to-shelter relationships before adding another users table.
5. Naming policy. Proposed MVP default: Django-managed table/constraint names and the default PostgreSQL schema. The PDF mentions `live`, `_v`, `pk_`, `fk_` and `idx_`; record an explicit team decision before adopting or departing from those conventions.
6. Role policy. The PDF asks for admin/developer/application/analyst groups and personal accounts. Reconcile with the actual wiki scripts when available; do not assume these accounts already exist or copy example people blindly.
7. Index plan for country, sex, size, breed and adoption status. Review actual query patterns before adding indexes, particularly substring searches on country/breed. Audit fields, partitioning and archiving are follow-up design topics, not prerequisites for the small local demo.

## Handoff acceptance checklist

Once Compose and bootstrap files exist, document and verify these steps from `Database/`:

```powershell
Copy-Item .env.example .env
# Fill in the local credentials before starting.
docker compose up -d
docker compose ps
docker compose logs db
```

Then, with backend dependencies installed and `backend/.env` configured, run from `backend/`:

```powershell
python manage.py shell -c "from django.db import connection; print(connection.vendor); connection.ensure_connection(); print('Connected')"
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver
```

- [ ] Connection check prints `postgresql` and connects successfully.
- [ ] Committed migrations apply successfully to an empty PostgreSQL database.
- [ ] Existing seed command creates two shelters and three dogs; repeating it does not duplicate them.
- [ ] `GET http://127.0.0.1:8000/api/dogs/` returns seeded records.
- [ ] A valid `POST /api/inquiries/` is persisted and linked to the selected dog.
- [ ] Records survive a normal `docker compose down` followed by `docker compose up -d`; do not use volume-removal flags for this check.
- [ ] Another teammate can reproduce the setup using only the repository and their local configuration.
- [ ] Backend tests run on PostgreSQL using a separate test database and a development test role with database-creation permission; do not grant production runtime roles that permission just to run tests.

Deliver the Compose service name, image version, connection settings, setup instructions and any unresolved schema decisions to the backend teammate. See the [backend task plan](../backend/BACKEND_PLAN.md) for the integration work that follows.
