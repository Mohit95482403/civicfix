import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import type { Express } from 'express';

describe('CivicFix API Gateway Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    app = createApp();
  });

  describe('Health and Diagnostic Endpoints', () => {
    it('GET /api/health returns HTTP 200 and healthy status payload', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.service).toBe('civicfix-api');
      expect(response.body.data.status).toBe('healthy');
      expect(response.body.requestId).toBeDefined();
      expect(response.body.timestamp).toBeDefined();
    });

    it('GET /api/health/ready returns diagnostic payload', async () => {
      const response = await request(app).get('/api/health/ready');

      expect([200, 503]).toContain(response.status);
      expect(response.body.requestId).toBeDefined();
    });
  });

  describe('Routing & Error Handling', () => {
    it('returns standardized HTTP 404 for nonexistent routes', async () => {
      const response = await request(app).get('/api/v1/non-existent-endpoint');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ROUTE_NOT_FOUND');
      expect(response.body.requestId).toBeDefined();
      expect(response.body.timestamp).toBeDefined();
    });

    it('preserves client-provided X-Request-Id in response header and body', async () => {
      const customId = 'client-trace-12345';
      const response = await request(app)
        .get('/api/health')
        .set('X-Request-Id', customId);

      expect(response.headers['x-request-id']).toBe(customId);
      expect(response.body.requestId).toBe(customId);
    });
  });

  describe('Authentication Boundary Security', () => {
    it('GET /api/v1/auth/me rejects request without Authorization header (401)', async () => {
      const response = await request(app).get('/api/v1/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
      expect(response.body.error.message).toContain('Missing or malformed Authorization header');
    });

    it('GET /api/v1/auth/me rejects invalid or forged Bearer token (401)', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid.fake.token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('REJECTS client-supplied body claims (cannot spoof identity via body)', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .send({ userId: '00000000-0000-0000-0000-000000000001', role: 'PLATFORM_ADMIN' });

      // Must remain 401 Unauthorized; body cannot inject credentials
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Request Validation Pipeline', () => {
    it('POST /api/v1/auth/register rejects invalid email and short password with 422', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'not-an-email',
          password: '123',
          fullName: '',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(Array.isArray(response.body.error.details)).toBe(true);
      expect(response.body.error.details.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/auth/login rejects empty payload with 422', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({});

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Organizational Authorization Boundaries', () => {
    it('GET /api/v1/organizations/:orgId/verify-access rejects unauthenticated request with 401', async () => {
      const response = await request(app).get('/api/v1/organizations/00000000-0000-0000-0000-000000000001/verify-access');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('GET /api/v1/admin/verify-platform-access rejects unauthenticated request with 401', async () => {
      const response = await request(app).get('/api/v1/admin/verify-platform-access');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
