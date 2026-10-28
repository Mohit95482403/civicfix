import { describe, it, expect } from 'vitest';
import { registerBodySchema, loginBodySchema } from '../../src/validators/auth.validators.js';
import { uuidParamSchema, paginationQuerySchema } from '../../src/validators/common.validators.js';

describe('Zod Request Validation Schemas', () => {
  describe('registerBodySchema', () => {
    it('validates a complete valid registration payload', () => {
      const validPayload = {
        email: 'citizen.test@example.com',
        password: 'SecurePassword123!',
        fullName: 'Aarav Sharma',
        phoneNumber: '+919876543210',
        preferredLanguage: 'en',
      };

      const result = registerBodySchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('citizen.test@example.com');
        expect(result.data.fullName).toBe('Aarav Sharma');
      }
    });

    it('rejects an invalid email format', () => {
      const invalidPayload = {
        email: 'not-an-email',
        password: 'ValidPassword123!',
        fullName: 'Aarav Sharma',
      };

      const result = registerBodySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('rejects passwords shorter than 8 characters', () => {
      const invalidPayload = {
        email: 'test@example.com',
        password: 'short',
        fullName: 'Aarav Sharma',
      };

      const result = registerBodySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('rejects unsupported preferred languages', () => {
      const invalidPayload = {
        email: 'test@example.com',
        password: 'ValidPassword123!',
        fullName: 'Aarav Sharma',
        preferredLanguage: 'de', // not in allowed en, kn, hi, mr, ta, te
      };

      const result = registerBodySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('loginBodySchema', () => {
    it('validates valid credentials', () => {
      const validPayload = {
        email: 'staff@example.com',
        password: 'somepassword',
      };

      const result = loginBodySchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('rejects empty password', () => {
      const invalidPayload = {
        email: 'staff@example.com',
        password: '',
      };

      const result = loginBodySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('uuidParamSchema', () => {
    const schema = uuidParamSchema('complaintId');

    it('accepts valid UUID v4', () => {
      const result = schema.safeParse({ complaintId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' });
      expect(result.success).toBe(true);
    });

    it('rejects non-UUID strings', () => {
      const result = schema.safeParse({ complaintId: '12345-not-a-uuid' });
      expect(result.success).toBe(false);
    });
  });

  describe('paginationQuerySchema', () => {
    it('applies default page and limit values', () => {
      const result = paginationQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
      }
    });

    it('rejects limit exceeding 100', () => {
      const result = paginationQuerySchema.safeParse({ limit: '150' });
      expect(result.success).toBe(false);
    });
  });
});
