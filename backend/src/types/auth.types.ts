import type { StaffRole } from './database.types.js';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  phone?: string;
  appMetadata: Record<string, unknown>;
  userMetadata: Record<string, unknown>;
}

export interface StaffMembershipInfo {
  id: string;
  userId: string;
  organizationId: string;
  departmentId: string | null;
  role: StaffRole;
  isActive: boolean;
}

export interface AuthContext {
  user: AuthenticatedUser;
  token: string;
  memberships: StaffMembershipInfo[];
  isPlatformAdmin: boolean;
}
