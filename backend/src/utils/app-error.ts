/**
 * Base Application Error class for CivicFix REST API.
 * Ensures consistent HTTP status codes, error codes, and error tracking.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details?: unknown) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication is required.', details?: unknown) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action.', details?: unknown) {
    super(message, 403, 'FORBIDDEN', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'The requested resource was not found.', details?: unknown) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'A resource conflict occurred.', details?: unknown) {
    super(message, 409, 'CONFLICT', details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Request validation failed.', details?: unknown) {
    super(message, 422, 'VALIDATION_ERROR', details);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests. Please slow down and try again later.', details?: unknown) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'An unexpected server error occurred.', details?: unknown) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable.', details?: unknown) {
    super(message, 503, 'SERVICE_UNAVAILABLE', details);
  }
}
