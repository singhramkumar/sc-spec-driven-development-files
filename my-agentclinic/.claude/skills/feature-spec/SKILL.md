---
name: feature-spec
description: Finds the next unstarted phase in specs/roadmap.md for the AgentClinic project, asks clarifying questions about scope and requirements, and writes a spec directory (requirements.md, plan.md, validation.md) under specs/phase-N/. Trigger when the user says "next phase", "create spec", "feature spec", "spec the next phase", or invokes /feature-spec. Does NOT implement any code.
---

# Feature Spec

Reads `specs/roadmap.md`, identifies the next unimplemented phase, interviews the user, and writes a complete spec. **Stops before implementation — no source code is written.**

---

## Workflow

### 1. Identify the next phase

Read `specs/roadmap.md` to list all phases in order (Phase 1, Phase 2, … Phase N).

For each phase, check **both** signals:

| Signal | How to check |
|---|---|
| Spec directory exists | `specs/phase-N/requirements.md` present? |
| Code is implemented | Relevant `src/<module>/` directory present? |

A phase is **done** if either its spec dir exists OR its source module exists in `src/`.

Phase → expected `src/` module mapping for this project:

| Phase | Module |
|---|---|
| Phase 1: Agent Dashboard API | `src/agents/` |
| Phase 2: Agent Dashboard UI + Ailment Management | `src/ailments/` |
| Phase 3: Therapy Catalog | `src/therapies/` |
| Phase 4: Appointment Booking | `src/appointments/` (or similar) |
| Phase 5: Staff Dashboard | `src/staff/` (or similar) |

The **next phase** is the first one where neither signal is true. State which phase that is and confirm with yourself (do not ask the user to confirm the phase — they can redirect if wrong).

### 2. Create the git branch

```bash
git checkout -b phase-N-<kebab-phase-name>
```

Example: `git checkout -b phase-4-appointment-booking`

### 3. Read guidance files

Read these before interviewing:
- `specs/mission.md`
- `specs/tech-stack.md`

### 4. Interview the user — BEFORE writing any files

Use `AskUserQuestion` with **3 questions in a single call**:

| Header | Question |
|---|---|
| **Scope** | What does this phase include and exclude? What entities, fields, or pages are in play? |
| **Decisions** | Key choices — data model shape, UI pattern (modal vs page), validation rules, API surface |
| **Context** | Any constraints, open questions, or things that should influence how the spec reads? |

**Do not write any files until all 3 questions are answered.**

### 5. Write the spec directory

Create `specs/phase-N/` containing exactly three files.

#### `requirements.md`

```markdown
# Requirements — Phase N: <Phase Name>

## Stakeholder Requirements
(Table mapping Mary/Susan/Steve to what they need from this phase)

## Functional Requirements
(ID | Requirement table, FR-N.1 onwards)

## Data Model
(Fields table for each new entity)

## Non-Functional Requirements
(ID | Category | Requirement)

## Acceptance Criteria
(Checklist — each item is a testable condition)
```

#### `plan.md`

```markdown
# Phase N: <Phase Name> — Feature Spec & Implementation Plan

## Goal
(One paragraph)

## Data Model
(Field tables)

## REST Endpoints
(Method | Path | Description | Success status table)
(Request/response JSON examples for each write endpoint)

## Architecture
(File tree for the new src/<module>/ directory)
(Short note on filtering/validation strategy)

## Implementation Steps
(Numbered list — order: types → repository → service → router → seed/migration → frontend → index.ts wiring)

## Out of Scope (Phase N)
(Bullet list of what is explicitly deferred)
```

#### `validation.md`

```markdown
# Validation Rules — Phase N: <Phase Name>

## Field Validation
(Table: Field | Rule | Error Message | HTTP Status)

## Validation Behaviour by Endpoint
(Section per endpoint with ordered validation steps)

## Error Response Shape
{ "error": "<message>" }
```

---

## Stack constraints for this project

- **Backend**: Node.js, TypeScript (strict mode), Express.js, SQLite via `better-sqlite3`
- **Frontend**: HTML5, CSS3 (mobile-first), vanilla JavaScript
- **Architecture**: types → repository interface + SQLite impl → service → Express router (same layering as `src/agents/`, `src/ailments/`, `src/therapies/`)
- **No new npm dependencies** without user approval
- **Responsive design**: mobile (320px+), tablet (768px+), desktop (1024px+)
- **Filtering**: done in the service layer (in-memory) for small catalogs; SQL WHERE for large ones

---

## STOP HERE

After writing the three spec files, **stop**. Do not create any TypeScript files, do not touch `src/`, do not run builds. Summarise what was written and what the next step (implementation) would be.
