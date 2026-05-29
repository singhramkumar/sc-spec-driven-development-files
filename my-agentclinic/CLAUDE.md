# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AgentClinic is a web application where AI agents can get relief from their humans. It is used as a learning project for spec-driven development with AI coding agents and as a demo at developer conference booths.

**Stakeholder requirements (from README.md):**
- Mary (Engineering): reliable site, TypeScript stack, dashboard for agents and staff
- Susan (Product): agents, ailments, therapies, appointment booking
- Steve (Marketing): attractive site, modern browser support

**Target audience:** course students learning spec-driven development, developers giving AI coding demos at conference booths.

## Commands

```bash
npm install       # install dependencies
npm run build     # compile TypeScript (src/ → dist/)
node dist/index.js  # run the compiled app
```

No test runner is configured yet.

## Architecture

This project is in early scaffold phase. The source lives entirely in [src/](src/) and compiles to `dist/` via `tsc`.

**TypeScript config** ([tsconfig.json](tsconfig.json)): target ES2016, CommonJS modules, strict mode, `esModuleInterop` enabled, output to `dist/`.

**Planned specs directory:** `specs/mission.md`, `specs/tech-stack.md`, `specs/roadmap.md` — these define the "constitution" for the project and should be created before implementing features.

**Planned tech stack:** server-side TypeScript with a chosen framework, SQLite for the database.

**[prompts.md](prompts.md)** contains the lesson prompts that drive feature development — consult it for the intended evolution of the project.