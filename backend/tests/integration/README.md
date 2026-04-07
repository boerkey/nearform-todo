Integration tests require a running PostgreSQL instance and `DATABASE_URL`.

Apply migrations before the first run:

```bash
cd backend && npx prisma migrate deploy
```

Optional: use a dedicated database for tests:

```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todo_test"
createdb todo_test   # if using local Postgres CLI
npx prisma migrate deploy
npm test
```

The suite truncates todos via `deleteMany()` in `beforeEach`.
