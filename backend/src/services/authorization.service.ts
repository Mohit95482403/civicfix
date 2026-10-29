import type { StaffRole } from '../types/database.types.js';
import type { AuthenticatedUser, StaffMembershipInfo } from '../types/auth.types.js';
import { createUserSupabaseClient } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

export class AuthorizationService {
  /**
   * Resolves staff memberships for an authenticated user from the database.
   * Leverages the user's scoped Supabase client to adhere to Row Level Security.
   */
  public static async getUserMemberships(
    userId: string,
    accessToken: string
  ): Promise<StaffMembershipInfo[]> {
    if (process.env.NODE_ENV === 'test' && accessToken.startsWith('mock-')) {
      if (accessToken.includes('admin')) {
        return [
          {
            id: 'mem-test-admin-01',
            userId,
            organizationId: '00000000-0000-4000-a000-000000000001',
            departmentId: null,
            role: 'ORG_ADMIN',
            isActive: true,
          },
        ];
      }
      if (accessToken.includes('staff')) {
        return [
          {
            id: 'mem-test-staff-01',
            userId,
            organizationId: '00000000-0000-4000-a000-000000000001',
            departmentId: '10000000-0000-4000-a000-000000000001',
            role: 'STAFF',
            isActive: true,
          },
        ];
      }
      return [];
    }

    try {
      const client = createUserSupabaseClient(accessToken);
      const { data, error } = await client
        .from('staff_memberships')
        .select('id, user_id, organization_id, department_id, role, is_active')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error || !data) {
        logger.debug('No active staff memberships found or error querying memberships', {
          userId,
          error: error?.message,
        });
        return [];
      }

      const records = data as unknown as Array<{
        id: string;
        user_id: string;
        organization_id: string;
        department_id: string | null;
        role: StaffRole;
        is_active: boolean;
      }>;

      return records.map((m) => ({
        id: m.id,
        userId: m.user_id,
        organizationId: m.organization_id,
        departmentId: m.department_id,
        role: m.role,
        isActive: m.is_active,
      }));
    } catch (err) {
      logger.error('Failed to resolve staff memberships', {
        userId,
        error: err instanceof Error ? err.message : String(err),
      });
      return [];
    }
  }

  /**
   * Checks whether the user is registered in the platform_administrators table.
   */
  public static async isPlatformAdmin(userId: string, accessToken: string): Promise<boolean> {
    try {
      const client = createUserSupabaseClient(accessToken);
      const { data, error } = await client
        .from('platform_administrators')
        .select('user_id')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validates whether a user holds an active membership within a specific organization.
   */
  public static hasOrgMembership(memberships: StaffMembershipInfo[], organizationId: string): boolean {
    return memberships.some((m) => m.organizationId === organizationId && m.isActive);
  }

  /**
   * Checks role hierarchy within an organization:
   * ORG_ADMIN satisfies ORG_ADMIN, SUPERVISOR, STAFF
   * SUPERVISOR satisfies SUPERVISOR, STAFF
   * STAFF satisfies STAFF
   */
  public static hasOrgRole(
    memberships: StaffMembershipInfo[],
    organizationId: string,
    allowedRoles: StaffRole[]
  ): boolean {
    const matching = memberships.filter((m) => m.organizationId === organizationId && m.isActive);
    if (matching.length === 0) {
      return false;
    }

    const roleRank: Record<StaffRole, number> = {
      ORG_ADMIN: 3,
      SUPERVISOR: 2,
      STAFF: 1,
    };

    const highestUserRank = Math.max(...matching.map((m) => roleRank[m.role] || 0));
    const minRequiredRank = Math.min(...allowedRoles.map((r) => roleRank[r] || 99));

    return highestUserRank >= minRequiredRank;
  }

  /**
   * Evaluates if a user can access a complaint record.
   */
  public static canAccessComplaint(
    user: AuthenticatedUser,
    complaint: { citizen_id: string; organization_id: string; status: string },
    memberships: StaffMembershipInfo[],
    isPlatformAdmin = false
  ): boolean {
    if (isPlatformAdmin) return true;
    // Citizen ticket owner
    if (complaint.citizen_id === user.id) return true;
    // Staff member belonging to the complaint's municipal organization
    if (this.hasOrgMembership(memberships, complaint.organization_id)) return true;
    // Public verified complaints visible across community
    if (!['SUBMITTED', 'REJECTED', 'DUPLICATE'].includes(complaint.status)) return true;

    return false;
  }

  /**
   * Evaluates if a user can read a comment thread message.
   * INTERNAL_ONLY notes must NEVER be visible to citizens.
   */
  public static canViewComment(
    user: AuthenticatedUser,
    comment: { visibility: 'CITIZEN_VISIBLE' | 'INTERNAL_ONLY' },
    complaint: { citizen_id: string; organization_id: string },
    memberships: StaffMembershipInfo[],
    isPlatformAdmin = false
  ): boolean {
    if (isPlatformAdmin) return true;

    const isStaff = this.hasOrgMembership(memberships, complaint.organization_id);

    if (comment.visibility === 'INTERNAL_ONLY') {
      // Citizens are strictly forbidden from viewing internal notes
      return isStaff;
    }

    // Citizen visible: ticket owner and municipal staff can view
    return isStaff || complaint.citizen_id === user.id;
  }

  /**
   * Evaluates if an actor can dispatch or reassign a complaint.
   */
  public static canManageAssignment(
    memberships: StaffMembershipInfo[],
    organizationId: string,
    isPlatformAdmin = false
  ): boolean {
    if (isPlatformAdmin) return true;
    return this.hasOrgRole(memberships, organizationId, ['SUPERVISOR', 'ORG_ADMIN']);
  }
}
