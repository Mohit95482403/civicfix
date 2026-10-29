import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, UserCheck, Wrench } from 'lucide-react';
import { UserRole } from '../../types/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if we came from a protected route
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const getDashboardForRole = (role: UserRole): string => {
    switch (role) {
      case 'citizen':
        return '/citizen/dashboard';
      case 'staff':
      case 'department_supervisor':
        return '/staff/dashboard';
      case 'organization_admin':
        return '/admin/dashboard';
      case 'platform_admin':
        return '/platform-admin/dashboard';
      default:
        return '/citizen/dashboard';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      const target = from || getDashboardForRole(user.role);
      navigate(target, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for quick demo fill in development
  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLocalError(null);
    clearError();
  };

  return (
    <div className="min-h-screen bg-surface-canvas flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-teal-civic flex items-center justify-center text-white font-bold text-xl shadow-md">
            CF
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-brandText">CivicFix</span>
        </Link>
        <h2 className="mt-5 text-center text-2xl font-bold tracking-tight text-brandText">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-brandText-muted">
          One unified access portal for Citizens, Municipal Staff, and City Administrators.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-border-light rounded-2xl sm:px-10">
          {(localError || authError) && (
            <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-sm text-rose-700 leading-snug">
                {localError || authError}
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              required
              prefixIcon={<Mail className="w-4 h-4 text-brandText-muted" />}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-brandText">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary hover:text-primary-dark transition"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                autoComplete="current-password"
                required
                prefixIcon={<Lock className="w-4 h-4 text-brandText-muted" />}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Sign In <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick-fill helper for development verification */}
          <div className="mt-6 pt-5 border-t border-border-light">
            <p className="text-xs font-semibold text-brandText-muted mb-2 text-center">
              Quick Fill Demo Accounts (Local Dev):
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('citizen@civicfix.local', 'Password123!')}
                className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                Citizen
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('staff@civicfix.local', 'Password123!')}
                className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition"
              >
                <Wrench className="w-3.5 h-3.5 text-amber-600" />
                Staff
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@civicfix.local', 'Password123!')}
                className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                Admin
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-brandText-muted">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary hover:text-primary-dark">
                Register as a Citizen
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
