import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/api-response.js';
import { getDefaultSupabaseClient } from '../config/supabase.js';
import { isSupabaseConfigured } from '../config/env.js';
import { BadRequestError, ServiceUnavailableError, UnauthorizedError } from '../utils/app-error.js';
import type { RegisterBody, LoginBody } from '../validators/auth.validators.js';

export class AuthController {
  /**
   * GET /api/v1/auth/me
   * Returns current authenticated user session, profiles, and staff memberships.
   */
  public static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.authContext) {
        throw new UnauthorizedError('Authentication is required.');
      }

      ApiResponse.success(res, {
        user: req.user,
        memberships: req.authContext.memberships,
        isPlatformAdmin: req.authContext.isPlatformAdmin,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/register
   * Registers a new citizen account via Supabase Auth.
   * Auto-triggers database profile creation with safe defaults via trg_on_auth_user_created.
   */
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!isSupabaseConfigured()) {
        throw new ServiceUnavailableError(
          'Supabase Auth is not configured in this environment. Please configure SUPABASE_URL and SUPABASE_ANON_KEY.'
        );
      }

      const { email, password, fullName, phoneNumber, preferredLanguage } = req.body as RegisterBody;
      const supabase = getDefaultSupabaseClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: phoneNumber,
            preferred_language: preferredLanguage,
          },
        },
      });

      if (error) {
        throw new BadRequestError(error.message);
      }

      ApiResponse.created(res, {
        user: {
          id: data.user?.id,
          email: data.user?.email,
          createdAt: data.user?.created_at,
        },
        session: data.session
          ? {
              accessToken: data.session.access_token,
              expiresIn: data.session.expires_in,
              tokenType: data.session.token_type,
            }
          : null,
        message: data.session
          ? 'Registration successful.'
          : 'Registration initiated. Please check your email to confirm your account.',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/login
   * Authenticates user with Supabase Auth and returns JWT access token.
   */
  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!isSupabaseConfigured()) {
        throw new ServiceUnavailableError(
          'Supabase Auth is not configured in this environment. Please configure SUPABASE_URL and SUPABASE_ANON_KEY.'
        );
      }

      const { email, password } = req.body as LoginBody;
      const supabase = getDefaultSupabaseClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        throw new UnauthorizedError('Invalid email or password.');
      }

      ApiResponse.success(res, {
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        token: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresIn: data.session.expires_in,
          tokenType: data.session.token_type,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/logout
   * Invalidates authenticated user session.
   */
  public static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      ApiResponse.success(res, {
        message: 'Successfully logged out.',
      });
    } catch (err) {
      next(err);
    }
  }
}
