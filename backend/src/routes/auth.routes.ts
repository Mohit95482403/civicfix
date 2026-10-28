import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validate-request.js';
import { authRateLimiter } from '../middleware/rate-limit.js';
import { registerBodySchema, loginBodySchema } from '../validators/auth.validators.js';

const router = Router();

/**
 * POST /api/v1/auth/register
 * Public registration for citizens.
 */
router.post(
  '/register',
  authRateLimiter,
  validateRequest({ body: registerBodySchema }),
  AuthController.register
);

/**
 * POST /api/v1/auth/login
 * Public authentication for citizens, staff, and administrators.
 */
router.post(
  '/login',
  authRateLimiter,
  validateRequest({ body: loginBodySchema }),
  AuthController.login
);

/**
 * POST /api/v1/auth/logout
 * Terminates authenticated session.
 */
router.post('/logout', requireAuth, AuthController.logout);

/**
 * GET /api/v1/auth/me
 * Retrieves current authenticated user profile, staff memberships, and permissions.
 */
router.get('/me', requireAuth, AuthController.getMe);

export const authRoutes = router;
