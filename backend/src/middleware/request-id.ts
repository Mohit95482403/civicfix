import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      id?: string;
    }
  }
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const existingId = req.headers['x-request-id'];
  const requestId =
    typeof existingId === 'string' && existingId.trim().length > 0
      ? existingId.trim()
      : crypto.randomUUID();

  req.requestId = requestId;
  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}
