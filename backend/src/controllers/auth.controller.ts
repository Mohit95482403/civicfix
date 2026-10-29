import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/api-response.js';
import { AuthService } from '../services/auth.service.js';
import { UnauthorizedError } from '../utils/app-error.js';
import type {
  RegisterBody,
  LoginBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  RefreshTokenBody,
} from '../validators/auth.validators.js';

export class AuthController {
  /**
   * POST /api/auth/register & /api/v1/auth/register
   * Registers a new citizen account using Supabase Auth.
   */
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.registerCitizen(req.body as RegisterBody);
      ApiResponse.created(res, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/login & /api/v1/auth/login
   * Authenticates user via Supabase Auth and loads profile & memberships.
   */
  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body as LoginBody);
      ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/auth/me & /api/v1/auth/me
   * Retrieves verified current user session, profile, and organizational memberships.
   */
  public static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.authContext) {
        throw new UnauthorizedError('Authentication is required.');
      }

      const result = await AuthService.getCurrentUser(req.user.id, req.authContext.token);
      ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/logout & /api/v1/auth/logout
   * Handles user logout. Client must discard local access and refresh tokens.
   */
  public static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      ApiResponse.success(res, {
        message: 'Successfully logged out. Client session has been cleared.',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/forgot-password & /api/v1/auth/forgot-password
   * Sends password reset email instructions via Supabase Auth.
   */
  public static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.forgotPassword(req.body as ForgotPasswordBody);
      ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/reset-password & /api/v1/auth/reset-password
   * Updates password using the authenticated recovery token.
   */
  public static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.authContext?.token) {
        throw new UnauthorizedError('Valid recovery token required in Authorization header.');
      }

      const result = await AuthService.resetPassword(req.authContext.token, req.body as ResetPasswordBody);
      ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/refresh & /api/v1/auth/refresh
   * Refreshes user session using a valid refresh token.
   */
  public static async refreshSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.refreshSession(req.body as RefreshTokenBody);
      ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }
}
