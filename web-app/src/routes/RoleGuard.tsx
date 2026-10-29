import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/auth';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  if (!allowedRoles.includes(user.role)) {
    // Provide appropriate fallback destination
    let fallbackPath = '/';
    if (user.role === 'citizen') fallbackPath = '/citizen/dashboard';
    else if (user.role === 'staff' || user.role === 'department_supervisor') fallbackPath = '/staff/dashboard';
    else if (user.role === 'organization_admin') fallbackPath = '/admin/dashboard';
    else if (user.role === 'platform_admin') fallbackPath = '/platform-admin/dashboard';

    return (
      <div className="min-h-screen bg-surface-canvas flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface border border-red-200 rounded-2xl p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 text-semantic-error flex items-center justify-center mx-auto mb-5">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-bold text-brandText-primary mb-2">
            Access Unauthorized
          </h2>
          <p className="text-sm text-brandText-secondary mb-6 leading-relaxed">
            Your authenticated identity is registered as{' '}
            <strong className="text-brandText-primary capitalize">{user.role.replace('_', ' ')}</strong>.
            This area requires one of the following permissions:{' '}
            <span className="font-semibold text-slate-800">
              {allowedRoles.map((r) => r.replace('_', ' ')).join(', ')}
            </span>.
          </p>
          <div className="space-y-3">
            <Link to={fallbackPath} className="block w-full">
              <Button variant="primary" fullWidth icon={<ArrowLeft size={16} />}>
                Go to My Authorized Portal
              </Button>
            </Link>
            <Button variant="outline" fullWidth onClick={() => logout()}>
              Sign Out & Switch Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
