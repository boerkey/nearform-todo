import { describe, it, expect } from 'vitest';
import { parseTitle } from '../../src/lib/validation.js';
import { AppError } from '../../src/lib/errors.js';

describe('parseTitle', () => {
  it('accepts valid trimmed title', () => {
    expect(parseTitle('  Buy milk  ')).toBe('Buy milk');
  });

  it('rejects empty string', () => {
    expect(() => parseTitle('')).toThrow(AppError);
    expect(() => parseTitle('')).toThrow(/empty|required/i);
  });

  it('rejects whitespace-only', () => {
    expect(() => parseTitle('   \t  ')).toThrow(AppError);
  });

  it('rejects null/undefined', () => {
    expect(() => parseTitle(null)).toThrow(AppError);
    expect(() => parseTitle(undefined)).toThrow(AppError);
  });

  it('rejects over 255 characters', () => {
    const long = 'a'.repeat(256);
    expect(() => parseTitle(long)).toThrow(AppError);
  });

  it('accepts exactly 255 characters', () => {
    const s = 'a'.repeat(255);
    expect(parseTitle(s)).toBe(s);
  });
});
