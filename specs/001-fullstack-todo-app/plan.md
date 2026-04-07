# Implementation Plan: Full-Stack Todo Application

**Branch**: `001-fullstack-todo-app` | **Date**: 2026-04-07 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-fullstack-todo-app/spec.md`

## Summary

Deliver a browser UI and HTTP API that support creating, listing, toggling completion, and deleting
todos, with titles validated (required, max 255 characters), errors surfaced clearly, an explicit
empty state, and persistence in PostgreSQL. Automated tests cover validation and domain rules
(unit), API plus database (integration), and primary flows through the UI (E2E). No authentication,
no advanced styling, no real-time sync.

## Technical Context

**Language/Version**: Node.js 20 LTS, TypeScript 5.x  
**Primary Dependencies**: Backend — Fastify, Prisma, Zod (or equivalent request validation); Frontend — React 19, Vite; E2E — Playwright  
**Storage**: PostgreSQL 16+ (via Docker for local dev; Prisma schema + migrations)  
**Testing**: Vitest (unit + integration with supertest / Fastify inject); Playwright (E2E against dev servers)  
**Target Platform**: macOS/Linux dev; backend Node server; modern evergreen browsers for the client  
**Project Type**: Web application (separate `backend/` and `frontend/` packages, npm workspaces at repo root)  
**Performance Goals**: Sub-second list/create/update/delete on local demo data; no formal SLA  
**Constraints**: HTTP JSON API only; CORS enabled for dev frontend origin; single shared todo list (no auth)  
**Scale/Scope**: Single-tenant demo; dozens of todos; one concurrent user assumed for conflict behavior (last-write-wins)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Per `.specify/memory/constitution.md` (Todo Constitution):

- [x] **Spec-driven**: Feature has `spec.md` and this plan under `specs/001-fullstack-todo-app/`; workflow order respected (spec → plan → tasks before implementation).
- [x] **Scope**: `spec.md` defines a single coherent scope; this plan matches it (auth, styling, realtime explicitly out of scope).
- [x] **Traceability**: Requirements map to design artifacts here and to forthcoming `tasks.md` with file paths (backend routes, Prisma model, React components, test suites).
- [x] **Testing**: FR-011–FR-013 reflected below (Vitest unit, integration with DB, Playwright E2E).
- [x] **Simplicity**: Two packages (backend + frontend), one DB, REST-shaped JSON API; no microservices. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/001-fullstack-todo-app/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md             # Phase 2 (/speckit.tasks) — not created by this command
```

### Source Code (repository root)

```text
package.json                 # npm workspaces: "backend", "frontend", "e2e"
backend/
├── package.json
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.ts               # Fastify app + plugins (CORS, error handler)
│   ├── routes/
│   │   └── todos.ts         # REST handlers
│   ├── services/
│   │   └── todo-service.ts  # validation + persistence
│   └── lib/
│       └── errors.ts        # structured API errors
└── tests/
    ├── unit/
    └── integration/

frontend/
├── package.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── components/
    │   ├── TodoList.tsx
    │   ├── TodoItem.tsx
    │   └── EmptyState.tsx
    └── api/
        └── client.ts        # fetch wrapper + error mapping

e2e/
├── playwright.config.ts
└── tests/
    └── todo.spec.ts
```

**Structure Decision**: Monorepo with **npm workspaces** (`backend`, `frontend`) and a top-level **`e2e/`** Playwright project so the browser tests run against both dev servers without coupling E2E code into `frontend/src`. Prisma and SQL live only under `backend/`.

## Complexity Tracking

> No constitution violations requiring justification. Simplicity principle satisfied with a single API process, one database, and a thin SPA client.
