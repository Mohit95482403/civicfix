import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import { requireAuth } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validate-request.js';
import { updateProfileBodySchema } from '../validators/profile.validators.js';

const router = Router();

/**
 * GET /
 * Retrieve current user's profile and organizational context.
 */
router.get('/', requireAuth, ProfileController.getProfile);

/**
 * PATCH /
 * Update permitted profile fields.
 */
router.patch(
  '/',
  validateRequest({ body: updateProfileBodySchema }),
  requireAuth,
  ProfileController.updateProfile
);

export const profileRoutes = router;
