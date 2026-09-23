# Backend integration plan

Based on the team leader's [task overview dated 2026-09-16](../Documents/Get%20a%20Pet%20-%20Backend%20Frontend%20Database%20Task%20Overview.pdf), checked against repository code on 2026-09-23. The backend teammate has since supplied the frontend integration issue text; the wiki remains unreviewed. This is a plan, not a record of implemented changes or passing tests.

The [MVP API contract](API_CONTRACT.md) now documents the current behavior and matches the supplied integration issue. Age filtering and multiple sizes are proposed extensions, not part of that issue's existing contract. Team agreement on the proposed decisions and runtime verification remain pending. Frontend is prioritizing Next.js setup before API integration; backend work can proceed in parallel.

## Goal and existing foundation

Milestone 1 is a local prototype connecting frontend, backend and database: search dogs, filter results, view details and shelter contact information, and submit an inquiry. The PDF explicitly excludes authentication, shelter dashboard, search performance tuning, email notifications and deployment from issue #1's integration scope (page 4).

Already present in the code:

- Django and Django REST Framework, with SQLite default and PostgreSQL configuration through environment variables.
- `Shelter`, `Dog` and `ContactFormInquiry`, committed migrations and admin registrations.
- `/api/shelters/`, `/api/dogs/`, `/api/inquiries/` and detail routes.
- Country, sex, size, breed and adoption-status filtering; nested shelter information on dog responses.
- Inquiry validation, a demo seed command and seventeen API/media tests. All seventeen pass on an isolated SQLite test database using the existing environment (Django 5.2.17, DRF 3.18.1, django-cors-headers 4.9.0); PostgreSQL and browser integration remain unverified.

## Work requested by the PDF for MVP integration

| Task | Current gap | Completion evidence |
| --- | --- | --- |
| Enable frontend API access | CORS implemented with a configurable allowlist and API-only scope; automated checks pass | Verify browser GET and inquiry POST from the actual Next.js origin; instructions are in the API contract |
| Reconcile filters | Backend has no age filter and reads only one size value | Agreed query parameters, documented boundaries and tests for combined filters |
| Serve dog images | Local media storage and development serving implemented; admin upload and API image retrieval tested | Verify actual frontend image display and fallback; see [image-storage guide](../Documents/IMAGE_STORAGE.md) |
| Reconcile Django versions | Python 3.14.3 and Django 5.2.17 baseline documented; all direct/transitive dependencies pinned | Fresh Windows environment installed successfully; dependency checks, model/migration checks, empty SQLite migrations, repeated seeding, API smoke check and all 17 tests pass. PostgreSQL/other platforms remain pending |
| Stabilize API contract | Baseline documented in [API_CONTRACT.md](API_CONTRACT.md); proposed decisions await team review | Review with frontend, agree on proposed changes and verify responses during integration |

CORS is required when the browser calls a different origin; the PDF's claim that every frontend request will be blocked does not apply to same-origin hosting. CORS also does not replace permissions.

The migration header alone does not prove incompatibility. Migration 0002 contains a simple `AddField`; verify it under the selected Django version rather than rewriting migration history just to change the comment.

## Additional findings from the code review

These are architecture recommendations beyond the PDF's immediate task list:

1. **API access restriction implemented.** Dogs and shelters now use read-only viewsets; inquiries use a create-only viewset. Explicit public permissions allow visitors to use those limited actions. Anonymous listing writes return 405, inquiry collection reads return 405, and inquiry detail routes are absent (404). Tests verify these restrictions, unchanged stored records and successful inquiry persistence. Maintenance remains in authenticated Django admin. JWT remains later work. See [DRF viewsets](https://www.django-rest-framework.org/api-guide/viewsets/).
2. **Resolve the complete filter mismatch.** The frontend sends age categories `0-1`, `1-5`, `6+`, including overlapping labels at age 1, and offers `xlarge`, which the model rejects. It also gives “All Countries” the value `estonia`. Agree on age units/boundaries, size values and an empty country value for all countries. Recommended API direction: explicit `age_min`/`age_max` in whole years and repeated sizes (`size=small&size=medium`), preserving existing single-size requests. This is proposed behavior, not implemented behavior; frontend labels must match the chosen boundaries.
3. **Define listing visibility.** The current dog queryset includes all statuses unless filtered and does not require a verified shelter. Agree whether public search defaults to available dogs and how pending/adopted dogs and unverified shelters appear in both list and detail views.
4. **Plan the future dog-write serializer.** The nested `shelter` field is read-only, so normal API dog creation cannot provide the required relationship. When self-service is implemented, derive the shelter from the authenticated account and enforce ownership on every operation.
5. **Keep inquiry promises accurate.** The API stores inquiries but does not send emails. The MVP interface should confirm receipt without claiming the shelter was emailed. Agree on how staff review inquiries during the prototype.

## Suggested implementation order

1. Agree with frontend on origin/port, age and size semantics, country values, listing visibility and the API contract. Preserve the current bare-array list response unless a coordinated change is agreed.
2. API action restrictions and CORS are implemented and tested on SQLite. Development media serving is also implemented and tested. Next verify CORS and image display in the actual frontend browser flow. Keep development media serving separate from the later deployment setup.
3. Implement agreed filter changes and validation. Add focused tests for boundaries, multiple sizes, invalid values, permission restrictions and the existing inquiry flow.
4. Connect to the database teammate's PostgreSQL setup using the [database handoff](../Database/README.md); apply migrations and seed data. Verify the selected Django version on a clean environment and run the backend tests against PostgreSQL.
5. Pair with frontend on search -> dog detail -> inquiry submission. Check loading/empty/error states, invalid input, missing dog IDs and image fallbacks. Verify the supplied integration issue's acceptance criteria before closing it.

The local prototype is complete when another teammate can start the database and backend from documented setup instructions, browse real database records in the frontend and submit an inquiry that persists, without exposing inquiry records through public read endpoints.

## Later work listed in the PDF

- Shelter JWT authentication, account-to-shelter permissions and self-service listing management.
- Cross-language breed search and dynamic description translation.
- Profile-expiry notifications and adoption-status automations.
- Production hosting and deployment, with tests extended for new endpoints.
- Users/account model reconciliation with the original schema; reuse or extend Django authentication deliberately.

Coordinate database audit fields, role/naming policy, indexing and eventual archiving with the database teammate. Defer partitioning until data and query evidence justify it. Pricing, hosting provider and other open product decisions in the PDF remain team decisions.
