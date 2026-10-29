import { request } from './api';
import { AuthUser, OrgMembership } from '../types/auth';

export interface ProfileResponse {
  profile: AuthUser;
  role: string;
  memberships: OrgMembership[];
}

export const profileService = {
  async getProfile(): Promise<ProfileResponse> {
    const res = await request<ProfileResponse>('/profile', { method: 'GET' });
    return res.data!;
  },

  async updateProfile(updates: {
    fullName?: string;
    phone?: string;
    phoneNumber?: string;
    preferredLanguage?: string;
  }): Promise<AuthUser> {
    const payload = {
      fullName: updates.fullName,
      phoneNumber: updates.phoneNumber || updates.phone,
      preferredLanguage: updates.preferredLanguage,
    };
    const res = await request<{ profile: AuthUser }>('/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return res.data!.profile;
  },
};
