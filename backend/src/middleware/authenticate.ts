import { Request, Response, NextFunction } from 'express';
import { verifySupabaseToken } from '../config/supabase.js';
import { UnauthorizedError } from '../utils/app-error.js';
import { logger } from '../utils/logger.js';
import type { AuthenticatedUser, AuthContext } from '../types/auth.types.js';

/**
 * Extracts and sanitizes the Bearer access token from Authorization header.
 */
function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0]?.toLowerCase() !== 'bearer') {
    return null;
  }

  const token = parts[1]?.trim();
  return token && token.length > 0 ? token : null;
}

/**
 * Mandatory Authentication Middleware.
 * Enforces valid Supabase Auth JWT token on protected routes.
 * Rejects missing, malformed, expired, or forged tokens with HTTP 401.
 * Never trusts client body claims for identity or authorization.
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      throw new UnauthorizedError('Missing or malformed Authorization header. Expected Bearer <token>.');
    }

    const verifiedUser = await verifySupabaseToken(token);

    if (!verifiedUser) {
      logger.warn('Authentication rejected: invalid, expired, or forged token', {
        requestId: req.id || req.requestId,
        ip: req.ip,
      });
      throw new UnauthorizedError('Invalid or expired authentication token.');
    }

    // Attach verified user identity
    const authenticatedUser: AuthenticatedUser = {
      id: verifiedUser.id,
      email: verifiedUser.email,
      phone: verifiedUser.phone,
      appMetadata: verifiedUser.app_metadata || {},
      userMetadata: verifiedUser.user_metadata || {},
    };

    req.user = authenticatedUser;
    req.authContext = {
      user: authenticatedUser,
      token,
      memberships: [],
      isPlatformAdmin: false,
    };

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Optional Authentication Middleware.
 * If a valid Bearer token is provided, attaches verified user identity to req.user.
 * If no token is provided, proceeds anonymously without error.
 * If an invalid token is explicitly supplied, rejects with 401.
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      return next();
    }

    const verifiedUser = await verifySupabaseToken(token);

    if (!verifiedUser) {
      throw new UnauthorizedError('Invalid or expired authentication token.');
    }

    const authenticatedUser: AuthenticatedUser = {
      id: verifiedUser.id,
      email: verifiedUser.email,
      phone: verifiedUser.phone,
      appMetadata: verifiedUser.app_metadata || {},
      userMetadata: verifiedUser.user_metadata || {},
    };

    req.user = authenticatedUser;
    req.authContext = {
      user: authenticatedUser,
      token,
      memberships: [],
      isPlatformAdmin: false,
    };

    next();
  } catch (err) {
    next(err);
  }
}
