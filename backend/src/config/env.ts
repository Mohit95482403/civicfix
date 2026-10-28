import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file if available
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val < 65536, {
      message: 'PORT must be a valid port number between 1 and 65535',
    }),
  FRONTEND_ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000')
    .transform((val) => val.split(',').map((origin) => origin.trim())),
  
  // Supabase Configuration
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SECRET_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Security & Rate Limiting
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .default('60000')
    .transform((val) => parseInt(val, 10)),
  RATE_LIMIT_MAX: z
    .string()
    .default('100')
    .transform((val) => parseInt(val, 10)),
  AUTH_RATE_LIMIT_MAX: z
    .string()
    .default('10')
    .transform((val) => parseInt(val, 10)),

  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables configuration:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

// Normalize Supabase key access (support both PUBLISHABLE/ANON and SECRET/SERVICE_ROLE naming)
const rawData = parsed.data;
const supabaseAnonKey = rawData.SUPABASE_PUBLISHABLE_KEY || rawData.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = rawData.SUPABASE_SECRET_KEY || rawData.SUPABASE_SERVICE_ROLE_KEY;

export const env = {
  ...rawData,
  SUPABASE_ANON_KEY: supabaseAnonKey,
  SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKey,
};

/**
 * Checks whether Supabase connection parameters are provided.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
}

/**
 * Checks whether Supabase admin service-role key is provided.
 */
export function isSupabaseAdminConfigured(): boolean {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Safe sanitization utility to inspect active configuration in logs without leaking credentials.
 */
export function getSanitizedEnv(): Record<string, unknown> {
  return {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
    FRONTEND_ALLOWED_ORIGINS: env.FRONTEND_ALLOWED_ORIGINS,
    SUPABASE_URL: env.SUPABASE_URL ? 'CONFIGURED' : 'NOT_CONFIGURED',
    SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY ? '[REDACTED]' : 'NOT_CONFIGURED',
    SUPABASE_SERVICE_ROLE_KEY: env.SUPABASE_SERVICE_ROLE_KEY ? '[REDACTED]' : 'NOT_CONFIGURED',
    LOG_LEVEL: env.LOG_LEVEL,
    RATE_LIMIT_WINDOW_MS: env.RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX: env.RATE_LIMIT_MAX,
    AUTH_RATE_LIMIT_MAX: env.AUTH_RATE_LIMIT_MAX,
  };
}
