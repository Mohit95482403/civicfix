import { getDefaultSupabaseClient, createUserSupabaseClient } from '../config/supabase.js';
import { isSupabaseConfigured } from '../config/env.js';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ServiceUnavailableError,
  UnauthorizedError,
} from '../utils/app-error.js';
import { logger } from '../utils/logger.js';
import { AuthorizationService } from './authorization.service.js';
import type { RegisterBody, LoginBody, ForgotPasswordBody, ResetPasswordBody, RefreshTokenBody } from '../validators/auth.validators.js';
import type { StaffRole } from '../types/database.types.js';
import type { StaffMembershipInfo } from '../types/auth.types.js';

export interface UserAuthResult {
  user: {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    avatarPath?: string | null;
    preferredLanguage: string;
    role: 'citizen' | 'staff' | 'department_supervisor' | 'organization_admin' | 'platform_admin';
    emailVerified: boolean;
    isActive: boolean;
  };
  memberships: StaffMembershipInfo[];
  token?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  };
}

export class AuthService {
  /**
   * Helper to resolve the effective primary role for UI and authorization context.
   */
  public static computePrimaryRole(
    isPlatformAdmin: boolean,
    memberships: StaffMembershipInfo[]
  ): 'citizen' | 'staff' | 'department_supervisor' | 'organization_admin' | 'platform_admin' {
    if (isPlatformAdmin) return 'platform_admin';

    const activeRoles = memberships.filter((m) => m.isActive).map((m) => m.role);
    if (activeRoles.includes('ORG_ADMIN')) return 'organization_admin';
    if (activeRoles.includes('SUPERVISOR')) return 'department_supervisor';
    if (activeRoles.includes('STAFF')) return 'staff';

    return 'citizen';
  }

  /**
   * Citizen Registration.
   * Public registration is strictly restricted to the citizen role.
   * Creates Supabase Auth identity and ensures profile consistency.
   */
  public static async registerCitizen(data: RegisterBody): Promise<{
    user: { id: string; email: string; createdAt: string; emailVerified: boolean };
    session: { accessToken: string; expiresIn: number; tokenType: string } | null;
    message: string;
    emailVerificationRequired: boolean;
  }> {
    if (!isSupabaseConfigured()) {
      throw new ServiceUnavailableError(
        'Supabase Auth is not configured. Please supply SUPABASE_URL and SUPABASE_ANON_KEY.'
      );
    }

    const supabase = getDefaultSupabaseClient();

    // 1. Invoke Supabase Auth signUp
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          preferred_language: data.preferredLanguage,
        },
      },
    });

    if (authError) {
      logger.warn('Supabase Auth registration failed', {
        email: data.email,
        error: authError.message,
      });

      if (authError.message.toLowerCase().includes('already registered')) {
        throw new ConflictError('An account with this email address already exists.');
      }
      throw new BadRequestError(authError.message);
    }

    if (!authData.user) {
      throw new BadRequestError('Failed to create user account.');
    }

    const userId = authData.user.id;
    const isEmailVerified = Boolean(authData.user.email_confirmed_at);

    // 2. Profile Verification / Fallback
    // In production, database trigger trg_on_auth_user_created automatically inserts into profiles.
    // We execute an idempotent check to guarantee profile existence even if trigger is delayed.
    try {
      const { data: profile } = await (supabase.from('profiles') as any)
        .select('id')
        .eq('id', userId)
        .single();

      if (!profile) {
        // Fallback insertion if trigger did not execute
        await (supabase.from('profiles') as any).insert({
          id: userId,
          email: data.email,
          full_name: data.fullName,
          phone_number: data.phoneNumber || null,
          preferred_language: data.preferredLanguage,
          is_active: true,
        });
      }
    } catch (profileErr) {
      logger.warn('Profile fallback check encountered non-fatal notice', {
        userId,
        error: profileErr instanceof Error ? profileErr.message : String(profileErr),
      });
    }

    const hasSession = Boolean(authData.session);

    return {
      user: {
        id: userId,
        email: data.email,
        createdAt: authData.user.created_at,
        emailVerified: isEmailVerified,
      },
      session: authData.session
        ? {
            accessToken: authData.session.access_token,
            expiresIn: authData.session.expires_in,
            tokenType: authData.session.token_type,
          }
        : null,
      message: hasSession
        ? 'Registration successful.'
        : 'Registration successful. Please check your email to verify your account before logging in.',
      emailVerificationRequired: !hasSession && !isEmailVerified,
    };
  }

  /**
   * User Login.
   * Authenticates with Supabase Auth, verifies active profile status, and loads memberships.
   */
  public static async login(data: LoginBody): Promise<UserAuthResult> {
    if (!isSupabaseConfigured()) {
      throw new ServiceUnavailableError(
        'Supabase Auth is not configured. Please supply SUPABASE_URL and SUPABASE_ANON_KEY.'
      );
    }

    const supabase = getDefaultSupabaseClient();

    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError || !authData.user || !authData.session) {
      logger.warn('Failed login attempt', {
        email: data.email,
        error: authError?.message,
      });

      if (authError?.message.toLowerCase().includes('email not confirmed')) {
        throw new UnauthorizedError(
          'Email address is not yet verified. Please verify your email before logging in.'
        );
      }
      throw new UnauthorizedError('Invalid email or password.');
    }

    const userId = authData.user.id;
    const token = authData.session.access_token;

    // 2. Query user profile using user-scoped client
    const userClient = createUserSupabaseClient(token);
    const { data: profileData, error: profileError } = await (userClient.from('profiles') as any)
      .select('id, email, full_name, phone_number, avatar_path, preferred_language, is_active')
      .eq('id', userId)
      .single();

    const profile = profileData as {
      id: string;
      email: string;
      full_name: string;
      phone_number: string | null;
      avatar_path: string | null;
      preferred_language: string;
      is_active: boolean;
    } | null;

    if (profileError || !profile) {
      logger.error('Profile missing for authenticated user', { userId });
      throw new NotFoundError('User profile not found. Please contact support.');
    }

    // 3. Check account active status
    if (!profile.is_active) {
      throw new ForbiddenError('This account has been deactivated. Please contact your municipal administrator.');
    }

    // 4. Resolve memberships and platform admin privileges
    const [memberships, isPlatformAdmin] = await Promise.all([
      AuthorizationService.getUserMemberships(userId, token),
      AuthorizationService.isPlatformAdmin(userId, token),
    ]);

    const primaryRole = this.computePrimaryRole(isPlatformAdmin, memberships);

    return {
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        phoneNumber: profile.phone_number,
        avatarPath: profile.avatar_path,
        preferredLanguage: profile.preferred_language,
        role: primaryRole,
        emailVerified: Boolean(authData.user.email_confirmed_at),
        isActive: profile.is_active,
      },
      memberships,
      token: {
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresIn: authData.session.expires_in,
        tokenType: authData.session.token_type,
      },
    };
  }

  /**
   * Current User Session Details (/me).
   * Retrieves verified user profile, email verification flag, and active organizational memberships.
   */
  public static async getCurrentUser(userId: string, accessToken: string): Promise<UserAuthResult> {
    if (!isSupabaseConfigured()) {
      throw new ServiceUnavailableError('Supabase is not configured.');
    }

    const userClient = createUserSupabaseClient(accessToken);

    // 1. Fetch user metadata from Auth
    const { data: authUser, error: authError } = await userClient.auth.getUser();
    if (authError || !authUser.user) {
      throw new UnauthorizedError('Invalid or expired authentication session.');
    }

    // 2. Fetch application profile
    const { data: profileData, error: profileError } = await (userClient.from('profiles') as any)
      .select('id, email, full_name, phone_number, avatar_path, preferred_language, is_active')
      .eq('id', userId)
      .single();

    const profile = profileData as {
      id: string;
      email: string;
      full_name: string;
      phone_number: string | null;
      avatar_path: string | null;
      preferred_language: string;
      is_active: boolean;
    } | null;

    if (profileError || !profile) {
      throw new NotFoundError('User profile record does not exist.');
    }

    if (!profile.is_active) {
      throw new ForbiddenError('This account has been deactivated.');
    }

    // 3. Fetch organizational memberships & platform admin status
    const [memberships, isPlatformAdmin] = await Promise.all([
      AuthorizationService.getUserMemberships(userId, accessToken),
      AuthorizationService.isPlatformAdmin(userId, accessToken),
    ]);

    const primaryRole = this.computePrimaryRole(isPlatformAdmin, memberships);

    return {
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        phoneNumber: profile.phone_number,
        avatarPath: profile.avatar_path,
        preferredLanguage: profile.preferred_language,
        role: primaryRole,
        emailVerified: Boolean(authUser.user.email_confirmed_at),
        isActive: profile.is_active,
      },
      memberships,
    };
  }

  /**
   * Password Recovery Request (Forgot Password).
   * Sends password recovery instructions using Supabase Auth.
   * Returns a safe generic message to prevent email enumeration attacks.
   */
  public static async forgotPassword(data: ForgotPasswordBody): Promise<{ message: string }> {
    if (!isSupabaseConfigured()) {
      throw new ServiceUnavailableError('Supabase is not configured.');
    }

    const supabase = getDefaultSupabaseClient();
    try {
      await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: data.redirectTo,
      });
    } catch (err) {
      logger.warn('Password reset request error (suppressed for safety)', {
        email: data.email,
        error: err instanceof Error ? err.message : String(err),
      });
    }

    return {
      message: 'If an account exists with this email address, password reset instructions have been sent.',
    };
  }

  /**
   * Password Reset Completion.
   * Updates user's password using the authenticated recovery token.
   */
  public static async resetPassword(token: string, data: ResetPasswordBody): Promise<{ message: string }> {
    if (!isSupabaseConfigured()) {
      throw new ServiceUnavailableError('Supabase is not configured.');
    }

    const userClient = createUserSupabaseClient(token);
    const { error } = await userClient.auth.updateUser({
      password: data.newPassword,
    });

    if (error) {
      logger.warn('Password reset execution failed', { error: error.message });
      throw new BadRequestError(error.message);
    }

    return {
      message: 'Password has been successfully updated. You may now log in with your new password.',
    };
  }

  /**
   * Session Refresh.
   * Refreshes an expired access token using a valid refresh token.
   */
  public static async refreshSession(data: RefreshTokenBody): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  }> {
    if (!isSupabaseConfigured()) {
      throw new ServiceUnavailableError('Supabase is not configured.');
    }

    const supabase = getDefaultSupabaseClient();
    const { data: refreshData, error } = await supabase.auth.refreshSession({
      refresh_token: data.refreshToken,
    });

    if (error || !refreshData.session) {
      logger.warn('Session refresh failed', { error: error?.message });
      throw new UnauthorizedError('Invalid or expired refresh token. Please log in again.');
    }

    return {
      accessToken: refreshData.session.access_token,
      refreshToken: refreshData.session.refresh_token,
      expiresIn: refreshData.session.expires_in,
      tokenType: refreshData.session.token_type,
    };
  }
}
