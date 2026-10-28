import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../utils/app-error.js';
import { AuthorizationService } from '../services/authorization.service.js';
import type { StaffRole } from '../types/database.types.js';

/**
 * Ensures that the request contains a verified authenticated user context.
 */
export function requireAuthenticatedUser(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user || !req.authContext) {
    return next(new UnauthorizedError('Authentication is required to access this resource.'));
  }
  next();
}

/**
 * Helper to lazily populate staff memberships and platform admin state on req.authContext.
 */
async function ensureAuthContextLoaded(req: Request): Promise<void> {
  if (!req.user || !req.authContext) {
    throw new UnauthorizedError('Authentication is required.');
  }

  if (req.authContext.memberships.length === 0) {
    const [memberships, isPlatformAdmin] = await Promise.all([
      AuthorizationService.getUserMemberships(req.user.id, req.authContext.token),
      AuthorizationService.isPlatformAdmin(req.user.id, req.authContext.token),
    ]);
    req.authContext.memberships = memberships;
    req.authContext.isPlatformAdmin = isPlatformAdmin;
  }
}

/**
 * Middleware requiring active membership in the target organization.
 * Extracts organizationId from params, body, or query string.
 * Platform administrators bypass organization boundary checks.
 */
export function requireOrganizationMembership(paramKey = 'orgId') {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await ensureAuthContextLoaded(req);

      const targetOrgId =
        req.params[paramKey] ||
        (req.body && typeof req.body === 'object' && 'organizationId' in req.body
          ? (req.body as { organizationId?: string }).organizationId
          : undefined) ||
        (typeof req.query.organizationId === 'string' ? req.query.organizationId : undefined);

      if (!targetOrgId) {
        return next(new ForbiddenError('Target organization identifier is missing.'));
      }

      if (req.authContext!.isPlatformAdmin) {
        return next();
      }

      const isMember = AuthorizationService.hasOrgMembership(
        req.authContext!.memberships,
        targetOrgId
      );

      if (!isMember) {
        return next(
          new ForbiddenError('Access denied: You do not have an active membership in this municipal organization.')
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Middleware requiring specific staff role rank within the target organization.
 * (e.g. ['SUPERVISOR', 'ORG_ADMIN'])
 */
export function requireOrganizationRole(allowedRoles: StaffRole[], paramKey = 'orgId') {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await ensureAuthContextLoaded(req);

      const targetOrgId =
        req.params[paramKey] ||
        (req.body && typeof req.body === 'object' && 'organizationId' in req.body
          ? (req.body as { organizationId?: string }).organizationId
          : undefined) ||
        (typeof req.query.organizationId === 'string' ? req.query.organizationId : undefined);

      if (!targetOrgId) {
        return next(new ForbiddenError('Target organization identifier is missing.'));
      }

      if (req.authContext!.isPlatformAdmin) {
        return next();
      }

      const hasRole = AuthorizationService.hasOrgRole(
        req.authContext!.memberships,
        targetOrgId,
        allowedRoles
      );

      if (!hasRole) {
        return next(
          new ForbiddenError(
            `Access denied: Required role (${allowedRoles.join(' or ')}) not held in this organization.`
          )
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Middleware requiring global platform administrator privilege.
 * Rejects regular organization administrators and staff.
 */
export function requirePlatformAdministrator() {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await ensureAuthContextLoaded(req);

      if (!req.authContext!.isPlatformAdmin) {
        return next(new ForbiddenError('Access denied: Platform administrator privileges required.'));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
