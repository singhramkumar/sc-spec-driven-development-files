# Roadmap

High-level implementation order in minimal vertical slices. Each phase delivers a working feature end-to-end.

## Phase 1: Agent Dashboard (API)

**Goal**: REST API for agents to view and manage their profiles.

- List all agents (GET /agents)
- Create a new agent (POST /agents)
- View agent details (GET /agents/:id)
- Update agent information (PUT /agents/:id)
- API layer only; no HTML UI

## Phase 2: Agent Dashboard UI + Ailment Management

**Goal**: Build responsive web UI for Phase 1 API; agents can record and track their ailments.

**UI Features:**
- Responsive, mobile-first web interface
- Support mobile (320px+), tablet (768px+), and desktop (1024px+) devices
- Touch-friendly navigation and buttons
- Dynamic forms for creating and updating agents

**Ailment Management:**
- Add ailment to an agent
- View agent's ailments
- List all ailments in the system
- Delete/resolve ailments

## Phase 3: Therapy Catalog

**Goal**: Showcase available therapies that agents can book.

- List all therapies
- View therapy details (name, description, duration, therapist)
- Search/filter therapies

## Phase 4: Appointment Booking

**Goal**: Agents can reserve therapy appointments.

- View available time slots for a therapy
- Book an appointment
- View agent's upcoming appointments
- Cancel an appointment

## Phase 5: Staff Dashboard

**Goal**: Staff can manage the clinic operations.

- View all appointments
- See agent check-ins and status
- Manage therapist schedules
