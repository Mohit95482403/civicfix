import { Router, Request, Response } from 'express';
import { env, isSupabaseConfigured } from '../config/env.js';
import { getDefaultSupabaseClient } from '../config/supabase.js';
import { ApiResponse } from '../utils/api-response.js';

const router = Router();

/**
 * GET /api/health
 * Lightweight liveness probe to verify HTTP process responsiveness.
 */
router.get('/health', (_req: Request, res: Response) => {
  return ApiResponse.success(res, {
    service: 'civicfix-api',
    status: 'healthy',
    environment: env.NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/health/ready
 * Readiness probe to verify downstream database connectivity and service readiness.
 */
router.get('/health/ready', async (_req: Request, res: Response) => {
  const supabaseReady = isSupabaseConfigured();

  if (!supabaseReady) {
    return ApiResponse.success(res, {
      service: 'civicfix-api',
      status: 'degraded',
      database: {
        status: 'not_configured',
        message: 'SUPABASE_URL and SUPABASE_ANON_KEY are not configured.',
      },
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const supabase = getDefaultSupabaseClient();
    // Test lightweight connectivity
    const { error } = await supabase.from('organizations').select('id').limit(1);

    if (error) {
      return ApiResponse.error(
        res,
        'DATABASE_UNAVAILABLE',
        'Database connection probe failed.',
        503,
        { details: error.message }
      );
    }

    return ApiResponse.success(res, {
      service: 'civicfix-api',
      status: 'ready',
      database: {
        status: 'connected',
      },
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return ApiResponse.error(
      res,
      'SERVICE_UNAVAILABLE',
      'Readiness probe failed unexpectedly.',
      503,
      { error: err instanceof Error ? err.message : String(err) }
    );
  }
});

export const healthRoutes = router;
