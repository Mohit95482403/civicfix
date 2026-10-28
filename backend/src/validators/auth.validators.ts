import { z } from 'zod';

/**
 * Validation schema for citizen registration request.
 */
export const registerBodySchema = z.object({
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
});

export type RegisterBody = z.infer<typeof registerBodySchema>;

/**
 * Validation schema for user login request.
 */
export const loginBodySchema = z.object({
  email: z
    .string({ required_error: 'Email address is required.' })
    .email({ message: 'Must be a valid email address.' })
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string({ required_error: 'Password is required.' })
    .min(1, { message: 'Password cannot be empty.' }),
});

export type LoginBody = z.infer<typeof loginBodySchema>;
