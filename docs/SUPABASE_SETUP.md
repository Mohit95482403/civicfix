# CivicFix Supabase Setup & Configuration Guide

**Document Version:** 1.0.0  
**Phase:** Day 6 — Complete Authentication, Registration, Login, Profiles & Session Management  
**Status:** Approved Reference  

---

## 1. Supabase Dashboard Configuration

To enable complete authentication and email verification for CivicFix, configure the following settings in your Supabase Project Dashboard:

### A. Email Authentication & Verification
1. Navigate to: **Authentication** > **Providers** > **Email**.
2. **Enable Email Provider:** Set to `ON`.
3. **Confirm Email:**
   - For **Production:** Set to `ON` (Citizens must click the email verification link before their session is considered verified).
   - For **Local Development/Testing:** You may temporarily toggle to `OFF` if testing without an external SMTP server.
4. **Secure Password Minimum Length:** Set to at least `8` characters.

### B. Redirect URLs & Deep Linking
1. Navigate to: **Authentication** > **URL Configuration**.
2. **Site URL:** Set to your primary frontend application URL:
   - Development: `http://localhost:5173`
   - Production: `https://app.civicfix.in`
3. **Additional Redirect URLs:** Add the callback endpoints for password recovery and email confirmations:
   - Citizen Web / Mobile Deep Links: `civicfix://auth/callback`
   - Staff Portal: `http://localhost:5173/auth/callback`
   - Admin Portal: `http://localhost:5174/auth/callback`
   - Password Recovery: `http://localhost:5173/reset-password`

### C. Custom SMTP Configuration
By default, Supabase sends up to 30 emails per hour on the free tier. For production or staging:
1. Navigate to: **Project Settings** > **Authentication** > **SMTP Settings**.
2. Configure your custom transactional SMTP provider (e.g., AWS SES, SendGrid, Resend, or Brevo).

---

## 2. Environment Variables Specification

The CivicFix backend requires the following configuration in `backend/.env`:

```env
# Server Port & Environment
PORT=5000
NODE_ENV=development

# Supabase Auth & Database Keys
# Publicly safe project URL
SUPABASE_URL=https://your-project-id.supabase.co

# Client-facing anonymous/publishable key
SUPABASE_PUBLISHABLE_KEY=sbp_xxxxxxxxxxxxxxxxxxxx

# Server-Only Privileged Service Role Key (NEVER commit to version control or bundle in frontend)
SUPABASE_SERVICE_ROLE_KEY=eyJh...service-role-secret...

# Allowed Frontend Origins (CORS protection)
FRONTEND_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:5175
```

> [!CAUTION]
> The `SUPABASE_SERVICE_ROLE_KEY` bypasses all Row Level Security (RLS) policies. It must **only** be placed in server-side environment variables and never exposed to the Flutter mobile app or React frontend bundles.

---

## 3. Database Triggers & Profile Synchronization

When a user registers via Supabase Auth (`auth.users`), the PostgreSQL database trigger automatically synchronizes their profile in `public.profiles`:

```sql
-- Trigger Definition from Day 4 Migration 20261028000001_core_schema.sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone_number,
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone',
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Self-Healing Profile Recovery Fallback
If for any reason the trigger is delayed or was not executed prior to the user's initial login, the CivicFix backend service (`ProfileService.getProfile`) automatically initiates self-healing fallback:
1. Validates that the user's identity exists in `auth.users`.
2. Automatically inserts the corresponding `public.profiles` record using the verified auth metadata.
3. Sets default role to `citizen` and ensures the user is immediately able to interact with the platform.
