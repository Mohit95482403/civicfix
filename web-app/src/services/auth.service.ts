import { request } from './api';
import { AuthUser, AuthMeResponse, LoginResponse } from '../types/auth';
import { storage } from '../utils/storage';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.data?.session?.accessToken) {
      storage.setTokens(res.data.session.accessToken, res.data.session.refreshToken);
    }

    return res.data!;
  },

  async registerCitizen(data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ user: AuthUser; emailVerificationRequired: boolean }> {
    const res = await request<{ user: AuthUser; emailVerificationRequired: boolean; session: any }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    if (res.data?.session?.accessToken) {
      storage.setTokens(res.data.session.accessToken, res.data.session.refreshToken);
    }

    return res.data!;
  },

  async getMe(): Promise<AuthMeResponse> {
    const res = await request<AuthMeResponse>('/auth/me', {
      method: 'GET',
    });
    return res.data!;
  },

  async logout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      storage.clearTokens();
    }
  },

  async forgotPassword(email: string): Promise<string> {
    const res = await request<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return res.message || 'If an account exists, a recovery link has been dispatched.';
  },

  async resetPassword(newPassword: string, token?: string): Promise<string> {
    const res = await request<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ newPassword, token }),
    });
    return res.message || 'Password updated successfully.';
  },

  async refreshSession(): Promise<string | null> {
    const refreshToken = storage.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const res = await request<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });

      if (res.data?.accessToken) {
        storage.setTokens(res.data.accessToken, res.data.refreshToken);
        return res.data.accessToken;
      }
      return null;
    } catch {
      storage.clearTokens();
    }
    return null;
  },
};
