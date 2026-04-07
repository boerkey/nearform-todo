# Research: Full-Stack Todo Application

## 1. Runtime and language

**Decision**: Node.js 20 LTS with TypeScript everywhere (backend and frontend).

**Rationale**: One toolchain, strong ecosystem for HTTP servers, Prisma, and test runners; aligns with common full-stack hiring/demo setups.

**Alternatives considered**: Python (FastAPI) + separate JS frontend — more context-switching; Go — faster but more boilerplate for CRUD + SPA in a small scope.

## 2. HTTP server framework

**Decision**: Fastify.

**Rationale**: Lightweight, built-in JSON schema validation hooks, good performance, straightforward plugin model for CORS and error handling.

**Alternatives considered**: Express — ubiquitous but more manual structure; Nest — heavier than needed for a CRUD API.

## 3. Persistence

**Decision**: PostgreSQL with Prisma ORM and SQL migrations.

**Rationale**: Spec requires a real database; Prisma gives typed queries, migrations, and straightforward integration tests against a real Postgres instance (Docker).

**Alternatives considered**: SQLite — simpler file-based dev but weaker parity with “real” Postgres deployment; raw SQL — more ceremony for this scope.

## 4. API shape

**Decision**: Resource-oriented JSON over HTTP: `GET/POST /todos`, `PATCH/DELETE /todos/:id`. Errors as JSON with stable `code` + human-readable `message` for client mapping.

**Rationale**: Matches spec FR-006/FR-010; easy to document in OpenAPI and to test with supertest/inject.

**Alternatives considered**: GraphQL — unnecessary for four operations; RPC-style POST actions — less conventional for CRUD.

## 5. Frontend

**Decision**: Vite + React + TypeScript.

**Rationale**: Fast dev server, minimal config, large ecosystem; “basic UI” is achievable with semantic HTML and minimal CSS.

**Alternatives considered**: Next.js — SSR not required and adds complexity; plain TS + DOM — more manual work without benefit for this spec.

## 6. Validation

**Decision**: Shared constraints: title required after trim, length 1–255; enforced on server (authoritative); client validates for immediate feedback. Use Zod (or equivalent) on the backend for request bodies.

**Rationale**: Meets FR-001, FR-009, FR-010; server remains source of truth.

## 7. Testing strategy

| Layer | Tool | Scope |
|-------|------|--------|
| Unit | Vitest | Title validation, todo state transitions, error mapping |
| Integration | Vitest + Fastify inject + Prisma + test DB | Full HTTP + DB for CRUD paths |
| E2E | Playwright | UI flows: empty state, add, complete, delete, error display |

**Rationale**: Matches FR-011–FR-013; Playwright is stable for cross-browser E2E against local dev URLs.

**Alternatives considered**: Cypress — viable; team default often Playwright for speed and multi-browser. Cypress vs Playwright is a wash for this scope — **Playwright** chosen as single E2E runner.

## 8. Local development database

**Decision**: PostgreSQL via Docker Compose (or single `docker run`) with connection string in `.env`; document in `quickstart.md`.

**Rationale**: Reproducible integration tests and matches production-like storage without installing Postgres globally.

## 9. Ordering of todos

**Decision**: List API returns todos ordered by `createdAt` descending (newest first).

**Rationale**: Matches spec assumption (“e.g., newest first”); stable and easy to explain in API docs.
