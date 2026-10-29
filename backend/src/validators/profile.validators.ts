import { z } from 'zod';

/**
 * Validation schema for updating user profile.
 * Strictly prevents self-assignment of roles, emails, memberships, or account states.
 */
export const updateProfileBodySchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: 'Full name must be at least 2 characters.' })
      .max(120, { message: 'Full name cannot exceed 120 characters.' })
      .transform((val) => val.trim())
      .optional(),
    phoneNumber: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, {
        message: 'Phone number must be a valid E.164 format (e.g. +919876543210).',
      })
      .nullable()
      .optional(),
    avatarPath: z
      .string()
      .max(500, { message: 'Avatar path cannot exceed 500 characters.' })
      .nullable()
      .optional(),
    preferredLanguage: z
      .enum(['en', 'kn', 'hi', 'mr', 'ta', 'te'], {
        errorMap: () => ({ message: 'Language must be one of: en, kn, hi, mr, ta, te.' }),
      })
      .optional(),
    // Strictly forbid tampering with protected fields
    role: z.undefined({
      invalid_type_error: 'Role cannot be modified by user. Role assignments require administrative provisioning.',
    }),
    email: z.undefined({
      invalid_type_error: 'Email cannot be modified directly via profile update.',
    }),
    id: z.undefined({
      invalid_type_error: 'Profile ID cannot be modified.',
    }),
    is_active: z.undefined({
      invalid_type_error: 'Active status cannot be modified by user.',
    }),
    isActive: z.undefined({
      invalid_type_error: 'Active status cannot be modified by user.',
    }),
    memberships: z.undefined({
      invalid_type_error: 'Memberships cannot be modified by user.',
    }),
  })
  .strict();

export type UpdateProfileBody = z.infer<typeof updateProfileBodySchema>;
