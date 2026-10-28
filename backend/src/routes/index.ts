import { Router, Request, Response } from 'express';
import { healthRoutes } from './health.routes.js';
import { authRoutes } from './auth.routes.js';
import { requireAuth } from '../middleware/authenticate.js';
import { requireOrganizationMembership, requirePlatformAdministrator } from '../middleware/authorize.js';
import { ApiResponse } from '../utils/api-response.js';

const apiV1Router = Router();

// Mount public health and readiness routes under /api/v1
apiV1Router.use('/', healthRoutes);

// Mount authentication foundation routes under /api/v1/auth
apiV1Router.use('/auth', authRoutes);

/**
 * Organization Boundary Verification Route.
 * Verifies that the authenticated actor holds active membership in the target organization.
 */
apiV1Router.get(
  '/organizations/:orgId/verify-access',
  requireAuth,
  requireOrganizationMembership('orgId'),
  (req: Request, res: Response) => {
    ApiResponse.success(res, {
      message: 'Access granted: Verified organizational boundary clearance.',
      organizationId: req.params.orgId,
      userId: req.user!.id,
    });
  }
);

/**
 * Platform Governance Verification Route.
 * Verifies that the authenticated actor holds platform superuser clearance.
 */
apiV1Router.get(
  '/admin/verify-platform-access',
  requireAuth,
  requirePlatformAdministrator(),
  (req: Request, res: Response) => {
    ApiResponse.success(res, {
      message: 'Access granted: Platform administrator authorization confirmed.',
      userId: req.user!.id,
    });
  }
);

export { apiV1Router };
