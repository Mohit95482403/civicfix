import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { env, isSupabaseConfigured, isSupabaseAdminConfigured } from './env.js';
import { logger } from '../utils/logger.js';
import type { Database } from '../types/database.types.js';

let defaultClient: SupabaseClient<Database> | null = null;
let adminClient: SupabaseClient<Database> | null = null;

/**
 * Initializes the default Supabase client with the anonymous/publishable key.
 * Used for public reads and authenticating/verifying bearer tokens.
 */
export function getDefaultSupabaseClient(): SupabaseClient<Database> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Please supply SUPABASE_URL and SUPABASE_ANON_KEY in your environment.'
    );
  }

  if (!defaultClient) {
    defaultClient = createClient<Database>(
      env.SUPABASE_URL!,
      env.SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
  }

  return defaultClient;
}

/**
 * Creates an isolated, per-request Supabase client scoped to an authenticated user's JWT.
 * When executing database queries through this client, PostgreSQL Row Level Security (RLS)
 * evaluates auth.uid() automatically based on the bearer token.
 *
 * @param accessToken The verified Supabase access token from Authorization header
 */
export function createUserSupabaseClient(accessToken: string): SupabaseClient<Database> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }

  return createClient<Database>(
    env.SUPABASE_URL!,
    env.SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
}

/**
 * Returns the singleton privileged Supabase client with service-role permissions.
 * WARNING: This client bypasses Row Level Security.
 * Use strictly for elevated system background tasks, SLA monitors, and system audits.
 */
export function getAdminSupabaseClient(): SupabaseClient<Database> {
  if (!isSupabaseAdminConfigured()) {
    throw new Error(
      'Supabase Admin client requires SUPABASE_SERVICE_ROLE_KEY in environment.'
    );
  }

  if (!adminClient) {
    adminClient = createClient<Database>(
      env.SUPABASE_URL!,
      env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
  }

  return adminClient;
}

/**
 * Verifies an access token with Supabase Auth.
 * Genuine cryptographic verification is performed by Supabase Auth server.
 * Rejects unsigned, forged, or expired tokens.
 *
 * @param token Raw Bearer JWT token
 * @returns Verified Supabase User object or null if invalid
 */
export async function verifySupabaseToken(token: string): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    logger.warn('Token verification attempted but Supabase is not configured in environment.');
    return null;
  }

  try {
    const supabase = getDefaultSupabaseClient();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      logger.debug('Supabase token verification failed', {
        errorMessage: error?.message,
      });
      return null;
    }

    return data.user;
  } catch (err) {
    logger.error('Unexpected exception during Supabase token verification', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}
