import { describe, it, expect } from 'vitest';
import { AuthorizationService } from '../../src/services/authorization.service.js';
import type { StaffMembershipInfo } from '../../src/types/auth.types.js';

describe('AuthorizationService Unit Tests', () => {
  const dummyUser = {
    id: 'user-citizen-1',
    email: 'citizen@example.com',
    appMetadata: {},
    userMetadata: {},
  };

  const sampleMemberships: StaffMembershipInfo[] = [
    {
      id: 'mem-1',
      userId: 'user-staff-1',
      organizationId: 'org-blr-bbmp',
      departmentId: 'dept-roads',
      role: 'STAFF',
      isActive: true,
    },
    {
      id: 'mem-2',
      userId: 'user-supervisor-1',
      organizationId: 'org-blr-bbmp',
      departmentId: 'dept-solid-waste',
      role: 'SUPERVISOR',
      isActive: true,
    },
    {
      id: 'mem-3',
      userId: 'user-admin-1',
      organizationId: 'org-pun-pmc',
      departmentId: null,
      role: 'ORG_ADMIN',
      isActive: true,
    },
  ];

  describe('Organization Membership Checking', () => {
    it('returns true when user belongs to organization', () => {
      const isMember = AuthorizationService.hasOrgMembership(sampleMemberships, 'org-blr-bbmp');
      expect(isMember).toBe(true);
    });

    it('returns false when user does not belong to organization', () => {
      const isMember = AuthorizationService.hasOrgMembership(sampleMemberships, 'org-unknown-council');
      expect(isMember).toBe(false);
    });
  });

  describe('Role Hierarchy Checking', () => {
    it('ORG_ADMIN satisfies ORG_ADMIN, SUPERVISOR, and STAFF roles', () => {
      expect(AuthorizationService.hasOrgRole(sampleMemberships, 'org-pun-pmc', ['ORG_ADMIN'])).toBe(true);
      expect(AuthorizationService.hasOrgRole(sampleMemberships, 'org-pun-pmc', ['SUPERVISOR'])).toBe(true);
      expect(AuthorizationService.hasOrgRole(sampleMemberships, 'org-pun-pmc', ['STAFF'])).toBe(true);
    });

    it('SUPERVISOR satisfies SUPERVISOR and STAFF, but NOT ORG_ADMIN', () => {
      expect(AuthorizationService.hasOrgRole(sampleMemberships, 'org-blr-bbmp', ['SUPERVISOR'])).toBe(true);
      expect(AuthorizationService.hasOrgRole(sampleMemberships, 'org-blr-bbmp', ['STAFF'])).toBe(true);
      // In org-blr-bbmp, highest rank in this fixture is SUPERVISOR
      expect(AuthorizationService.hasOrgRole(sampleMemberships, 'org-blr-bbmp', ['ORG_ADMIN'])).toBe(false);
    });
  });

  describe('Internal Note Segregation (Citizen Protection)', () => {
    const dummyComplaint = {
      citizen_id: 'user-citizen-1',
      organization_id: 'org-blr-bbmp',
    };

    it('CITIZEN_VISIBLE comments are visible to the complaint owner', () => {
      const canView = AuthorizationService.canViewComment(
        dummyUser,
        { visibility: 'CITIZEN_VISIBLE' },
        dummyComplaint,
        [] // No staff memberships
      );
      expect(canView).toBe(true);
    });

    it('INTERNAL_ONLY notes are STRICTLY FORBIDDEN to the citizen complaint owner', () => {
      const canView = AuthorizationService.canViewComment(
        dummyUser,
        { visibility: 'INTERNAL_ONLY' },
        dummyComplaint,
        [] // Citizen has no staff memberships
      );
      expect(canView).toBe(false);
    });

    it('INTERNAL_ONLY notes ARE visible to authorized staff in the same organization', () => {
      const staffUser = { id: 'user-staff-1', appMetadata: {}, userMetadata: {} };
      const canView = AuthorizationService.canViewComment(
        staffUser,
        { visibility: 'INTERNAL_ONLY' },
        dummyComplaint,
        sampleMemberships
      );
      expect(canView).toBe(true);
    });
  });

  describe('Complaint Assignment Management', () => {
    it('Supervisors and Org Admins can manage assignments', () => {
      expect(AuthorizationService.canManageAssignment(sampleMemberships, 'org-blr-bbmp')).toBe(true);
      expect(AuthorizationService.canManageAssignment(sampleMemberships, 'org-pun-pmc')).toBe(true);
    });

    it('Ordinary citizens cannot manage assignments', () => {
      expect(AuthorizationService.canManageAssignment([], 'org-blr-bbmp')).toBe(false);
    });
  });
});
