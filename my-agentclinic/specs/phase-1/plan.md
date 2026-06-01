# Phase 1: Agent Dashboard — Feature Spec & Implementation Plan

## Goal

REST API for agents to view and manage their profiles. API layer only; no HTML UI. Covered by unit tests using mocked dependencies.

---

## Data Model

### Agent

| Field        | Type      | Constraints                              |
|--------------|-----------|------------------------------------------|
| `id`         | string    | UUID v4, primary key                     |
| `name`       | string    | required, non-empty                      |
| `email`      | string    | required, unique, valid email format     |
| `status`     | enum      | `active` \| `inactive` \| `in-therapy`  |
| `specialty`  | string    | required, non-empty (e.g. "coding assistant", "customer service") |
| `createdAt`  | string    | ISO 8601 timestamp, set on create        |
| `updatedAt`  | string    | ISO 8601 timestamp, updated on every write |

---

## REST Endpoints

| Method | Path           | Description               | Success |
|--------|----------------|---------------------------|---------|
| GET    | /agents        | List all agents           | 200     |
| POST   | /agents        | Create a new agent        | 201     |
| GET    | /agents/:id    | Get agent by ID           | 200     |
| PUT    | /agents/:id    | Update agent fields       | 200     |

### POST /agents — Request Body

```json
{
  "name": "Atlas",
  "email": "atlas@agentclinic.dev",
  "specialty": "coding assistant",
  "status": "active"
}
```

### PUT /agents/:id — Request Body (all fields optional)

```json
{
  "name": "Atlas v2",
  "status": "in-therapy"
}
```

### Error Responses

| Scenario                        | Status | Body                                  |
|---------------------------------|--------|---------------------------------------|
| Agent not found                 | 404    | `{ "error": "Agent not found" }`      |
| Missing required field          | 400    | `{ "error": "<field> is required" }`  |
| Invalid email format            | 400    | `{ "error": "Invalid email format" }` |
| Invalid status value            | 400    | `{ "error": "Invalid status value" }` |
| Duplicate email                 | 409    | `{ "error": "Email already in use" }` |

---

## Architecture

Layered design with a repository interface so tests can inject a mock without touching SQLite.

```
src/
  agents/
    agent.types.ts        # Agent interface and AgentStatus enum
    agent.repository.ts   # IAgentRepository interface + SqliteAgentRepository
    agent.service.ts      # Business logic (validation, ID/timestamp generation)
    agent.router.ts       # Express router — thin, delegates to service
    agent.router.test.ts  # Unit tests (mock repository injected)
    agent.service.test.ts # Unit tests for service validation logic
  index.ts                # App bootstrap (Express + routes)
```

---

## Implementation Steps

1. **Dependencies** — install `express`, `better-sqlite3`, `uuid`; install `@types/*`, `jest`, `ts-jest`, `supertest` as devDependencies; add `test` script to `package.json`.

2. **`agent.types.ts`** — define `AgentStatus` enum and `Agent` interface.

3. **`agent.repository.ts`** — define `IAgentRepository` interface; implement `SqliteAgentRepository` backed by `better-sqlite3` (creates `agents` table if not exists).

4. **`agent.service.ts`** — validate inputs, generate UUID + timestamps, delegate CRUD to the repository interface.

5. **`agent.router.ts`** — Express router with four routes; accepts `IAgentRepository` via constructor so tests can inject a mock.

6. **`index.ts`** — wire Express app, mount router at `/agents`, start server.

7. **`agent.service.test.ts`** — unit tests for all validation branches (missing fields, bad email, bad status, duplicate email).

8. **`agent.router.test.ts`** — unit tests for all four endpoints using `supertest` and an in-memory mock repository; covers success paths and error cases.

---

## Testing Scope

- All four happy paths (list, create, get, update)
- All documented error cases (400, 404, 409)
- Validation logic isolated in service tests
- No real SQLite file used in tests; mock repository implements `IAgentRepository`

---

## Out of Scope (Phase 1)

- HTML/browser UI (deferred to Phase 2)
- Authentication
- Pagination / filtering
- DELETE endpoint (Phase 2+)
- Ailments, therapies, appointments

---

## UI Implementation Notes

When the web UI is implemented in Phase 2+, it shall follow these responsive design principles:
- **Mobile-First Approach**: Start with mobile layout, progressively enhance for larger screens
- **Flexible Layouts**: Use CSS Grid and Flexbox for flexible, responsive layouts
- **Media Queries**: Implement breakpoints at 320px (mobile), 768px (tablet), 1024px (desktop)
- **Responsive Typography**: Scale font sizes and spacing proportionally across devices
- **Touch Optimization**: Ensure buttons and interactive elements are touch-friendly (minimum 44px height)
- **Image Optimization**: Use responsive images with srcset for different screen sizes
- **Performance**: Minimize CSS/JS bundle size for faster mobile load times
