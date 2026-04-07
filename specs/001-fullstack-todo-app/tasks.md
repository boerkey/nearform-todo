# Tasks: Full-Stack Todo Application

**Input**: Design documents from `/specs/001-fullstack-todo-app/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/openapi.yaml`, `quickstart.md`

**Tests**: Included — spec requires unit (FR-011), integration (FR-012), and E2E (FR-013).

**Organization**: Phases follow user stories P1 → P2 → P3 after shared setup and foundation.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies).
- **[Story]**: `[US1]` / `[US2]` / `[US3]` for user-story phases only.

---

## Phase 1: Setup (shared infrastructure)

**Purpose**: Monorepo layout, tooling, and local database container per `plan.md`.

- [x] T001 Create root `package.json` with npm `workspaces`: `backend`, `frontend`, `e2e`
- [x] T002 Initialize `backend/package.json` with Fastify, Prisma, Zod, Vitest, TypeScript, `tsx`, `@types/node`, `supertest` (or Fastify inject helpers), and npm scripts placeholders
- [x] T003 Initialize `frontend/package.json` with Vite, React 19, TypeScript, Vitest, `@testing-library/react` (optional for component tests), and npm scripts placeholders
- [x] T004 [P] Add `backend/tsconfig.json` and `frontend/tsconfig.json` (plus `frontend/tsconfig.node.json` for Vite) aligned with Node 20 / bundler expectations
- [x] T005 [P] Add `e2e/package.json` with `@playwright/test` and scaffold `e2e/playwright.config.ts`
- [x] T006 [P] Add `docker-compose.yml` at repository root for PostgreSQL 16 (port 5432, db/user/password) matching `specs/001-fullstack-todo-app/quickstart.md`
- [x] T007 [P] Add repository root `.gitignore` for `node_modules/`, `dist/`, `.env`, Prisma artifacts, Playwright output, and OS junk

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: Database schema, server shell, and shared libraries — **no user story work before this completes**.

**⚠️ CRITICAL**: User stories start only after this phase.

- [x] T008 Define Prisma `Todo` model and datasource in `backend/prisma/schema.prisma`; create initial migration under `backend/prisma/migrations/`
- [x] T009 Implement structured API errors in `backend/src/lib/errors.ts` (`{ error: { code, message } }`, HTTP status mapping) per `contracts/openapi.yaml`
- [x] T010 Build Fastify app in `backend/src/app.ts`: plugins (CORS for dev frontend origin), JSON parser, global error handler, route prefix `/todos` registration point
- [x] T011 Add Prisma client helper `backend/src/lib/prisma.ts` with disconnect on shutdown; add entry `backend/src/server.ts` that loads `DATABASE_URL` and listens on configurable port (e.g. 3001)
- [x] T012 Finalize `backend/package.json` scripts: `dev`, `build`, `start`, `test`, `prisma:migrate`, `prisma:generate`; add `backend/.env.example` with `DATABASE_URL`

**Checkpoint**: Backend boots, connects to Postgres via Docker, returns 404 or health for mounted routes.

---

## Phase 3: User Story 1 — Create todos and see them listed (Priority: P1) 🎯 MVP

**Goal**: `GET/POST /todos`, list newest-first, browser UI with empty state and create form; persistence verified.

**Independent Test**: Empty DB → UI shows empty state → create valid todo(s) → appears in list → survives backend restart + page reload.

### Tests (write first; red before green)

- [x] T013 [P] [US1] Add unit tests for title rules (trim, empty/whitespace reject, max 255) in `backend/tests/unit/title-validation.test.ts`
- [x] T014 [US1] Add integration tests for `GET /todos` and `POST /todos` (happy path + validation errors) in `backend/tests/integration/todos.test.ts` against real Postgres (test `DATABASE_URL`)

### Implementation

- [x] T015 [US1] Implement list + create + validation in `backend/src/services/todo-service.ts` (order by `createdAt` descending)
- [x] T016 [US1] Implement `GET /todos` and `POST /todos` in `backend/src/routes/todos.ts` and register routes in `backend/src/app.ts`
- [x] T017 [P] [US1] Implement `frontend/src/api/client.ts` (base URL from `import.meta.env.VITE_API_URL`, map error JSON to user-visible messages)
- [x] T018 [P] [US1] Implement `frontend/src/components/EmptyState.tsx` for zero todos
- [x] T019 [US1] Implement `frontend/src/components/TodoList.tsx` to render todos from props
- [x] T020 [US1] Wire `frontend/src/App.tsx` and `frontend/src/main.tsx`: load todos on mount, submit new todo, show `EmptyState` when length 0, display validation errors from API
- [x] T021 [P] [US1] Add `frontend/.env.example` with `VITE_API_URL=http://localhost:3001` and ensure `frontend/vite.config.ts` is valid for dev

**Checkpoint**: MVP — create + list + empty state + errors for bad title; integration tests pass.

---

## Phase 4: User Story 2 — Mark a todo as completed (Priority: P2)

**Goal**: `PATCH /todos/:id` with `{ completed: boolean }`; UI shows and toggles completion; persists across reload.

**Independent Test**: Seed or create a todo → toggle complete/incomplete → reload → state matches.

### Tests

- [x] T022 [P] [US2] Add unit tests for completion updates (invalid id handling delegated to service) in `backend/tests/unit/todo-completion.test.ts`
- [x] T023 [US2] Extend `backend/tests/integration/todos.test.ts` with `PATCH /todos/:id` (200, 400, 404)

### Implementation

- [x] T024 [US2] Add `updateCompletion` in `backend/src/services/todo-service.ts` and `PATCH /todos/:id` in `backend/src/routes/todos.ts`
- [x] T025 [P] [US2] Implement `frontend/src/components/TodoItem.tsx` (title, completed checkbox)
- [x] T026 [US2] Integrate `TodoItem` into `frontend/src/components/TodoList.tsx` and `frontend/src/App.tsx` with PATCH calls and optimistic or refresh strategy

**Checkpoint**: US1 + US2 both work; US2 independently verifiable via API tests alone.

---

## Phase 5: User Story 3 — Delete a todo (Priority: P3)

**Goal**: `DELETE /todos/:id`; UI removes item; last delete returns to empty state.

**Independent Test**: Multiple todos → delete one → others remain → delete last → empty state.

### Tests

- [x] T027 [P] [US3] Extend `backend/tests/integration/todos.test.ts` with `DELETE /todos/:id` (204/404)

### Implementation

- [x] T028 [US3] Add `deleteTodo` in `backend/src/services/todo-service.ts` and `DELETE /todos/:id` in `backend/src/routes/todos.ts`
- [x] T029 [US3] Add delete action to `frontend/src/components/TodoItem.tsx` and wire through `frontend/src/App.tsx` / `TodoList.tsx`; ensure empty state when count becomes 0

**Checkpoint**: Full CRUD + all backend integration tests green.

---

## Phase 6: Polish & cross-cutting

**Purpose**: E2E coverage, automation wiring, docs, contract alignment.

- [x] T030 [P] Implement E2E scenarios in `e2e/tests/todo.spec.ts`: empty state, create, validation errors, toggle complete, delete, empty after last delete
- [x] T031 Configure `e2e/playwright.config.ts` with `webServer` (or documented `globalSetup`) to start `backend` and `frontend` dev servers per `specs/001-fullstack-todo-app/quickstart.md`
- [x] T032 [P] Add repository root `README.md` with prerequisites, Docker up, migrate, dev commands, and pointer to `specs/001-fullstack-todo-app/quickstart.md`
- [x] T033 Reconcile `specs/001-fullstack-todo-app/contracts/openapi.yaml` with implemented routes, status codes, and response bodies; update YAML if anything drifted
- [x] T034 Walk through `specs/001-fullstack-todo-app/quickstart.md` end-to-end and fix any missing steps or ports

---

## Dependencies & execution order

### Phase dependencies

- **Phase 1** — no upstream dependencies.
- **Phase 2** — depends on Phase 1 (needs packages and tsconfig to run Prisma and server).
- **Phases 3–5** — depend on Phase 2; execute in priority order **US1 → US2 → US3** for the vertical slice (recommended).
- **Phase 6** — depends on Phases 3–5 (E2E needs full stack and behaviors).

### User story dependencies

- **US1**: Starts after Phase 2.
- **US2**: Starts after Phase 2; product UI builds on US1 components (sequential frontend work is expected).
- **US3**: Starts after Phase 2; same note — backend endpoints can be tested independently, UI layers on prior components.

### Parallel opportunities

- **Phase 1**: T004, T005, T006, T007 in parallel after T001–T003 skeletons exist (or pair T002/T003 then parallel rest).
- **Phase 3 tests**: T013 parallel with scaffolding only if file conflict avoided — prefer T013 then T014 serial for shared test harness setup.
- **Phase 3 UI**: T017 and T018 parallel once T016 lands.
- **Phase 6**: T030 and T032 parallel while T031 is configured.

---

## Parallel example: User Story 1 (after T016)

```bash
# After HTTP handlers exist, client + empty state can split:
# Task: frontend/src/api/client.ts
# Task: frontend/src/components/EmptyState.tsx
```

---

## Implementation strategy

### MVP first (US1 only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) — stop and demo: list, create, empty state, validation.
3. Run integration tests for US1 before moving on.

### Incremental delivery

1. Setup + Foundational → green migration + server boot.
2. US1 → MVP demo.
3. US2 → completion toggle.
4. US3 → delete + empty state regression.
5. Polish → E2E + README + OpenAPI sync.

### Task counts

| Scope | Tasks |
|-------|-------|
| Phase 1 Setup | 7 (T001–T007) |
| Phase 2 Foundational | 5 (T008–T012) |
| Phase 3 US1 | 9 (T013–T021) |
| Phase 4 US2 | 5 (T022–T026) |
| Phase 5 US3 | 3 (T027–T029) |
| Phase 6 Polish | 5 (T030–T034) |
| **Total** | **34** |

---

## Notes

- Integration tests must use a dedicated test database or schema; document in `backend/tests/integration/` README or `quickstart.md` if extra env vars are required.
- E2E port alignment: backend `3001`, frontend `5173` (adjust consistently in Playwright base URL and `VITE_API_URL`).
