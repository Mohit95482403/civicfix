import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-canvas flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-xs text-brandText-secondary font-medium">
          Verifying security credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = ['staff', 'department_supervisor', 'organization_admin', 'platform_admin'];
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-surface-canvas flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface border border-red-200 rounded-xl p-6 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-lg font-bold text-brandText-primary mb-1">
            Access Unauthorized
          </h2>
          <p className="text-xs text-brandText-secondary mb-6 leading-relaxed">
            Your authenticated profile is registered as <strong className="capitalize">{user.role}</strong>. 
            The Staff Portal requires municipal technician or supervisor authorization.
          </p>
          <button
            onClick={() => logout()}
            className="w-full py-2 px-4 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Sign Out & Switch Account
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
