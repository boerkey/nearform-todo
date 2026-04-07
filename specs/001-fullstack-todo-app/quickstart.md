# Quickstart: Full-Stack Todo (development)

## Prerequisites

- Node.js 20+
- Docker (recommended) or a local PostgreSQL 16+ instance
- npm 10+ (or compatible)

## 1. Database

From the repository root, Docker Compose is provided:

```bash
docker compose up -d
```

Or run PostgreSQL directly:

```bash
docker run --name todo-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=todo -p 5432:5432 -d postgres:16-alpine
```

Set the backend connection string (example):

```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todo"
```

## 2. Backend

From repository root (after implementation exists):

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

Default API base URL for local dev: `http://localhost:3001` (adjust if your app uses another port — keep frontend API client in sync).

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`). Configure the API base URL to match the backend (Vite env, e.g. `VITE_API_URL`).

## 4. Tests

```bash
# Unit + integration (backend)
cd backend && npm test

# E2E — requires backend + frontend dev servers (or use Playwright webServer config)
cd .. && npx playwright test
```

## 5. CORS

Ensure the backend allows the frontend dev origin (e.g. `http://localhost:5173`) in development.
