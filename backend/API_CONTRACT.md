# MVP frontend API contract

This guide documents the Django code and the frontend integration issue supplied by the backend teammate. It describes the existing integration endpoints; proposed changes are listed separately below. Examples are illustrative, not captured responses. Runtime integration has not been verified as part of this documentation task.

An API contract tells frontend developers which URL to call, what data to send and what data to expect back. Changes to these details must be coordinated between frontend and backend.

## Connection basics

- Local Django base URL: `http://localhost:8000` when started on its default port.
- Local Next.js origins allowed by default when `DEBUG=True`: `http://localhost:3000` and `http://127.0.0.1:3000`. Confirm the actual origin with frontend; see the configuration below if its port changes.
- Use the trailing slash on every endpoint, particularly POST requests.
- Request JSON with `Accept: application/json`. For JSON submissions, also send `Content-Type: application/json`.
- These MVP flows do not require user registration or JWT tokens. Public API actions are limited to dog/shelter reads and inquiry creation.
- Frontend calls Django; it never receives PostgreSQL credentials or connects directly to the database.

## Local CORS setup and browser check

CORS (Cross-Origin Resource Sharing) lets the browser read Django responses from a frontend on a different origin. An origin is the scheme, hostname and port: port 3000 and port 8000 are different origins, even on the same computer. Browser CORS rules do not apply to requests made directly from the Next.js server.

The backend uses `django-cors-headers`. After pulling the change, install dependencies from `backend/` in your activated virtual environment:

```powershell
python -m pip install -r requirements.txt
python manage.py runserver
```

To replace the allowed origins, add this setting to your existing `backend/.env` and restart Django:

```dotenv
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Use comma-separated origins with no path or trailing slash. If Next.js starts on port 3001, add its exact origin. An explicitly empty setting allows no cross-origin reads. With `DEBUG=False`, no origins are allowed by default; configure the actual deployed frontend origins explicitly.

CORS headers apply only to `/api/` routes. Allowed browser methods are GET, HEAD, POST and OPTIONS; the API view still decides whether each method exists on a particular endpoint. Cross-origin cookies are not enabled. Public frontend calls should omit `credentials: "include"`; do not use `mode: "no-cors"`, which prevents JavaScript from reading the response. CORS is separate from API authorization, `ALLOWED_HOSTS` and CSRF protection, and is not an anti-spam control.

A browser JSON POST normally triggers an OPTIONS preflight before the actual POST. Django answers with allowed origins, methods and headers. An unapproved origin receives no `Access-Control-Allow-Origin` header: the browser denies access, even if a direct GET request returns status 200. CORS does not generally prevent requests or data changes made by non-browser clients.

Once Next.js is running, open its page at `http://localhost:3000`, open the browser developer console, and run:

```javascript
fetch("http://localhost:8000/api/dogs/", {
  headers: { Accept: "application/json" },
}).then(async (response) => console.log(response.status, await response.json()));
```

Expect `200` and an array. In the Network tab, the response should include `Access-Control-Allow-Origin: http://localhost:3000`. To check preflight and readable validation errors without saving an inquiry:

```javascript
fetch("http://localhost:8000/api/inquiries/", {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  body: JSON.stringify({ user_email: "invalid", message: "" }),
}).then(async (response) => console.log(response.status, await response.json()));
```

Expect a successful OPTIONS preflight (unless cached), followed by `400` with field errors. The existing inquiry payload below can be used for a successful submission with a real dog ID. Automated backend tests cover CORS headers, preflight, allowed and unapproved origins, successful persistence and readable errors. Actual Next.js browser integration remains to be checked together.

Reference: [django-cors-headers setup and configuration](https://github.com/adamchainz/django-cors-headers).

## Supported integration endpoints

| Method and path | Purpose | Successful response |
| --- | --- | --- |
| `GET /api/dogs/` | List/filter dogs | `200`, JSON array of dog objects |
| `GET /api/dogs/{id}/` | Read one dog | `200`, one dog object with its shelter |
| `GET /api/shelters/` | List shelters | `200`, JSON array of shelter objects |
| `POST /api/inquiries/` | Save an adoption inquiry | `201`, saved inquiry object |

`{id}` means the numeric ID received from the API, not the dog's name or a hardcoded card number. List endpoints currently have no pagination wrapper: read the array itself, not `response.results`. An empty list is `[]` with status `200`.

Dogs and shelters are read-only through the API, including for logged-in users. POST to their collection URLs and PUT/PATCH/DELETE to their detail URLs return `405 Method Not Allowed`. Shelter detail reads remain available at `/api/shelters/{id}/`.

Inquiries support POST and OPTIONS at `/api/inquiries/`; GET/HEAD/PUT/PATCH/DELETE return `405`. There is no inquiry detail route: `/api/inquiries/{id}/` returns `404`. Manage listings and review inquiries through Django admin with the appropriate account permissions. Anonymous access restrictions and successful inquiry persistence are covered by backend tests.

## Dog search and filters

```text
GET /api/dogs/?country=Estonia
GET /api/dogs/?sex=female&size=medium
GET /api/dogs/?adoption_status=available
```

| Parameter | Values / matching in current code |
| --- | --- |
| `country` | Case-insensitive substring of shelter country, e.g. `Estonia` |
| `sex` | Exact `male` or `female`; `all` also disables this filter |
| `size` | One exact value: `small`, `medium`, `large` |
| `breed` | Case-insensitive substring, e.g. `labrador` |
| `adoption_status` | Exact `available`, `pending`, `adopted` |

Filters combine with AND: `sex=female&size=medium` means both conditions must match. Dogs are ordered by ID ascending. Omit unused filters; empty values also skip those filters. Use `URLSearchParams` to encode values containing spaces or other special characters.

Current limitations the frontend must understand:

- No age filtering. Sending `age`, `age_min` or `age_max` currently has no effect.
- Only one size is supported. Repeated size parameters currently use the last value; comma-separated sizes are not supported.
- Unknown query parameter names are ignored. Invalid sex/size/status values are not explicitly validated and normally produce an empty result, not a `400` validation error.
- Without an adoption-status filter, all statuses are included. Unverified shelters are not excluded by the current queryset.
- The dog detail view uses the same filtered queryset. Request details by ID without carrying search parameters over; a filter that excludes that dog can cause a `404`.

## Dog and shelter response shapes

A detail response has the following shape. A list response contains objects of this same shape inside an array.

```json
{
  "id": 1,
  "name": "Luna",
  "age": 2,
  "breed": "Labrador",
  "size": "medium",
  "sex": "female",
  "medical_history": "Vaccinated and healthy.",
  "personality_traits": "Friendly and playful.",
  "adoption_status": "available",
  "photos": null,
  "shelter": {
    "id": 1,
    "name": "Example Shelter",
    "location": "Tallinn",
    "country": "Estonia",
    "contact_email": "shelter@example.com",
    "contact_phone": "+3725550000",
    "website": "https://example.com",
    "verified": true
  }
}
```

- `shelter` is an object containing contact information, not just an ID. `/api/shelters/` returns an array of objects with these same shelter fields; shelter list ordering is not specified.
- `age` is currently an integer. The UI treats it as years, but age units and range boundaries need explicit team agreement before adding age search.
- `medical_history`, `personality_traits` and `website` can be `null` or empty strings. Provide a sensible display fallback.
- `photos` is one optional image URL value, not an array. It is `null` when no image is assigned. Local image serving is configured under `/media/` when `DEBUG=True`. Use the returned URL directly and show a placeholder on absent/failed images. See the [shared image-storage guide](../Documents/IMAGE_STORAGE.md) for uploading through admin, storage ownership and production plans.
- Do not assume IDs start at 1 or that names are unique.

## Submit an inquiry

Send this JSON body to `POST /api/inquiries/`:

```json
{
  "dog": 1,
  "user_name": "Maria",
  "user_email": "maria@example.com",
  "message": "I would like to learn more about Luna."
}
```

| Field | Requirement |
| --- | --- |
| `dog` | Required: ID of an existing dog |
| `user_name` | Optional: text up to 255 characters; omission, null or empty string is accepted |
| `user_email` | Required: valid email address, maximum 254 characters |
| `message` | Required: non-empty text; surrounding whitespace is removed |

Do not send `id` or `submission_date`; Django generates them. The current code does not restrict inquiries by adoption status or shelter verification.

Successful response: `201 Created`, with this illustrative body:

```json
{
  "id": 12,
  "dog": 1,
  "user_name": "Maria",
  "user_email": "maria@example.com",
  "message": "I would like to learn more about Luna.",
  "submission_date": "2026-09-23T10:00:00Z"
}
```

The timestamp is server-generated; do not depend on an exact fractional-second format. Success means the inquiry was stored. No email is sent. Suitable UI text: “Your inquiry has been submitted.”

## Errors and frontend behavior

| Situation | Status / behavior | Frontend action |
| --- | --- | --- |
| No matching dogs | `200`, `[]` | Show an empty-results message |
| Missing dog detail | `404`, JSON `detail` message | Show dog not found and a link back to results |
| Invalid inquiry fields | `400`, field names mapped to message arrays | Show errors next to the corresponding inputs |
| Malformed JSON | `400`, usually a `detail` message | Show a general submission error |
| Server failure | `5xx`; response may not be JSON | Show a general error and allow a deliberate retry |
| Server unreachable / browser CORS failure | No readable HTTP response | Show a connection error |

Illustrative field-error shape (wording is not part of the contract):

```json
{
  "user_email": ["Enter a valid email address."],
  "message": ["This field may not be blank."]
}
```

Handle general errors as well as field errors; do not assume every error has the same shape. Check HTTP status before showing success: an inquiry succeeds with `201`, not `200`. Disable the submit button while its request is running. Inquiry creation is not idempotent, so automatically retrying POST requests could create duplicates.

## Proposed decisions for frontend/backend review

The baseline above is documented. These extensions and policy choices are **not yet agreed or implemented**:

| Decision | Recommendation to review |
| --- | --- |
| Local origin | CORS now allows local Next.js on port 3000 in development; confirm the frontend's actual address and override the allowlist if needed |
| Age search | Add inclusive `age_min` / `age_max` in whole years; change UI categories to non-overlapping boundaries, for example 0–1, 2–5, 6+ |
| Multiple sizes | Accept repeated values such as `size=small&size=medium`, matching either size |
| Extra-large size | Keep the existing three values for MVP and remove `xlarge` from the UI unless the team chooses a schema extension |
| All countries | Omit `country`; fix the current static UI's “All Countries” value, which is incorrectly `estonia` |
| Public visibility | Agree whether available dogs and verified shelters are required by default, and what happens on detail pages for other dogs |
| Invalid filters | Add explicit validation and `400` errors when implementing filter extensions |

Frontend should implement the supported baseline or use sample data for controls awaiting agreement. Do not present an unsupported filter as working. Once a decision is agreed, update this guide in the same change as its implementation and tests.

## Contract handoff checklist

- [x] Document the current endpoints, filters, data shapes and error handling.
- [x] Compare the baseline with the supplied frontend integration issue.
- [ ] Frontend/backend review the proposed decisions together.
- [x] Restrict public API actions and test blocked requests, public reads and inquiry persistence on SQLite.
- [x] Configure API CORS and test preflight, origin restrictions, success and error responses.
- [x] Configure development media serving and test admin upload, API image URLs, downloads and missing images.
- [ ] Verify PostgreSQL integration and actual frontend image display.
- [ ] Verify search -> detail -> inquiry against the Next.js frontend and PostgreSQL.

Code references: [views](shelters/views.py), [serializers](shelters/serializers.py), [models](shelters/models.py), [routes](shelters/urls.py). Remaining work: [backend plan](BACKEND_PLAN.md).
