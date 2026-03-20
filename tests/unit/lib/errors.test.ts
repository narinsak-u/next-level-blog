import { describe, it, expect } from 'vitest';
import {
  AppError,
  NotionAPIError,
  ValidationError,
  NotFoundError,
  AuthenticationError,
  handleError,
} from '@/lib/errors';

describe('AppError', () => {
  it('ER-001: has correct properties', () => {
    const error = new AppError('Test message', 'TEST_CODE', 500);
    expect(error.message).toBe('Test message');
    expect(error.code).toBe('TEST_CODE');
    expect(error.statusCode).toBe(500);
    expect(error.name).toBe('AppError');
  });

  it('ER-001: defaults to statusCode 500', () => {
    const error = new AppError('Test', 'CODE');
    expect(error.statusCode).toBe(500);
  });
});

describe('NotionAPIError', () => {
  it('ER-002: defaults to statusCode 500', () => {
    const error = new NotionAPIError('Notion failed');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('NOTION_API_ERROR');
    expect(error.name).toBe('NotionAPIError');
  });

  it('ER-002: accepts custom status code', () => {
    const error = new NotionAPIError('Rate limited', 429);
    expect(error.statusCode).toBe(429);
  });
});

describe('ValidationError', () => {
  it('ER-003: always has statusCode 400', () => {
    const error = new ValidationError('Invalid data');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.name).toBe('ValidationError');
  });
});

describe('NotFoundError', () => {
  it('ER-004: always has statusCode 404', () => {
    const error = new NotFoundError('Resource not found');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.name).toBe('NotFoundError');
  });
});

describe('AuthenticationError', () => {
  it('ER-005: always has statusCode 401', () => {
    const error = new AuthenticationError('Unauthorized');
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe('AUTHENTICATION_ERROR');
    expect(error.name).toBe('AuthenticationError');
  });
});

describe('handleError()', () => {
  it('ER-006: wraps unknown errors', () => {
    const error = handleError(new Error('Unknown error'));
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Unknown error');
    expect(error.code).toBe('UNKNOWN_ERROR');
    expect(error.statusCode).toBe(500);
  });

  it('ER-006: handles non-Error values', () => {
    const error = handleError('string error');
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('An unexpected error occurred');
  });

  it('ER-007: preserves AppError instances', () => {
    const original = new ValidationError('Validation failed');
    const result = handleError(original);
    expect(result).toBe(original);
    expect(result.code).toBe('VALIDATION_ERROR');
  });

  it('ER-007: preserves NotionAPIError instances', () => {
    const original = new NotionAPIError('API error', 503);
    const result = handleError(original);
    expect(result).toBe(original);
    expect(result.statusCode).toBe(503);
  });

  it('ER-006: handles null/undefined', () => {
    const error = handleError(null);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('An unexpected error occurred');
  });

  it('ER-006: accepts context parameter', () => {
    const error = handleError(new Error('Test'), 'TestContext');
    expect(error.code).toBe('UNKNOWN_ERROR');
  });
});
