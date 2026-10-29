import { z } from 'zod';

/**
 * Validation schema for citizen registration request.
 * Enforces strict citizen role only; rejects arbitrary role injection.
 */
export const registerBodySchema = z
  .object({
    email: z
      .string({ required_error: 'Email address is required.' })
      .email({ message: 'Must be a valid email address.' })
      .max(255, { message: 'Email address cannot exceed 255 characters.' })
      .transform((val) => val.trim().toLowerCase()),
    password: z
      .string({ required_error: 'Password is required.' })
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(100, { message: 'Password cannot exceed 100 characters.' }),
    fullName: z
      .string({ required_error: 'Full name is required.' })
      .min(2, { message: 'Full name must be at least 2 characters.' })
      .max(120, { message: 'Full name cannot exceed 120 characters.' })
      .transform((val) => val.trim()),
    phoneNumber: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, {
        message: 'Phone number must be a valid E.164 format (e.g. +919876543210).',
      })
      .optional(),
    preferredLanguage: z
      .enum(['en', 'kn', 'hi', 'mr', 'ta', 'te'], {
        errorMap: () => ({ message: 'Language must be one of: en, kn, hi, mr, ta, te.' }),
      })
      .default('en'),
    // Anti-escalation: If client attempts to inject role or permissions, reject immediately
    role: z.undefined({
      invalid_type_error: 'Role cannot be specified during public registration. Public accounts are created as citizens.',
    }),
    userId: z.undefined({
      invalid_type_error: 'User ID cannot be specified by the client.',
    }),
  })
  .strict();

export type RegisterBody = z.infer<typeof registerBodySchema>;

/**
 * Validation schema for user login request.
 */
export const loginBodySchema = z
  .object({
    email: z
      .string({ required_error: 'Email address is required.' })
      .email({ message: 'Must be a valid email address.' })
      .transform((val) => val.trim().toLowerCase()),
    password: z
      .string({ required_error: 'Password is required.' })
      .min(1, { message: 'Password cannot be empty.' }),
  })
  .strict();

export type LoginBody = z.infer<typeof loginBodySchema>;

/**
 * Validation schema for forgot password request.
 */
export const forgotPasswordBodySchema = z
  .object({
    email: z
      .string({ required_error: 'Email address is required.' })
      .email({ message: 'Must be a valid email address.' })
      .transform((val) => val.trim().toLowerCase()),
    redirectTo: z.string().url().optional(),
  })
  .strict();

export type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema>;

/**
 * Validation schema for reset password completion.
 */
export const resetPasswordBodySchema = z
  .object({
    newPassword: z
      .string({ required_error: 'New password is required.' })
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(100, { message: 'Password cannot exceed 100 characters.' }),
  })
  .strict();

export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>;

/**
 * Validation schema for token refresh request.
 */
export const refreshTokenBodySchema = z
  .object({
    refreshToken: z
      .string({ required_error: 'Refresh token is required.' })
      .min(10, { message: 'Refresh token must be valid.' }),
  })
  .strict();

export type RefreshTokenBody = z.infer<typeof refreshTokenBodySchema>;
