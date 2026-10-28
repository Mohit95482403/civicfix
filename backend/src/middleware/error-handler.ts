import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';
import { ApiResponse } from '../utils/api-response.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isProduction = env.NODE_ENV === 'production';
  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected internal error occurred.';
  let details: unknown = undefined;

  // 1. Handled AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.code;
    message = err.message;
    details = err.details;
  }
  // 2. Zod Request Validation Error
  else if (err instanceof ZodError) {
    statusCode = 422;
    errorCode = 'VALIDATION_ERROR';
    message = 'Request validation failed.';
    details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
      code: e.code,
    }));
  }
  // 3. Malformed JSON Body
  else if (err instanceof SyntaxError && 'status' in err && (err as { status?: number }).status === 400) {
    statusCode = 400;
    errorCode = 'MALFORMED_JSON';
    message = 'Request payload contains malformed JSON.';
  }
  // 4. Other Standard Errors
  else {
    statusCode = 500;
    errorCode = 'INTERNAL_SERVER_ERROR';
    message = isProduction ? 'An unexpected internal error occurred.' : err.message;
  }

  // Structured Log with redaction of secrets
  logger.error('API Error Response', {
    requestId: req.id || req.requestId,
    method: req.method,
    url: req.originalUrl,
    statusCode,
    errorCode,
    errorMessage: err.message,
    stack: isProduction && statusCode >= 500 ? undefined : err.stack,
  });

  ApiResponse.error(res, errorCode, message, statusCode, details);
}
