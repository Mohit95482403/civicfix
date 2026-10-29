export type UserRole =
  | 'citizen'
  | 'staff'
  | 'department_supervisor'
  | 'organization_admin'
  | 'platform_admin';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: UserRole;
  emailVerified: boolean;
  avatarPath?: string | null;
  preferredLanguage?: string;
}

export interface OrgMembership {
  id: string;
  organizationId: string;
  departmentId?: string | null;
  role: string;
  status: string;
  organizationName?: string;
  departmentName?: string;
  organization?: {
    id: string;
    name: string;
    slug?: string;
  };
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface LoginResponse {
  user: AuthUser;
  session: AuthSession | null;
  emailVerificationRequired: boolean;
}

export interface AuthMeResponse {
  user: AuthUser;
  memberships: OrgMembership[];
}
