import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';
import { parseTitle } from '../lib/validation.js';

const zodPatch = z.object({
  completed: z.boolean(),
});

export type TodoDto = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

type TodoRow = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function toDto(row: TodoRow): TodoDto {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listTodos(): Promise<TodoDto[]> {
  const rows = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(toDto);
}

export async function createTodo(body: unknown): Promise<TodoDto> {
  let title: string;
  if (body !== null && typeof body === 'object' && 'title' in body) {
    title = parseTitle((body as { title: unknown }).title);
  } else {
    throw new AppError('VALIDATION_ERROR', 'Request body must include a title', 400);
  }
  const row = await prisma.todo.create({
    data: { title },
  });
  return toDto(row);
}

export async function updateCompletion(id: string, body: unknown): Promise<TodoDto> {
  const parsed = zodPatch.safeParse(body);
  if (!parsed.success) {
    throw new AppError('VALIDATION_ERROR', 'Request body must include completed (boolean)', 400);
  }
  try {
    const row = await prisma.todo.update({
      where: { id },
      data: { completed: parsed.data.completed },
    });
    return toDto(row);
  } catch (e: unknown) {
    if (isPrismaNotFound(e)) {
      throw new AppError('NOT_FOUND', 'Todo not found', 404);
    }
    throw e;
  }
}

export async function deleteTodo(id: string): Promise<void> {
  try {
    await prisma.todo.delete({ where: { id } });
  } catch (e: unknown) {
    if (isPrismaNotFound(e)) {
      throw new AppError('NOT_FOUND', 'Todo not found', 404);
    }
    throw e;
  }
}

function isPrismaNotFound(e: unknown): boolean {
  return (
    typeof e === 'object' &&
    e !== null &&
    'code' in e &&
    (e as { code: string }).code === 'P2025'
  );
}
