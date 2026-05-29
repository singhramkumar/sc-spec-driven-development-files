# Validation Rules — Phase 1: Agent Dashboard

All validation is enforced in the service layer before any database operation. The router passes raw request body fields to the service; the service returns structured errors that the router maps to HTTP responses.

---

## Agent Fields

| Field       | Rule                                                                 | Error Message              | Status |
|-------------|----------------------------------------------------------------------|----------------------------|--------|
| `name`      | Required. Non-empty string after trimming whitespace.               | `"name is required"`       | 400    |
| `email`     | Required. Must match standard email format (`local@domain.tld`).    | `"email is required"` / `"Invalid email format"` | 400 |
| `email`     | Must be unique across all agents.                                   | `"Email already in use"`   | 409    |
| `specialty` | Required. Non-empty string after trimming whitespace.               | `"specialty is required"`  | 400    |
| `status`    | Required on create. Must be one of: `active`, `inactive`, `in-therapy`. | `"status is required"` / `"Invalid status value"` | 400 |
| `id`        | Generated server-side (UUID v4). Never accepted from the client.    | —                          | —      |
| `createdAt` | Generated server-side (ISO 8601). Never accepted from the client.   | —                          | —      |
| `updatedAt` | Generated server-side (ISO 8601). Never accepted from the client.   | —                          | —      |

---

## Validation Behaviour by Endpoint

### POST /agents (create)

All fields are required. Validation runs in this order:

1. `name` — present and non-empty?
2. `email` — present, non-empty, valid format?
3. `specialty` — present and non-empty?
4. `status` — present and an allowed value?
5. `email` uniqueness — checked last (DB lookup), only if format is valid.

Return the **first** validation error encountered; do not accumulate multiple errors.

### PUT /agents/:id (update)

All fields are optional. Only supplied fields are validated and updated.

1. Agent with `id` must exist — return 404 if not.
2. If `email` is supplied — validate format; then check uniqueness excluding the current agent's own email.
3. If `status` is supplied — validate it is an allowed value.
4. If `name` or `specialty` are supplied — validate non-empty after trim.

### GET /agents/:id

No body validation. Return 404 if no agent with that `id` exists.

### GET /agents

No validation. Always returns 200 with an array (empty if no agents exist).

---

## Email Format Rule

Accepted pattern: one or more non-whitespace characters, `@`, one or more non-whitespace characters, `.`, one or more non-whitespace characters.

Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

Examples:
- `atlas@agentclinic.dev` — valid
- `atlas` — invalid
- `atlas@` — invalid
- `@agentclinic.dev` — invalid

---

## Allowed Status Values

```
active
inactive
in-therapy
```

Any other value, including casing variants (e.g. `Active`, `ACTIVE`), is rejected.

---

## Error Response Shape

All validation errors return JSON with a single `error` key:

```json
{ "error": "<message>" }
```

No stack traces or internal details are included in error responses.
