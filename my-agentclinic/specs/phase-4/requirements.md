# Requirements — Phase 4: Appointment Booking

## Stakeholder Requirements

| Stakeholder | Need |
|---|---|
| Mary (Engineering) | Reliable booking flow backed by SQLite; layered architecture consistent with agents/ailments/therapies modules; no new npm dependencies |
| Susan (Product) | Agents can view available time slots, book an appointment, view upcoming appointments, and cancel; slot inventory pre-seeded for each therapy |
| Steve (Marketing) | Appointments page accessible from agent profile; works on mobile, tablet, and desktop; simple enough to demo at a conference booth in under 60 seconds |

## Functional Requirements

| ID | Requirement |
|---|---|
| FR-4.1 | The system shall maintain a `slots` table of pre-seeded time slots, each linked to a therapy |
| FR-4.2 | An agent shall be able to view all available (unboooked) slots, optionally filtered by therapy |
| FR-4.3 | An agent shall be able to book any available slot (open booking — no ailment-matching required) |
| FR-4.4 | Booking a slot shall create an `appointment` record with status `confirmed` and mark the slot as `booked` |
| FR-4.5 | An agent shall be able to view their own upcoming appointments (status = `confirmed`) |
| FR-4.6 | An agent shall be able to cancel a confirmed appointment |
| FR-4.7 | Cancelling an appointment shall set appointment status to `cancelled` and return the slot to `available` |
| FR-4.8 | There is no limit on how many concurrent appointments an agent may hold |
| FR-4.9 | The frontend shall include an Appointments page reachable from the agent profile page |
| FR-4.10 | The Appointments page shall show available slots (filterable by therapy) and the agent's upcoming appointments |
| FR-4.11 | Slots shall be seeded at startup for all therapies (≥ 3 slots per therapy) if none exist |

## Data Model

### slots

| Field | Type | Notes |
|---|---|---|
| id | TEXT (UUID) | Primary key |
| therapyId | TEXT | Foreign key → therapies.id |
| startsAt | TEXT | ISO 8601 datetime string (e.g. `2026-06-10T10:00:00.000Z`) |
| status | TEXT | `available` \| `booked` |

### appointments

| Field | Type | Notes |
|---|---|---|
| id | TEXT (UUID) | Primary key |
| agentId | TEXT | Foreign key → agents.id |
| slotId | TEXT | Foreign key → slots.id |
| status | TEXT | `confirmed` \| `cancelled` |
| createdAt | TEXT | ISO 8601 datetime string |

## Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-4.1 | Reliability | Booking and cancellation are atomic: slot status and appointment record are updated in a single SQLite transaction |
| NFR-4.2 | Responsiveness | Appointments page is mobile-first; works at 320px, 768px, and 1024px+ breakpoints |
| NFR-4.3 | Consistency | Architecture follows the same types → repository → service → router layering as existing modules |
| NFR-4.4 | Demo-readiness | Seed data covers all 8 therapies with 3 slots each, using realistic near-future datetimes |
| NFR-4.5 | Correctness | A slot with status `booked` cannot be double-booked; the service enforces this check before inserting the appointment |

## Acceptance Criteria

- [ ] `GET /slots` returns all slots with status `available`
- [ ] `GET /slots?therapyId={id}` returns only slots for that therapy with status `available`
- [ ] `POST /appointments` with a valid agentId and available slotId returns 201 and an appointment object with status `confirmed`
- [ ] After a successful booking, `GET /slots` no longer includes the booked slot
- [ ] `POST /appointments` with a slotId that is already `booked` returns 409
- [ ] `POST /appointments` with a missing agentId or slotId returns 400
- [ ] `GET /appointments?agentId={id}` returns only that agent's confirmed appointments
- [ ] `GET /appointments?agentId={id}` requires agentId; omitting it returns 400
- [ ] `PATCH /appointments/:id/cancel` sets appointment status to `cancelled` and the corresponding slot status to `available`; returns 200
- [ ] `PATCH /appointments/:id/cancel` on an already-cancelled appointment returns 409
- [ ] `PATCH /appointments/:id/cancel` on a non-existent appointment returns 404
- [ ] Startup seeds ≥ 3 slots per therapy if the slots table is empty
- [ ] Appointments page is reachable from the agent profile page
- [ ] Appointments page shows available slots filterable by therapy name
- [ ] Appointments page shows the agent's upcoming (confirmed) appointments with a Cancel button per row
- [ ] Appointments page renders correctly on mobile (320px), tablet (768px), and desktop (1024px+)
