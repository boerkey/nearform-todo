import { describe, it, expect } from 'vitest';
import { updateCompletion } from '../../src/services/todo-service.js';

describe('updateCompletion validation', () => {
  it('rejects missing completed flag', async () => {
    await expect(updateCompletion('550e8400-e29b-41d4-a716-446655440000', {})).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
    });
  });

  it('rejects non-boolean completed', async () => {
    await expect(
      updateCompletion('550e8400-e29b-41d4-a716-446655440000', { completed: 'yes' } as never),
    ).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
    });
  });
});
