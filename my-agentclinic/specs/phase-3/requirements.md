# Requirements — Phase 3: Therapy Catalog

---

## Stakeholder Requirements

| Stakeholder | Role        | Relevant Requirements (Phase 3)                                        |
|-------------|-------------|------------------------------------------------------------------------|
| Mary        | Engineering | TypeScript stack; layered architecture consistent with Phase 1–2       |
| Susan       | Product     | Agents can browse available therapies, filter by name/therapist/category |
| Steve       | Marketing   | Attractive, responsive therapy catalog page; mobile-friendly           |

---

## Functional Requirements

| ID      | Requirement                                                                                      |
|---------|--------------------------------------------------------------------------------------------------|
| FR-3.1  | The system shall expose a `GET /therapies` endpoint that returns all therapies                   |
| FR-3.2  | The system shall expose a `GET /therapies/:id` endpoint that returns a single therapy by ID      |
| FR-3.3  | `GET /therapies` shall accept an optional `search` query param for case-insensitive name matching |
| FR-3.4  | `GET /therapies` shall accept an optional `therapist` query param for case-insensitive therapist-name matching |
| FR-3.5  | `GET /therapies` shall accept an optional `category` query param for exact category filtering    |
| FR-3.6  | Multiple filter params may be combined; all applied filters must match (AND logic)               |
| FR-3.7  | The therapy catalog shall be seeded with at least 6 therapies on startup when the table is empty |
| FR-3.8  | The API shall be read-only; no create, update, or delete endpoints are exposed                   |
| FR-3.9  | The frontend shall include a responsive therapies page listing all therapies as cards            |
| FR-3.10 | Each therapy card shall display: name, therapist, duration, category, and a short description excerpt |
| FR-3.11 | The frontend shall provide a search input that filters therapies by name in real time (client-side) |
| FR-3.12 | The frontend shall provide a category dropdown that filters therapies by category                |
| FR-3.13 | The frontend shall provide a therapist search/filter input                                       |
| FR-3.14 | Clicking a therapy card shall show the full therapy details (modal or expanded view)             |

---

## Data Model

### Therapy

| Field         | Type    | Constraints                                                   |
|---------------|---------|---------------------------------------------------------------|
| `id`          | string  | UUID v4, primary key, server-generated                        |
| `name`        | string  | Required, non-empty                                           |
| `description` | string  | Required, non-empty; full text shown in detail view           |
| `duration`    | integer | Required, positive integer, represents minutes                |
| `therapist`   | string  | Required, non-empty; therapist's name as a plain string       |
| `category`    | string  | Required; one of the seeded category values (see below)       |
| `createdAt`   | string  | ISO 8601 timestamp, set on insert, never updated              |

### Allowed Categories

```
cognitive
physical
relaxation
social
creative
```

---

## Non-Functional Requirements

| ID     | Category          | Requirement                                                                          |
|--------|-------------------|--------------------------------------------------------------------------------------|
| NFR-1  | Language          | All server-side code shall be TypeScript with strict mode enabled                    |
| NFR-2  | Architecture      | The therapies module shall follow the same types / repository / service / router layering as the agents module |
| NFR-3  | Persistence       | Therapy data shall be stored in SQLite, seeded on first startup                      |
| NFR-4  | Responsive Design | The therapies UI page shall be mobile-first, correct at 320px+, 768px+, 1024px+     |
| NFR-5  | Touch-friendly    | Therapy cards and filter controls shall meet a minimum 44px touch target height      |
| NFR-6  | Performance       | Filtering on the frontend shall be instantaneous (client-side, no extra API calls)   |

---

## Acceptance Criteria

Phase 3 is complete when all of the following pass:

- [ ] `GET /therapies` returns 200 with an array of all seeded therapies
- [ ] `GET /therapies?search=stress` returns only therapies whose name contains "stress" (case-insensitive)
- [ ] `GET /therapies?therapist=aria` returns only therapies whose therapist name contains "aria" (case-insensitive)
- [ ] `GET /therapies?category=cognitive` returns only therapies in the "cognitive" category
- [ ] `GET /therapies?search=stress&category=cognitive` applies both filters with AND logic
- [ ] `GET /therapies/:id` returns 200 with the therapy when it exists
- [ ] `GET /therapies/:id` returns 404 when no therapy with that ID exists
- [ ] At least 6 therapies are available in the seeded catalog covering at least 3 categories
- [ ] The therapies page renders all therapy cards in a responsive grid
- [ ] The search input filters cards in real time without a page reload
- [ ] The category dropdown filters cards without a page reload
- [ ] Selecting a therapy card reveals full details (description, duration, therapist)
- [ ] The therapies page is usable on mobile (320px), tablet (768px), and desktop (1024px)
