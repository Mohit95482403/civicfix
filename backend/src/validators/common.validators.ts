import { z } from 'zod';

/**
 * Validates a route parameter containing a standard UUID v4.
 */
export function uuidParamSchema(paramName = 'id') {
  return z.object({
    [paramName]: z.string().uuid({
      message: `Invalid identifier format. Route parameter '${paramName}' must be a valid UUID.`,
    }),
  });
}

/**
 * Standard query parameters for paginated endpoints.
 */
export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .refine((val) => Number.isInteger(val) && val >= 1, {
      message: 'Page must be an integer greater than or equal to 1.',
    }),
  limit: z
    .string()
    .optional()
    .default('20')
    .transform((val) => parseInt(val, 10))
    .refine((val) => Number.isInteger(val) && val >= 1 && val <= 100, {
      message: 'Limit must be an integer between 1 and 100.',
    }),
  sortBy: z.string().optional().default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
