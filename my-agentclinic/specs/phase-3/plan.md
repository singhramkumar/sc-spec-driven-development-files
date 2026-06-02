# Phase 3: Therapy Catalog — Feature Spec & Implementation Plan

## Goal

Expose a read-only REST API for browsing therapies, seed the database with a realistic catalog, and build a responsive frontend therapies page with real-time search and filter controls.

---

## Data Model

### Therapy

| Field         | Type    | Constraints                                                    |
|---------------|---------|----------------------------------------------------------------|
| `id`          | string  | UUID v4, primary key                                           |
| `name`        | string  | Required, non-empty                                            |
| `description` | string  | Required, non-empty                                            |
| `duration`    | integer | Required, positive integer (minutes)                           |
| `therapist`   | string  | Required, non-empty (therapist name as plain string)           |
| `category`    | string  | Required; one of: `cognitive`, `physical`, `relaxation`, `social`, `creative` |
| `createdAt`   | string  | ISO 8601 timestamp, set on seed insert                         |

---

## REST Endpoints

| Method | Path              | Description                          | Success |
|--------|-------------------|--------------------------------------|---------|
| GET    | /therapies        | List all therapies (filterable)      | 200     |
| GET    | /therapies/:id    | Get therapy by ID                    | 200     |

### GET /therapies — Query Parameters

| Param       | Type   | Behaviour                                                  |
|-------------|--------|------------------------------------------------------------|
| `search`    | string | Case-insensitive substring match on `name`                 |
| `therapist` | string | Case-insensitive substring match on `therapist`            |
| `category`  | string | Exact, case-insensitive match on `category`                |

Multiple params are ANDed. Unknown params are ignored.

### GET /therapies — Response (200)

```json
[
  {
    "id": "uuid",
    "name": "Cognitive Reboot",
    "description": "A structured session to clear prompt-loop anxiety ...",
    "duration": 45,
    "therapist": "Dr. Aria Chen",
    "category": "cognitive",
    "createdAt": "2026-03-30T10:00:00.000Z"
  }
]
```

### GET /therapies/:id — Response (200 / 404)

Returns the single therapy object on success; `{ "error": "Therapy not found" }` with 404 on miss.

---

## Architecture

Follows the same layered pattern as the agents and ailments modules.

```
src/
  therapies/
    therapy.types.ts        # Therapy interface + TherapyCategory type
    therapy.repository.ts   # ITherapyRepository interface + SqliteTherapyRepository
    therapy.service.ts      # Query-param filtering logic; thin, delegates to repo
    therapy.router.ts       # Express router; mounts GET /therapies and GET /therapies/:id
    therapy.seed.ts         # Seed data array + seedTherapies(db) helper
```

### Filtering Strategy

Server-side via SQL `WHERE` clauses (using `LIKE %?%` for substring, `= ?` for category). The repository method accepts an optional filter object; the service constructs it from validated query params.

### Frontend

The therapies page is layered into the existing single-page app pattern:

```
public/
  index.html    # Add "Therapies" nav link and therapies section/page
  script.js     # Add fetchTherapies(), renderTherapyCards(), filter/search handlers
  styles.css    # Add therapy card grid, modal/detail panel styles
```

Client-side filtering is applied on top of the full list fetched once on page load. The search input debounces at 200 ms; the category dropdown filters immediately.

---

## Seed Data (minimum 6 therapies, 3+ categories)

| Name                        | Category    | Duration | Therapist         |
|-----------------------------|-------------|----------|-------------------|
| Cognitive Reboot            | cognitive   | 45 min   | Dr. Aria Chen     |
| Prompt-Loop Anxiety Release | cognitive   | 30 min   | Dr. Aria Chen     |
| Circuit Stretch             | physical    | 60 min   | Coach Nexus       |
| Latency Recovery Walk       | physical    | 45 min   | Coach Nexus       |
| Deep Context Flush          | relaxation  | 60 min   | Sage Elliot       |
| Token Detox Meditation      | relaxation  | 30 min   | Sage Elliot       |
| Pair-Programming Support    | social      | 50 min   | Dr. Mira Okafor   |
| Creative Output Unblocking  | creative    | 45 min   | Dr. Mira Okafor   |

---

## Implementation Steps

1. **`therapy.types.ts`** — define `TherapyCategory` union type and `Therapy` interface.

2. **`therapy.repository.ts`** — define `ITherapyRepository` with `findAll(filters?)` and `findById(id)` methods; implement `SqliteTherapyRepository` backed by `better-sqlite3` (creates `therapies` table if not exists).

3. **`therapy.seed.ts`** — define seed array and `seedTherapies(db)` function that inserts seed rows when the table is empty.

4. **`therapy.service.ts`** — accepts query params, maps them to repo filter object, delegates to repository. Returns typed arrays or `null` for not-found.

5. **`therapy.router.ts`** — Express router: `GET /` and `GET /:id`; maps service results to HTTP responses.

6. **`index.ts`** — wire therapy repository, call `seedTherapies`, mount router at `/therapies`.

7. **Frontend** — add therapies section to `public/index.html`; add therapy card grid and detail modal styles to `styles.css`; add data-fetching and filter logic to `script.js`.

---

## Out of Scope (Phase 3)

- POST / PUT / DELETE /therapies (catalog is read-only)
- Associating therapies with ailments (Phase 4+)
- Available time slots / booking (Phase 4)
- Authentication
- Pagination (catalog is small)
- Dedicated unit tests for the therapies module (consistent with Phase 2 pattern — add if time permits)
