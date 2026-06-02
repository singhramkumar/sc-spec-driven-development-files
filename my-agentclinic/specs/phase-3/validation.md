# Validation Rules — Phase 3: Therapy Catalog

All validation is enforced at the service layer. The router passes raw query params / route params to the service; the service returns structured errors the router maps to HTTP responses.

---

## Therapy Fields (Read-Only API)

Because therapies are seeded server-side, client-writable field validation does not apply. Seed data is validated at development time (the seed array must conform to the `Therapy` interface with TypeScript strict mode).

---

## Validation Behaviour by Endpoint

### GET /therapies

No required parameters. All query params are optional.

| Param       | Rule                                                                 | On violation                             |
|-------------|----------------------------------------------------------------------|------------------------------------------|
| `search`    | Optional string. If present, may be empty (treated as no filter).   | No error; empty string → no filter applied |
| `therapist` | Optional string. If present, may be empty (treated as no filter).   | No error; empty string → no filter applied |
| `category`  | Optional string. If present and non-empty, must be one of the allowed category values (case-insensitive). | Return 400 with `{ "error": "Invalid category value" }` |

Always returns 200 with an array. Empty array is valid when no therapies match the filters.

#### Allowed Category Values

```
cognitive
physical
relaxation
social
creative
```

Case is normalised to lowercase before comparison; `COGNITIVE` and `Cognitive` are accepted.

### GET /therapies/:id

No body or query param validation.

| Scenario                      | Status | Body                                     |
|-------------------------------|--------|------------------------------------------|
| Therapy found                 | 200    | Therapy object                           |
| No therapy with that `id`     | 404    | `{ "error": "Therapy not found" }`       |

The `id` value is treated as an opaque string; no UUID-format check is performed (a malformed ID simply won't match any row and returns 404).

---

## Filter Combination Rules

- Multiple params applied together use AND logic: a therapy must satisfy all supplied (non-empty) filters.
- `search` and `therapist` use case-insensitive substring matching (SQL `LIKE '%value%'`).
- `category` uses case-insensitive exact matching (SQL `= lower(value)`).

---

## Error Response Shape

All errors use the same envelope as the rest of the API:

```json
{ "error": "<message>" }
```

No stack traces or internal details are included.

---

## Seed Data Integrity

The seed array in `therapy.seed.ts` must satisfy all of the following at the TypeScript level:

- `name`, `description`, `therapist` — non-empty strings
- `duration` — positive integer (> 0)
- `category` — one of the five allowed values
- `id` — UUID v4 generated at seed time
- `createdAt` — ISO 8601 string

Seed insertion is skipped entirely if the `therapies` table already contains rows (idempotent startup behaviour).
