import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env.js';
import { ApiResponse } from '../utils/api-response.js';
import type { Request, Response } from 'express';

/**
 * Standard API rate limiter.
 * In production, protects against DoS and abusive scraping.
 */
export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
  handler: (req: Request, res: Response) => {
    ApiResponse.error(
      res,
      'RATE_LIMIT_EXCEEDED',
      'Too many requests from this IP address. Please slow down and try again shortly.',
      429
    );
  },
});

/**
 * Stricter rate limiter for authentication endpoints (login, register).
 * Throttles brute-force credential stuffing and registration flooding.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
  handler: (req: Request, res: Response) => {
    ApiResponse.error(
      res,
      'AUTH_RATE_LIMIT_EXCEEDED',
      'Too many authentication attempts. Please wait 15 minutes before retrying.',
      429
    );
  },
});
