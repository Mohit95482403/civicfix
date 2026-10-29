import { describe, it, expect } from 'vitest';
import { updateProfileBodySchema } from '../../src/validators/profile.validators.js';
import {
  forgotPasswordBodySchema,
  resetPasswordBodySchema,
  refreshTokenBodySchema,
} from '../../src/validators/auth.validators.js';

describe('Day 6 Profile & Auth Validation Schemas', () => {
  describe('updateProfileBodySchema (Anti-Privilege Escalation)', () => {
    it('accepts permitted self-service fields', () => {
      const validPayload = {
        fullName: 'Rahul Patil Updated',
        phoneNumber: '+919876543210',
        avatarPath: '/avatars/rahul.png',
        preferredLanguage: 'kn',
      };

      const result = updateProfileBodySchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fullName).toBe('Rahul Patil Updated');
        expect(result.data.preferredLanguage).toBe('kn');
      }
    });

    it('STRICTLY REJECTS attempts to self-assign role', () => {
      const hostilePayload = {
        fullName: 'Rahul Patil',
        role: 'platform_admin',
      };

      const result = updateProfileBodySchema.safeParse(hostilePayload);
      expect(result.success).toBe(false);
    });

    it('STRICTLY REJECTS attempts to modify email through profile update', () => {
      const hostilePayload = {
        email: 'newemail@example.com',
      };

      const result = updateProfileBodySchema.safeParse(hostilePayload);
      expect(result.success).toBe(false);
    });

    it('STRICTLY REJECTS attempts to tamper with account active status', () => {
      const hostilePayload = {
        isActive: true,
        is_active: true,
      };

      const result = updateProfileBodySchema.safeParse(hostilePayload);
      expect(result.success).toBe(false);
    });

    it('STRICTLY REJECTS attempts to inject staff memberships', () => {
      const hostilePayload = {
        memberships: [{ role: 'ORG_ADMIN' }],
      };

      const result = updateProfileBodySchema.safeParse(hostilePayload);
      expect(result.success).toBe(false);
    });
  });

  describe('forgotPasswordBodySchema', () => {
    it('validates a correct email address', () => {
      const result = forgotPasswordBodySchema.safeParse({ email: 'user@example.com' });
      expect(result.success).toBe(true);
    });

    it('rejects an invalid email address', () => {
      const result = forgotPasswordBodySchema.safeParse({ email: 'invalid-email' });
      expect(result.success).toBe(false);
    });
  });

  describe('resetPasswordBodySchema', () => {
    it('accepts a password with 8 or more characters', () => {
      const result = resetPasswordBodySchema.safeParse({ newPassword: 'StrongPassword123!' });
      expect(result.success).toBe(true);
    });

    it('rejects a short password with less than 8 characters', () => {
      const result = resetPasswordBodySchema.safeParse({ newPassword: 'short' });
      expect(result.success).toBe(false);
    });
  });

  describe('refreshTokenBodySchema', () => {
    it('accepts a valid refresh token string', () => {
      const result = refreshTokenBodySchema.safeParse({ refreshToken: 'valid-refresh-token-12345' });
      expect(result.success).toBe(true);
    });

    it('rejects missing or short refresh token', () => {
      const result = refreshTokenBodySchema.safeParse({ refreshToken: 'short' });
      expect(result.success).toBe(false);
    });
  });
});
