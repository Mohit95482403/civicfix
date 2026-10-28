import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const isProduction = env.NODE_ENV === 'production';

  logger.error('Unhandled API Error', {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    statusCode,
    errorMessage: err.message,
    errorCode: err.code,
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || (statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST'),
      message: statusCode >= 500 && isProduction ? 'An unexpected internal error occurred.' : err.message,
      ...(err.details ? { details: err.details } : {}),
    },
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
  });
}
