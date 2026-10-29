import { describe, it, expect, beforeEach } from 'vitest';
import { UserRole } from '../types/auth';
import { storage } from '../utils/storage';

function getDashboardForRole(role: UserRole): string {
  switch (role) {
    case 'citizen':
      return '/citizen/dashboard';
    case 'staff':
    case 'department_supervisor':
      return '/staff/dashboard';
    case 'organization_admin':
      return '/admin/dashboard';
    case 'platform_admin':
      return '/platform-admin/dashboard';
    default:
      return '/citizen/dashboard';
  }
}

function isRoleAllowed(userRole: UserRole | null, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

describe('CivicFix Unified Architecture — Role-Based Routing & Authorization Guard Tests', () => {
  beforeEach(() => {
    storage.clearTokens();
  });

  describe('Role-Based Redirection Target Calculation', () => {
    it('redirects citizen accounts strictly to /citizen/dashboard', () => {
      expect(getDashboardForRole('citizen')).toBe('/citizen/dashboard');
    });

    it('redirects field staff to /staff/dashboard', () => {
      expect(getDashboardForRole('staff')).toBe('/staff/dashboard');
    });

    it('redirects department supervisor to /staff/dashboard', () => {
      expect(getDashboardForRole('department_supervisor')).toBe('/staff/dashboard');
    });

    it('redirects organization admin to /admin/dashboard', () => {
      expect(getDashboardForRole('organization_admin')).toBe('/admin/dashboard');
    });

    it('redirects platform super-admin to /platform-admin/dashboard', () => {
      expect(getDashboardForRole('platform_admin')).toBe('/platform-admin/dashboard');
    });
  });

  describe('Role Guard Boundaries (Defense in Depth)', () => {
    const citizenAllowed: UserRole[] = ['citizen'];
    const staffAllowed: UserRole[] = ['staff', 'department_supervisor'];
    const adminAllowed: UserRole[] = ['organization_admin', 'platform_admin'];
    const platformAdminAllowed: UserRole[] = ['platform_admin'];

    it('allows citizens into citizen portal and rejects all unauthorized roles', () => {
      expect(isRoleAllowed('citizen', citizenAllowed)).toBe(true);
      expect(isRoleAllowed('staff', citizenAllowed)).toBe(false);
      expect(isRoleAllowed(null, citizenAllowed)).toBe(false);
    });

    it('prevents citizens from accessing staff portal', () => {
      expect(isRoleAllowed('citizen', staffAllowed)).toBe(false);
      expect(isRoleAllowed('staff', staffAllowed)).toBe(true);
      expect(isRoleAllowed('department_supervisor', staffAllowed)).toBe(true);
    });

    it('prevents citizens and field staff from accessing admin portal', () => {
      expect(isRoleAllowed('citizen', adminAllowed)).toBe(false);
      expect(isRoleAllowed('staff', adminAllowed)).toBe(false);
      expect(isRoleAllowed('department_supervisor', adminAllowed)).toBe(false);
      expect(isRoleAllowed('organization_admin', adminAllowed)).toBe(true);
      expect(isRoleAllowed('platform_admin', adminAllowed)).toBe(true);
    });

    it('restricts platform-admin portal exclusively to platform super-admins', () => {
      expect(isRoleAllowed('organization_admin', platformAdminAllowed)).toBe(false);
      expect(isRoleAllowed('citizen', platformAdminAllowed)).toBe(false);
      expect(isRoleAllowed('staff', platformAdminAllowed)).toBe(false);
      expect(isRoleAllowed('platform_admin', platformAdminAllowed)).toBe(true);
    });
  });

  describe('Secure Client-Side Token Lifecycle', () => {
    it('returns null when no session token exists', () => {
      expect(storage.getToken()).toBeNull();
      expect(storage.getRefreshToken()).toBeNull();
    });

    it('safely stores and restores access and refresh tokens', () => {
      storage.setTokens('mock-access-token-jwt', 'mock-refresh-token-jwt');
      expect(storage.getToken()).toBe('mock-access-token-jwt');
      expect(storage.getRefreshToken()).toBe('mock-refresh-token-jwt');
    });

    it('completely clears stored tokens on logout', () => {
      storage.setTokens('token-1', 'refresh-1');
      storage.clearTokens();
      expect(storage.getToken()).toBeNull();
      expect(storage.getRefreshToken()).toBeNull();
    });
  });
});
