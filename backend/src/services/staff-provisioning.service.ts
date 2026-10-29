import { getAdminSupabaseClient, createUserSupabaseClient } from '../config/supabase.js';
import { isSupabaseConfigured, isSupabaseAdminConfigured } from '../config/env.js';
import { BadRequestError, ConflictError, NotFoundError, ServiceUnavailableError } from '../utils/app-error.js';
import { logger } from '../utils/logger.js';
import type { StaffRole } from '../types/database.types.js';

export interface ProvisionStaffRequest {
  email: string;
  fullName: string;
  role: 'STAFF' | 'SUPERVISOR';
  departmentId?: string | null;
}

export class StaffProvisioningService {
  /**
   * Provisions a staff member or supervisor within an organization.
   * Can only be invoked by an authenticated Organization Administrator or Platform Administrator.
   */
  public static async provisionStaff(
    organizationId: string,
    data: ProvisionStaffRequest,
    adminUserId: string
  ): Promise<{
    membershipId: string;
    userId: string;
    email: string;
    role: StaffRole;
    organizationId: string;
    departmentId: string | null;
  }> {
    if (!isSupabaseConfigured()) {
      throw new ServiceUnavailableError('Supabase is not configured.');
    }

    // 1. Check if department belongs to this organization if departmentId is provided
    const adminClient = isSupabaseAdminConfigured()
      ? getAdminSupabaseClient()
      : null;

    if (!adminClient) {
      throw new ServiceUnavailableError(
        'Staff provisioning requires SUPABASE_SERVICE_ROLE_KEY configured on server.'
      );
    }

    if (data.departmentId) {
      const { data: dept, error: deptError } = await adminClient
        .from('departments')
        .select('id, organization_id')
        .eq('id', data.departmentId)
        .eq('organization_id', organizationId)
        .single();

      if (deptError || !dept) {
        throw new BadRequestError('The specified department does not belong to this organization.');
      }
    }

    // 2. Find profile by email or create placeholder
    const { data: profileData } = await (adminClient.from('profiles') as any)
      .select('id, email')
      .eq('email', data.email.toLowerCase().trim())
      .single();

    const profile = profileData as { id: string; email: string } | null;
    let targetUserId: string;

    if (profile) {
      targetUserId = profile.id;
    } else {
      // Create user identity via admin client
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email: data.email.toLowerCase().trim(),
        email_confirm: true,
        user_metadata: {
          full_name: data.fullName,
        },
      });

      if (createError || !newUser.user) {
        logger.error('Failed to provision user identity for staff member', { error: createError?.message });
        throw new BadRequestError(`Failed to create staff account: ${createError?.message}`);
      }

      targetUserId = newUser.user.id;
    }

    // 3. Upsert staff_membership record
    const { data: membershipData, error: memError } = await (adminClient.from('staff_memberships') as any)
      .upsert(
        {
          user_id: targetUserId,
          organization_id: organizationId,
          department_id: data.departmentId || null,
          role: data.role as StaffRole,
          is_active: true,
        },
        { onConflict: 'user_id,organization_id' }
      )
      .select('id, user_id, organization_id, department_id, role')
      .single();

    const membership = membershipData as {
      id: string;
      user_id: string;
      organization_id: string;
      department_id: string | null;
      role: StaffRole;
    } | null;

    if (memError || !membership) {
      logger.error('Failed to create staff membership', { error: memError?.message });
      throw new BadRequestError(`Failed to assign staff membership: ${memError?.message}`);
    }

    logger.info('Staff member provisioned successfully', {
      organizationId,
      targetUserId,
      role: data.role,
      assignedBy: adminUserId,
    });

    return {
      membershipId: membership.id,
      userId: membership.user_id,
      email: data.email,
      role: membership.role,
      organizationId: membership.organization_id,
      departmentId: membership.department_id,
    };
  }
}
