# Architecture Document

This document describes **system architecture**, **technical design**, and **architectural decisions** for the Todo application. It complements the [PRD](PRD.md) (what/why) and the [implementation plan](specs/001-fullstack-todo-app/plan.md) (delivery context).

---

## 1. System context

```text
┌─────────────┐     HTTP (JSON)      ┌─────────────┐     SQL        ┌──────────────┐
│   Browser   │ ◄──────────────────► │   Backend   │ ◄────────────► │  PostgreSQL  │
│ (React SPA) │   /todos REST API    │  (Fastify)  │    Prisma      │   (persist)  │
└─────────────┘                      └─────────────┘                └──────────────┘
```

- **Client**: Single-page app (`frontend/`) — loads todos, sends mutations, renders empty/loading/error states.
- **Server**: Stateless HTTP API (`backend/`) — validation, business rules, persistence.
- **Data store**: PostgreSQL — durable storage across sessions and deploys.

---

## 2. Repository layout (monorepo)

| Workspace | Role |
|-----------|------|
| `backend/` | API server, Prisma schema & migrations, Vitest unit + integration tests |
| `frontend/` | Vite + React UI |
| `e2e/` | Playwright browser tests against running dev servers |

**Decision:** npm workspaces keep one lockfile and a single clone for reviewers and CI.

---

## 3. Backend architecture

### Layers

1. **HTTP / routing** — `backend/src/routes/todos.ts` — maps URLs to handlers (`GET/POST /`, `PATCH/DELETE /:id` under prefix `/todos`).
2. **Application services** — `backend/src/services/todo-service.ts` — create/list/update/delete, validation hooks, Prisma calls.
3. **Cross-cutting** — `backend/src/app.ts` — Fastify instance, CORS, global error handler; `backend/src/lib/errors.ts`, `backend/src/lib/validation.ts`.

### Error model

Structured JSON errors `{ "error": { "code", "message" } }` for predictable client mapping (see OpenAPI).

### Persistence

- **ORM:** Prisma (`backend/prisma/schema.prisma`).
- **Migrations:** SQL under `backend/prisma/migrations/`.
- **Connection:** `DATABASE_URL` (see `backend/.env.example`).

---

## 4. Frontend architecture

- **State & orchestration:** `frontend/src/App.tsx` — loads list on mount, handles create/toggle/delete, surfaces errors and empty state.
- **Presentation:** `TodoList`, `TodoItem`, `EmptyState` — thin components driven by props.
- **API access:** `frontend/src/api/client.ts` — `fetch` to `/todos` (Vite dev proxy to backend) or `VITE_API_URL` when set.

**Decision:** No global client state library for MVP; React `useState` + callbacks are sufficient.

---

## 5. API surface

Authoritative contract: [`specs/001-fullstack-todo-app/contracts/openapi.yaml`](specs/001-fullstack-todo-app/contracts/openapi.yaml).

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/todos` | List todos (newest first) |
| POST | `/todos` | Create todo |
| PATCH | `/todos/:id` | Update `completed` |
| DELETE | `/todos/:id` | Delete todo |

---

## 6. Data model

| Field | Purpose |
|-------|---------|
| `id` | Stable identifier (UUID) |
| `title` | Required text (trimmed, 1–255 chars) |
| `completed` | Boolean |
| `createdAt` / `updatedAt` | Metadata & ordering |

See [`specs/001-fullstack-todo-app/data-model.md`](specs/001-fullstack-todo-app/data-model.md).

---

## 7. Extensibility (future-friendly)

The instructions asked for an architecture that **does not block** auth or multi-user features later:

- **Today:** Single shared todo list, no auth (matches MVP scope).
- **Later:** Introduce `User` (or tenant) table, foreign key from `Todo`, JWT/session middleware on Fastify, and row-level filters in `todo-service` — without changing the REST shape drastically.

---

## 8. Testing architecture

| Layer | Tooling | Location |
|-------|---------|----------|
| Unit | Vitest | `backend/tests/unit/` |
| Integration | Vitest + Fastify inject + Postgres | `backend/tests/integration/` |
| E2E | Playwright | `e2e/tests/` |

---

## 9. Operations (local)

- **Database:** `docker-compose.yml` (Postgres 16).
- **Ports:** backend `3001`, frontend `5173` (see [quickstart](specs/001-fullstack-todo-app/quickstart.md)).

---

## 10. Related documents

- [PRD.md](PRD.md) — product requirements  
- [specs/001-fullstack-todo-app/plan.md](specs/001-fullstack-todo-app/plan.md) — technical context from planning  
- [specs/001-fullstack-todo-app/contracts/openapi.yaml](specs/001-fullstack-todo-app/contracts/openapi.yaml) — API contract  
