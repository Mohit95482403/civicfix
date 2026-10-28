import { Request, Response } from 'express';
import { ApiResponse } from '../utils/api-response.js';

export function notFoundHandler(req: Request, res: Response): void {
  ApiResponse.error(
    res,
    'ROUTE_NOT_FOUND',
    `The requested endpoint ${req.method} ${req.originalUrl} was not found on this server.`,
    404
  );
}
