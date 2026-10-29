import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import type { Express } from 'express';

describe('Day 6 Authentication & Profile API Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    app = createApp();
  });

  describe('Unversioned /api/auth and Versioned /api/v1/auth Routes Parity', () => {
    it('POST /api/auth/register rejects role injection attempt with HTTP 422', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'hacker@example.com',
          password: 'Password123!',
          fullName: 'Malicious User',
          role: 'platform_admin', // Unauthorized role injection
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('POST /api/v1/auth/register rejects role injection attempt with HTTP 422', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'hacker2@example.com',
          password: 'Password123!',
          fullName: 'Malicious User 2',
          role: 'staff', // Unauthorized role injection
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('POST /api/auth/login rejects empty payload with HTTP 422', async () => {
      const response = await request(app).post('/api/auth/login').send({});

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('GET /api/auth/me rejects unauthenticated request with HTTP 401', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('POST /api/auth/logout rejects unauthenticated request with HTTP 401', async () => {
      const response = await request(app).post('/api/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('Password Recovery & Session Refresh Endpoints', () => {
    it('POST /api/auth/forgot-password validates email format (422 on invalid)', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'not-an-email' });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('POST /api/auth/reset-password rejects unauthenticated request (401)', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ newPassword: 'NewPassword123!' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('POST /api/auth/refresh rejects missing refreshToken with HTTP 422', async () => {
      const response = await request(app).post('/api/auth/refresh').send({});

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Profile Management Endpoints (/api/profile & /api/v1/profile)', () => {
    it('GET /api/profile rejects unauthenticated request with HTTP 401', async () => {
      const response = await request(app).get('/api/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('GET /api/v1/profile rejects unauthenticated request with HTTP 401', async () => {
      const response = await request(app).get('/api/v1/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('PATCH /api/profile rejects unauthenticated request with HTTP 401', async () => {
      const response = await request(app)
        .patch('/api/profile')
        .send({ fullName: 'Updated Name' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('PATCH /api/profile rejects role tampering attempts with HTTP 422', async () => {
      const response = await request(app)
        .patch('/api/profile')
        .send({ fullName: 'Updated Name', role: 'organization_admin' });

      // Schema validator rejects role before reaching auth middleware
      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Administrative Staff Provisioning', () => {
    it('POST /api/v1/organizations/:orgId/staff/provision rejects unauthenticated request with HTTP 401', async () => {
      const response = await request(app)
        .post('/api/v1/organizations/00000000-0000-0000-0000-000000000001/staff/provision')
        .send({
          email: 'technician@bbmp.gov.in',
          fullName: 'New Technician',
          role: 'STAFF',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
