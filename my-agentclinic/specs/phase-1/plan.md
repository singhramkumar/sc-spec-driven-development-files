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
  test/
    agents/
      agent.router.test.ts  # Unit tests (mock repository injected)
      agent.service.test.ts # Unit tests for service validation logic
  index.ts                # App bootstrap (Express + routes)
```

---

## Implementation Status

✅ **Complete** — All CRUD endpoints, validation, and tests implemented.

---

## Testing Scope

- All four happy paths (list, create, get, update)
- All documented error cases (400, 404, 409)
- Validation logic isolated in service tests
- No real SQLite file used in tests; mock repository implements `IAgentRepository`

---

## Notes for Phase 2+

When web UI is introduced (Phase 2), all Agent API responses will be rendered as **responsive HTML** following mobile-first design:

- Forms for agent creation/editing will be optimized for touch on mobile
- Agent list will adapt from single-column (mobile) → multi-column (tablet/desktop)
- All pages must meet WCAG AA accessibility standards
- Browser support: modern browsers (no IE11)

---

## Out of Scope (Phase 1)

- HTML/browser UI
- Authentication
- Pagination / filtering
- DELETE endpoint (Phase 2+)
- Ailments, therapies, appointments
