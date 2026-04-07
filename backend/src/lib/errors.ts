export type ErrorCode = 'VALIDATION_ERROR' | 'NOT_FOUND' | 'BAD_REQUEST';

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string, statusCode: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }

  toJSON(): { error: { code: string; message: string } } {
    return {
      error: {
        code: this.code,
        message: this.message,
      },
    };
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
