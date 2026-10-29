import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import type { Express } from 'express';

describe('CivicFix End-to-End Multi-Role Workflow Integration Tests', () => {
  let app: Express;

  // Test tokens
  const mockCitizenToken = 'mock-citizen-token-12345';
  const mockStaffToken = 'mock-staff-token-67890';
  const mockAdminToken = 'mock-admin-token-99999';

  let createdComplaintId: string;
  let createdReferenceNumber: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    app = createApp();
  });

  describe('1. Security & Authentication Boundaries', () => {
    it('Public registration rejects role tampering attempts with HTTP 422', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'citizen_attacker@test.gov',
          password: 'Password123!',
          fullName: 'Attacker User',
          role: 'organization_admin', // Privilege escalation attempt
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('Complaints endpoints reject unauthenticated requests with HTTP 401', async () => {
      const res = await request(app).get('/api/v1/complaints/my');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('Admin console routes reject unauthenticated requests with HTTP 401', async () => {
      const res = await request(app).get('/api/v1/admin/stats');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('2. Citizen Complete Workflow', () => {
    it('GET /api/v1/complaints/categories returns active civic categories', async () => {
      const res = await request(app).get('/api/v1/complaints/categories');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].name).toBeDefined();
      expect(res.body.data[0].sla_hours).toBeDefined();
    });

    it('POST /api/v1/complaints creates a new civic complaint with valid reference number', async () => {
      const res = await request(app)
        .post('/api/v1/complaints')
        .set('Authorization', `Bearer ${mockCitizenToken}`)
        .send({
          title: 'Dangerous Deep Pothole on Outer Ring Road',
          description:
            'A very dangerous pothole has developed right on the road surface near the bus stop, posing a major hazard for two-wheelers.',
          categoryId: '20000000-0000-4000-a000-000000000001',
          latitude: 12.9562,
          longitude: 77.7011,
          addressText: 'Near Marathahalli Bridge, Outer Ring Road, Bengaluru',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.referenceNumber).toMatch(/^CF-\d{4}-BLR-\d{6}$/);
      expect(res.body.data.status).toBe('SUBMITTED');
      expect(res.body.data.priority).toBe('HIGH');

      createdComplaintId = res.body.data.id;
      createdReferenceNumber = res.body.data.referenceNumber;
    });

    it('GET /api/v1/complaints/my returns the citizen complaints list', async () => {
      const res = await request(app)
        .get('/api/v1/complaints/my')
        .set('Authorization', `Bearer ${mockCitizenToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);

      const found = res.body.data.find(
        (c: any) => c.id === createdComplaintId
      );
      expect(found).toBeDefined();
      expect(found.referenceNumber).toBe(createdReferenceNumber);
    });

    it('GET /api/v1/complaints/:id returns complete ticket detail and status history', async () => {
      const res = await request(app)
        .get(`/api/v1/complaints/${createdComplaintId}`)
        .set('Authorization', `Bearer ${mockCitizenToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.complaint.id).toBe(createdComplaintId);
      expect(Array.isArray(res.body.data.history)).toBe(true);
      expect(res.body.data.history[0].newStatus).toBe('SUBMITTED');
    });

    it('Citizen can post a public comment on their complaint', async () => {
      const res = await request(app)
        .post(`/api/v1/complaints/${createdComplaintId}/comments`)
        .set('Authorization', `Bearer ${mockCitizenToken}`)
        .send({
          body: 'Additional note: Pothole fills with water whenever it rains.',
          visibility: 'CITIZEN_VISIBLE',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.body).toContain('Pothole fills with water');
      expect(res.body.data.visibility).toBe('CITIZEN_VISIBLE');
    });

    it('Citizen is strictly forbidden from posting internal staff notes (403)', async () => {
      const res = await request(app)
        .post(`/api/v1/complaints/${createdComplaintId}/comments`)
        .set('Authorization', `Bearer ${mockCitizenToken}`)
        .send({
          body: 'Attempting to inject internal department dispatch note',
          visibility: 'INTERNAL_STAFF_ONLY',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('Citizen is forbidden from modifying ticket status to RESOLVED (403)', async () => {
      const res = await request(app)
        .patch(`/api/v1/complaints/${createdComplaintId}/status`)
        .set('Authorization', `Bearer ${mockCitizenToken}`)
        .send({
          status: 'RESOLVED',
          reason: 'Citizen claiming resolved without technician verification',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('3. Admin Triage & Management Workflow', () => {
    it('Admin can view organizational KPI statistics', async () => {
      const res = await request(app)
        .get('/api/v1/admin/stats')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalComplaints).toBeGreaterThan(0);
      expect(res.body.data.slaComplianceRate).toBeDefined();
    });

    it('Admin can view organization complaints queue', async () => {
      const res = await request(app)
        .get('/api/v1/admin/complaints')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('Admin can assign a complaint to a department technician', async () => {
      const res = await request(app)
        .post(`/api/v1/complaints/${createdComplaintId}/assign`)
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send({
          departmentId: '10000000-0000-4000-a000-000000000001',
          assignedTo: '00000000-0000-4000-a000-000000000003',
          notes: 'High priority pothole. Deploy rapid asphalt patching unit.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.departmentId).toBe('10000000-0000-4000-a000-000000000001');
      expect(res.body.data.assignedTo).toBe('00000000-0000-4000-a000-000000000003');
    });

    it('Admin can inspect DPDP security audit logs', async () => {
      const res = await request(app)
        .get('/api/v1/admin/audit-logs')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('4. Staff Field Work Orders Workflow', () => {
    it('Staff can list active assigned work orders', async () => {
      const res = await request(app)
        .get('/api/v1/complaints/assigned')
        .set('Authorization', `Bearer ${mockStaffToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('Staff can update work order status to IN_PROGRESS', async () => {
      const res = await request(app)
        .patch(`/api/v1/complaints/${createdComplaintId}/status`)
        .set('Authorization', `Bearer ${mockStaffToken}`)
        .send({
          status: 'IN_PROGRESS',
          reason: 'Technician on-site with road crew and asphalt compactor.',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('IN_PROGRESS');
    });

    it('Staff can submit resolution evidence proof and mark RESOLVED', async () => {
      // Step A: Submit resolution evidence
      const evRes = await request(app)
        .post(`/api/v1/complaints/${createdComplaintId}/evidence`)
        .set('Authorization', `Bearer ${mockStaffToken}`)
        .send({
          description:
            'Cleaned pothole cavity, applied bitumen tack coat, filled with 40mm aggregate and compacted.',
        });

      expect(evRes.status).toBe(201);
      expect(evRes.body.success).toBe(true);

      // Step B: Transition status to RESOLVED
      const statusRes = await request(app)
        .patch(`/api/v1/complaints/${createdComplaintId}/status`)
        .set('Authorization', `Bearer ${mockStaffToken}`)
        .send({
          status: 'RESOLVED',
          reason: 'Repair work completed and verified by road crew lead.',
        });

      expect(statusRes.status).toBe(200);
      expect(statusRes.body.success).toBe(true);
      expect(statusRes.body.data.status).toBe('RESOLVED');
      expect(statusRes.body.data.resolvedAt).toBeDefined();
    });
  });
});
