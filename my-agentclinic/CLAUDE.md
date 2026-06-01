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

The backend source lives in [src/](src/) and compiles to `dist/` via `tsc`. Static frontend files (HTML, CSS, JS) are served from the [public/](public/) directory.

**TypeScript config** ([tsconfig.json](tsconfig.json)): target ES2016, CommonJS modules, strict mode, `esModuleInterop` enabled, output to `dist/`.

**Backend structure:**
- `src/agents/` - Agent domain (types, repository, service, router)
- `src/index.ts` - Express app initialization and static file serving

**Frontend structure:**
- `public/index.html` - Main HTML page with responsive, mobile-first design
- `public/styles.css` - Responsive CSS with CSS variables, media queries (mobile 320px+, tablet 768px+, desktop 1024px+)
- `public/script.js` - Client-side interactivity for agent dashboard

**Specs directory:** `specs/mission.md`, `specs/tech-stack.md`, `specs/roadmap.md` — these define the "constitution" for the project.

**Tech stack:** 
- Backend: Node.js, TypeScript, Express.js, SQLite
- Frontend: HTML5, CSS3 (responsive), vanilla JavaScript
- Design approach: Mobile-first responsive design with flexible layouts, CSS Grid/Flexbox, and media queries

**[prompts.md](prompts.md)** contains the lesson prompts that drive feature development — consult it for the intended evolution of the project.