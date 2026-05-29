# Roadmap

AgentClinic development is organized into phases, each delivering a cohesive slice of user-facing value.

## Phase 1: Agent Dashboard — REST API Layer ✅ In Progress

**Goal:** Establish the API foundation for agent profile management.

- Agent CRUD endpoints (list, create, read, update)
- Input validation and error handling
- SQLite persistence
- Unit test coverage (service + router layers)
- No UI yet — API only

**Stakeholders:** Mary (reliable foundation), Susan (agent data model)

---

## Phase 2: Web UI — Dashboard & Navigation

**Goal:** Build the responsive web interface with dashboard layout, navigation, and basic styling.

- Server-side HTML rendering (Hono JSX)
- Mobile-first responsive CSS (mobile, tablet, desktop breakpoints)
- Navigation bar and layout components
- Dashboard page showing agent list
- Form components for agent creation/editing
- Semantic HTML and WCAG AA accessibility
- Browser compatibility (modern browsers)

**Deliverables:** Agents list page, agent detail page, create/edit forms — all responsive

**Stakeholders:** Steve (attractive, modern design), Mary (reliable, accessible UI)

---

## Phase 3: Ailments & Therapies

**Goal:** Extend the domain model to ailments and available therapies.

- Ailment CRUD endpoints
- Therapy CRUD endpoints
- Agent-to-ailment association
- Dashboard pages for ailments and therapies
- Responsive UI updates

**Stakeholders:** Susan (core product features)

---

## Phase 4: Appointment Booking

**Goal:** Enable therapists and agents to schedule appointments.

- Appointment CRUD endpoints
- Availability management
- Booking UI with calendar widget
- Confirmation/notification system

**Stakeholders:** Susan (booking workflow), Mary (reliability)

---

## Phase 5 & Beyond

- Staff authentication and authorization
- Email notifications
- Advanced filtering and search
- Reporting and analytics
