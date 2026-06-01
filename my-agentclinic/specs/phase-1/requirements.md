# Requirements — Phase 1: Agent Dashboard

---

## Stakeholder Requirements

| Stakeholder | Role        | Relevant Requirements (Phase 1)                              |
|-------------|-------------|--------------------------------------------------------------|
| Mary        | Engineering | Reliable site; TypeScript stack; agent dashboard             |
| Susan       | Product     | Agents can be created, viewed, and updated                   |
| Steve       | Marketing   | (No Phase 1 UI — deferred to later phases)                   |

---

## Functional Requirements

| ID      | Requirement                                                                         |
|---------|-------------------------------------------------------------------------------------|
| FR-1.1  | The system shall allow listing all registered agents                                |
| FR-1.2  | The system shall allow creating a new agent with name, email, specialty, and status |
| FR-1.3  | The system shall allow viewing an agent's full profile by ID                        |
| FR-1.4  | The system shall allow updating an agent's information by ID                        |
| FR-1.5  | Each agent shall have a unique ID (UUID) and a unique email address                 |
| FR-1.6  | Agent status shall be one of: `active`, `inactive`, `in-therapy`                   |

---

## Non-Functional Requirements

| ID    | Category        | Requirement                                                                          |
|-------|-----------------|--------------------------------------------------------------------------------------|
| NFR-1 | Language        | All server-side code shall be written in TypeScript with strict mode enabled         |
| NFR-2 | Runtime         | The application shall run on Node.js                                                 |
| NFR-3 | Framework       | The server shall use Express.js                                                      |
| NFR-4 | Database        | The application shall use SQLite for persistence                                     |
| NFR-5 | Reliability     | All business logic shall be covered by unit tests                                    |
| NFR-6 | Testability     | Repositories shall be abstracted behind interfaces to enable mock injection in tests |
| NFR-7 | Responsive Design | When the web UI is implemented, it shall follow a mobile-first responsive design approach |
| NFR-8 | Responsive Design | The web UI shall display correctly on mobile (320px+), tablet (768px+), and desktop (1024px+) devices |
| NFR-9 | Accessibility    | The web UI shall support keyboard navigation and touch-friendly interaction |

---

## Acceptance Criteria

Phase 1 is complete when all of the following pass:

- [ ] `GET /agents` returns 200 with an array (empty array when no agents exist)
- [ ] `POST /agents` returns 201 with the created agent resource
- [ ] `POST /agents` returns 400 for missing required fields or invalid email/status
- [ ] `POST /agents` returns 409 when the email is already in use
- [ ] `GET /agents/:id` returns 200 with the agent, or 404 if not found
- [ ] `PUT /agents/:id` returns 200 with the updated agent resource
- [ ] `PUT /agents/:id` returns 404 if the agent does not exist
- [ ] All validation logic has unit test coverage
- [ ] All four endpoints have unit tests for happy paths and error cases
