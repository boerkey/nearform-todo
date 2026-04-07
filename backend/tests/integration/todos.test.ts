import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { buildApp } from '../../src/app.js';
import { prisma } from '../../src/lib/prisma.js';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;

beforeAll(async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required for integration tests');
  }
  await prisma.$connect();
  app = await buildApp();
});

beforeEach(async () => {
  await prisma.todo.deleteMany();
});

afterAll(async () => {
  await app.close();
});

describe('GET /todos', () => {
  it('returns empty array', async () => {
    const res = await app.inject({ method: 'GET', url: '/todos' });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual([]);
  });
});

describe('POST /todos', () => {
  it('creates a todo', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/todos',
      payload: { title: 'First' },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body) as { title: string; completed: boolean };
    expect(body.title).toBe('First');
    expect(body.completed).toBe(false);
  });

  it('rejects empty title', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/todos',
      payload: { title: '   ' },
    });
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body) as { error: { code: string } };
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects missing title', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/todos',
      payload: {},
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('PATCH /todos/:id', () => {
  it('updates completion', async () => {
    const created = await prisma.todo.create({
      data: { title: 'Task' },
    });
    const res = await app.inject({
      method: 'PATCH',
      url: `/todos/${created.id}`,
      payload: { completed: true },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as { completed: boolean };
    expect(body.completed).toBe(true);
  });

  it('returns 404 for unknown id', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/todos/550e8400-e29b-41d4-a716-446655440099',
      payload: { completed: true },
    });
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /todos/:id', () => {
  it('deletes a todo', async () => {
    const created = await prisma.todo.create({
      data: { title: 'Remove me' },
    });
    const res = await app.inject({
      method: 'DELETE',
      url: `/todos/${created.id}`,
    });
    expect(res.statusCode).toBe(204);
    const count = await prisma.todo.count();
    expect(count).toBe(0);
  });

  it('returns 404 for unknown id', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: '/todos/550e8400-e29b-41d4-a716-446655440088',
    });
    expect(res.statusCode).toBe(404);
  });
});
