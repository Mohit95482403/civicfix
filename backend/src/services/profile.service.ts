import { createUserSupabaseClient } from '../config/supabase.js';
import { isSupabaseConfigured } from '../config/env.js';
import { BadRequestError, ForbiddenError, NotFoundError, ServiceUnavailableError } from '../utils/app-error.js';
import { AuthorizationService } from './authorization.service.js';
import { AuthService } from './auth.service.js';
import type { UpdateProfileBody } from '../validators/profile.validators.js';
import type { StaffMembershipInfo } from '../types/auth.types.js';

export interface UserProfileResponse {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  avatarPath?: string | null;
  preferredLanguage: string;
  role: 'citizen' | 'staff' | 'department_supervisor' | 'organization_admin' | 'platform_admin';
  isActive: boolean;
  memberships: StaffMembershipInfo[];
  createdAt: string;
  updatedAt: string;
}

export class ProfileService {
  /**
   * Retrieves the current user's profile and staff memberships.
   */
  public static async getProfile(userId: string, accessToken: string): Promise<UserProfileResponse> {
    if (!isSupabaseConfigured()) {
      throw new ServiceUnavailableError('Supabase is not configured.');
    }

    const client = createUserSupabaseClient(accessToken);
    const { data: profileData, error } = await (client.from('profiles') as any)
      .select('id, email, full_name, phone_number, avatar_path, preferred_language, is_active, created_at, updated_at')
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
      created_at: string;
      updated_at: string;
    } | null;

    if (error || !profile) {
      throw new NotFoundError('Profile not found.');
    }

    const [memberships, isPlatformAdmin] = await Promise.all([
      AuthorizationService.getUserMemberships(userId, accessToken),
      AuthorizationService.isPlatformAdmin(userId, accessToken),
    ]);

    const primaryRole = AuthService.computePrimaryRole(isPlatformAdmin, memberships);

    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      phoneNumber: profile.phone_number,
      avatarPath: profile.avatar_path,
      preferredLanguage: profile.preferred_language,
      role: primaryRole,
      isActive: profile.is_active,
      memberships,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  }

  /**
   * Updates permitted profile fields for the authenticated user.
   * Modifying roles, memberships, active status, or email is strictly rejected.
   */
  public static async updateProfile(
    userId: string,
    accessToken: string,
    data: UpdateProfileBody
  ): Promise<UserProfileResponse> {
    if (!isSupabaseConfigured()) {
      throw new ServiceUnavailableError('Supabase is not configured.');
    }

    const client = createUserSupabaseClient(accessToken);

    // Map allowed camelCase fields to snake_case database columns
    const updatePayload: Record<string, unknown> = {};

    if (data.fullName !== undefined) {
      updatePayload.full_name = data.fullName;
    }
    if (data.phoneNumber !== undefined) {
      updatePayload.phone_number = data.phoneNumber;
    }
    if (data.avatarPath !== undefined) {
      updatePayload.avatar_path = data.avatarPath;
    }
    if (data.preferredLanguage !== undefined) {
      updatePayload.preferred_language = data.preferredLanguage;
    }

    if (Object.keys(updatePayload).length === 0) {
      throw new BadRequestError('No valid profile fields provided for update.');
    }

    // Execute update through user-scoped client
    const { data: updatedData, error } = await (client.from('profiles') as any)
      .update(updatePayload)
      .eq('id', userId)
      .select('id, email, full_name, phone_number, avatar_path, preferred_language, is_active, created_at, updated_at')
      .single();

    const updated = updatedData as {
      id: string;
      email: string;
      full_name: string;
      phone_number: string | null;
      avatar_path: string | null;
      preferred_language: string;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    } | null;

    if (error || !updated) {
      throw new BadRequestError(error?.message || 'Failed to update profile.');
    }

    const [memberships, isPlatformAdmin] = await Promise.all([
      AuthorizationService.getUserMemberships(userId, accessToken),
      AuthorizationService.isPlatformAdmin(userId, accessToken),
    ]);

    const primaryRole = AuthService.computePrimaryRole(isPlatformAdmin, memberships);

    return {
      id: updated.id,
      email: updated.email,
      fullName: updated.full_name,
      phoneNumber: updated.phone_number,
      avatarPath: updated.avatar_path,
      preferredLanguage: updated.preferred_language,
      role: primaryRole,
      isActive: updated.is_active,
      memberships,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    };
  }
}
