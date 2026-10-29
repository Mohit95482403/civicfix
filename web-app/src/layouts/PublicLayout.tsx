import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { ArrowRight, User, Shield } from 'lucide-react';

export function PublicLayout() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePortalRedirect = () => {
    if (!user) return;
    if (user.role === 'citizen') navigate('/citizen/dashboard');
    else if (user.role === 'staff' || user.role === 'department_supervisor') navigate('/staff/dashboard');
    else if (user.role === 'organization_admin') navigate('/admin/dashboard');
    else if (user.role === 'platform_admin') navigate('/platform-admin/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-canvas">
      {/* Top Navbar */}
      <header className="h-16 bg-surface border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 shadow-sm">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
            CF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-brandText-primary">CivicFix</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold bg-blue-50 text-primary-blue px-2 py-0.5 rounded-full border border-blue-200">
                Civic Platform
              </span>
            </div>
            <div className="text-[10px] text-brandText-secondary leading-tight hidden sm:block">
              Report It. Track It. Improve Your City.
            </div>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {isAuthenticated && user ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handlePortalRedirect}
              icon={<User size={15} />}
            >
              Go to {user.role === 'citizen' ? 'Citizen' : user.role === 'staff' ? 'Staff' : 'Admin'} Portal
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" icon={<ArrowRight size={14} />}>
                  Register as Citizen
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-slate-200 py-8 px-4 sm:px-8 text-xs text-brandText-secondary">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-primary-blue" />
            <span>CivicFix Platform — DPDP Act 2023 Compliant Civic Governance</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-primary-blue transition-colors">
              Staff & Official Login
            </Link>
            <span>•</span>
            <span className="text-brandText-tertiary">
              Municipal Emergency Desk: 1533
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
