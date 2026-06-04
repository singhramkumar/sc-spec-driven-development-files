# Phase 4: Appointment Booking — Feature Spec & Implementation Plan

## Goal

Enable agents to browse available therapy time slots, book an appointment, view their upcoming appointments, and cancel if needed. Slots are pre-seeded at startup (≥ 3 per therapy). Booking and cancellation are atomic SQLite transactions. A new Appointments page in the frontend is reachable from the agent profile, designed mobile-first for conference booth demos.

## Data Model

### slots

| Field | Type | Constraints |
|---|---|---|
| id | TEXT | PRIMARY KEY (UUID) |
| therapyId | TEXT | NOT NULL |
| startsAt | TEXT | NOT NULL — ISO 8601 datetime |
| status | TEXT | NOT NULL — `available` \| `booked` |

### appointments

| Field | Type | Constraints |
|---|---|---|
| id | TEXT | PRIMARY KEY (UUID) |
| agentId | TEXT | NOT NULL |
| slotId | TEXT | NOT NULL |
| status | TEXT | NOT NULL — `confirmed` \| `cancelled` |
| createdAt | TEXT | NOT NULL — ISO 8601 datetime |

## REST Endpoints

| Method | Path | Description | Success Status |
|---|---|---|---|
| GET | /slots | List all available slots; optional `?therapyId=` filter | 200 |
| GET | /appointments | List an agent's appointments; `?agentId=` required | 200 |
| POST | /appointments | Book a slot — creates appointment + marks slot booked | 201 |
| PATCH | /appointments/:id/cancel | Cancel a confirmed appointment (soft delete) | 200 |

### POST /appointments — Request

```json
{
  "agentId": "550e8400-e29b-41d4-a716-446655440000",
  "slotId":  "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
}
```

### POST /appointments — Response (201)

```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "agentId": "550e8400-e29b-41d4-a716-446655440000",
  "slotId":  "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "status": "confirmed",
  "createdAt": "2026-06-04T14:00:00.000Z"
}
```

### PATCH /appointments/:id/cancel — Response (200)

```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "agentId": "550e8400-e29b-41d4-a716-446655440000",
  "slotId":  "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "status": "cancelled",
  "createdAt": "2026-06-04T14:00:00.000Z"
}
```

## Architecture

```
src/appointments/
  appointment.types.ts      # Slot, Appointment, AppointmentStatus, SlotStatus types
  appointment.repository.ts # IAppointmentRepository interface + SqliteAppointmentRepository
  appointment.service.ts    # Business logic (booking atomicity, status checks)
  appointment.router.ts     # Express router — 4 endpoints
  appointment.seed.ts       # Seed slots (3 per therapy) at startup
```

**Atomicity strategy:** booking and cancellation use `better-sqlite3` transactions so that slot status and appointment record are always updated together. If either write fails, the transaction rolls back.

**Filtering:** slot and appointment filtering is done in the SQL query (`WHERE status = 'available'`, `WHERE agentId = ?`) for correctness on potentially large datasets; no in-memory post-processing.

## Implementation Steps

1. **Types** — `appointment.types.ts`: define `SlotStatus`, `AppointmentStatus`, `Slot`, `Appointment`, `CreateAppointmentInput`
2. **Repository interface** — top of `appointment.repository.ts`: `IAppointmentRepository` with methods `findAvailableSlots(therapyId?)`, `findSlotById(id)`, `findAppointmentsByAgent(agentId)`, `findAppointmentById(id)`, `book(agentId, slotId)`, `cancel(id)`, `insertSlots(slots)`, `slotCount()`
3. **Repository implementation** — `SqliteAppointmentRepository`: creates `slots` and `appointments` tables, implements all methods; `book()` and `cancel()` use `db.transaction()`
4. **Service** — `appointment.service.ts`: `AppointmentService` wraps repository; `bookAppointment()` validates slot exists and is `available` before calling `repo.book()`; `cancelAppointment()` validates appointment exists and is `confirmed` before calling `repo.cancel()`
5. **Router** — `appointment.router.ts`: mount all 4 endpoints; validate required query params and body fields; delegate to service; map service errors to HTTP status codes
6. **Seed** — `appointment.seed.ts`: generates 3 future slots per therapy (spread across two weeks from a fixed seed date), calls `repo.insertSlots()` only if `repo.slotCount() === 0`
7. **Frontend** — add `appointments.html` and appointments section to `public/`; wire a link from the agent profile card; implement fetch calls to `/slots` and `/appointments?agentId=`; add Book and Cancel buttons with confirmation
8. **Wiring** — `src/index.ts`: import and mount `SqliteAppointmentRepository`, `AppointmentService`, `appointmentRouter`; call `seedSlots()` after therapy seed

## Out of Scope (Phase 4)

- Therapist schedule management (Phase 5)
- Staff view of all appointments (Phase 5)
- Rescheduling an appointment (no reschedule endpoint — cancel + rebook)
- Ailment-based therapy matching or booking restrictions
- Email or in-app notifications
- Pagination of slot or appointment lists
- Agent authentication / session management
