# Todo (full-stack)

Monorepo: **backend** (Fastify + Prisma + PostgreSQL), **frontend** (Vite + React), **e2e** (Playwright).

## Prerequisites

- Node.js 20+
- Docker (recommended) or PostgreSQL 16+
- npm 10+

## Quick start

See **[specs/001-fullstack-todo-app/quickstart.md](specs/001-fullstack-todo-app/quickstart.md)** for full steps.

Short version:

```bash
# Start database
docker compose up -d

# Set connection string (matches docker-compose.yml)
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todo"

cd backend && npm install && npx prisma migrate deploy && npx prisma generate
npm run dev
```

In another terminal:

```bash
cd frontend && npm install && npm run dev
```

Open **http://localhost:5173** (Vite proxies `/todos` to the backend in dev).

## Tests

```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todo"
cd backend && npx prisma migrate deploy && npm test
```

End-to-end (requires DB + migrations; Playwright starts backend and frontend):

```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todo"
npm install
cd backend && npx prisma migrate deploy && npx prisma generate && cd ..
npx playwright install
npm run test:e2e
```

## Feature spec

Design and tasks live under `specs/001-fullstack-todo-app/`.
