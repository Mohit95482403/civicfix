import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { healthRoutes } from './health.routes.js';
import { authRoutes } from './auth.routes.js';
import { profileRoutes } from './profile.routes.js';
import { complaintRoutes } from './complaint.routes.js';
import { adminRoutes } from './admin.routes.js';
import { requireAuth } from '../middleware/authenticate.js';
import {
  requireOrganizationMembership,
  requireOrganizationRole,
  requirePlatformAdministrator,
} from '../middleware/authorize.js';
import { validateRequest } from '../middleware/validate-request.js';
import { StaffProvisioningService } from '../services/staff-provisioning.service.js';
import { ApiResponse } from '../utils/api-response.js';

const apiV1Router = Router();

// Mount public health and readiness routes
apiV1Router.use('/', healthRoutes);

// Mount authentication routes under /auth
apiV1Router.use('/auth', authRoutes);

// Mount profile routes under /profile
apiV1Router.use('/profile', profileRoutes);

// Mount complaint routes under /complaints
apiV1Router.use('/complaints', complaintRoutes);

// Mount admin routes under /admin
apiV1Router.use('/admin', adminRoutes);

const provisionStaffSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2).max(120),
  role: z.enum(['STAFF', 'SUPERVISOR']),
  departmentId: z.string().uuid().nullable().optional(),
});

/**
 * POST /api/v1/organizations/:orgId/staff/provision
 * Authorized Org Admin or Platform Admin provisions staff or supervisor accounts.
 */
apiV1Router.post(
  '/organizations/:orgId/staff/provision',
  requireAuth,
  requireOrganizationRole(['ORG_ADMIN'], 'orgId'),
  validateRequest({ body: provisionStaffSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await StaffProvisioningService.provisionStaff(
        req.params.orgId,
        req.body,
        req.user!.id
      );
      ApiResponse.created(res, result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Organization Boundary Verification Route.
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
