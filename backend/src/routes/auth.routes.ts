import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validate-request.js';
import { authRateLimiter } from '../middleware/rate-limit.js';
import {
  registerBodySchema,
  loginBodySchema,
  forgotPasswordBodySchema,
  resetPasswordBodySchema,
  refreshTokenBodySchema,
} from '../validators/auth.validators.js';

const router = Router();

/**
 * POST /register
 * Public citizen registration.
 */
router.post(
  '/register',
  authRateLimiter,
  validateRequest({ body: registerBodySchema }),
  AuthController.register
);

/**
 * POST /login
 * Public authentication for citizens and municipal staff.
 */
router.post(
  '/login',
  authRateLimiter,
  validateRequest({ body: loginBodySchema }),
  AuthController.login
);

/**
 * GET /me
 * Authenticated user profile and membership retrieval.
 */
router.get('/me', requireAuth, AuthController.getMe);

/**
 * POST /logout
 * Session logout endpoint.
 */
router.post('/logout', requireAuth, AuthController.logout);

/**
 * POST /forgot-password
 * Password recovery request.
 */
router.post(
  '/forgot-password',
  authRateLimiter,
  validateRequest({ body: forgotPasswordBodySchema }),
  AuthController.forgotPassword
);

/**
 * POST /reset-password
 * Password reset execution via recovery token.
 */
router.post(
  '/reset-password',
  requireAuth,
  validateRequest({ body: resetPasswordBodySchema }),
  AuthController.resetPassword
);

/**
 * POST /refresh
 * Token refresh endpoint.
 */
router.post(
  '/refresh',
  authRateLimiter,
  validateRequest({ body: refreshTokenBodySchema }),
  AuthController.refreshSession
);

export const authRoutes = router;
