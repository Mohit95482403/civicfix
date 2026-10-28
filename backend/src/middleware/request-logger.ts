import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

/**
 * Structured HTTP request logging middleware.
 * Records method, path, response code, and latency while redacting sensitive headers.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  // Avoid verbose request logging during unit/integration tests
  if (env.NODE_ENV === 'test') {
    return next();
  }

  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    logger.info('HTTP Request Handled', {
      requestId: req.id || req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: parseFloat(durationMs.toFixed(2)),
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });

  next();
}
