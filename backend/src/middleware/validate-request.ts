import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/app-error.js';

interface RequestValidationConfig {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Reusable middleware for validating incoming Express requests using Zod schemas.
 * Validates request body, query parameters, and route parameters prior to controller logic.
 * Coerces and sanitizes inputs where schemas declare transformations.
 */
export function validateRequest(schemas: RequestValidationConfig) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
          code: e.code,
        }));
        next(new ValidationError('Request validation failed.', issues));
      } else {
        next(err);
      }
    }
  };
}
