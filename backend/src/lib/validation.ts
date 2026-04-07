import { z } from 'zod';
import { AppError } from './errors.js';

const titleSchema = z
  .string({ required_error: 'Title is required' })
  .trim()
  .min(1, 'Title cannot be empty')
  .max(255, 'Title must be at most 255 characters');

/**
 * Validates and returns a trimmed title string, or throws AppError VALIDATION_ERROR.
 */
export function parseTitle(raw: unknown): string {
  if (raw === undefined || raw === null) {
    throw new AppError('VALIDATION_ERROR', 'Title is required', 400);
  }
  const result = titleSchema.safeParse(typeof raw === 'string' ? raw : String(raw));
  if (!result.success) {
    const msg = result.error.flatten().formErrors[0] ?? result.error.errors[0]?.message ?? 'Invalid title';
    throw new AppError('VALIDATION_ERROR', msg, 400);
  }
  return result.data;
}
