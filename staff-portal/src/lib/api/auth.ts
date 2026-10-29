import { config } from '../config/env';
import { ApiError } from './client';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: 'citizen' | 'staff' | 'department_supervisor' | 'organization_admin' | 'platform_admin';
  emailVerified: boolean;
  avatarPath?: string | null;
}

export interface OrgMembership {
  id: string;
  organizationId: string;
  departmentId?: string | null;
  role: string;
  status: string;
  organizationName?: string;
  departmentName?: string;
}

export interface AuthMeResponse {
  user: AuthUser;
  memberships: OrgMembership[];
}

export interface LoginResponse {
  user: AuthUser;
  session: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  } | null;
  emailVerificationRequired: boolean;
}

const TOKEN_KEY = 'civicfix_staff_token';
const REFRESH_TOKEN_KEY = 'civicfix_staff_refresh_token';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (access: string, refresh?: string) => {
    localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${config.apiBaseUrl.replace('/v1', '')}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new ApiError(
        data.error?.message || 'Login failed. Please check your credentials.',
        data.error?.code || 'AUTH_ERROR',
        res.status
      );
    }

    if (data.data?.session?.accessToken) {
      authStorage.setTokens(data.data.session.accessToken, data.data.session.refreshToken);
    }

    return data.data;
  },

  async getMe(): Promise<AuthMeResponse> {
    const token = authStorage.getToken();
    if (!token) {
      throw new ApiError('Not authenticated', 'UNAUTHORIZED', 401);
    }

    const res = await fetch(`${config.apiBaseUrl.replace('/v1', '')}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      if (res.status === 401) {
        authStorage.clearTokens();
      }
      throw new ApiError(
        data.error?.message || 'Failed to fetch user session',
        data.error?.code || 'AUTH_ERROR',
        res.status
      );
    }

    return data.data;
  },

  async logout(): Promise<void> {
    const token = authStorage.getToken();
    try {
      if (token) {
        await fetch(`${config.apiBaseUrl.replace('/v1', '')}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } finally {
      authStorage.clearTokens();
    }
  },
};
