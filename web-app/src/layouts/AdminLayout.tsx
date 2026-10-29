import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Building2, Users, AlertTriangle, Layers, Clock, 
  History, Menu, Close, LogOut, Shield, FileText 
} from './nav-icons';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', label: 'Executive Dashboard', icon: Layers },
    { path: '/admin/complaints', label: 'Triage & Work Orders', icon: AlertTriangle },
    { path: '/admin/departments', label: 'Departments & SLA', icon: Building2 },
    { path: '/admin/staff', label: 'Staff Management', icon: Users },
    { path: '/admin/categories', label: 'Complaint Categories', icon: FileText },
    { path: '/admin/reports', label: 'Analytics & Reports', icon: Clock },
    { path: '/admin/audit-logs', label: 'DPDP Audit Trail', icon: History },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'AD';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-canvas">
      {/* Top Navbar */}
      <header className="h-16 bg-surface border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 rounded-md text-brandText-secondary hover:bg-surface-hover"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <Close size={20} /> : <Menu size={20} />}
          </button>
          
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
              CF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-brandText-primary">CivicFix</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  Admin Console
                </span>
              </div>
              <div className="text-[11px] text-brandText-secondary leading-tight hidden sm:block">
                City Municipal Corporation Governance Console
              </div>
            </div>
          </Link>
        </div>

        {/* Admin Profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold uppercase">
              {getInitials(user?.fullName)}
            </div>
            <div className="text-left text-xs">
              <div className="font-semibold text-brandText-primary">
                {user?.fullName || 'City Administrator'}
              </div>
              <div className="text-[10px] text-brandText-secondary capitalize">
                {user?.role?.replace('_', ' ') || 'Municipal Governance'}
              </div>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="p-2 text-brandText-secondary hover:text-semantic-error rounded-full hover:bg-red-50 transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-surface border-r border-slate-200 transition-transform duration-200 ease-in-out md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 flex flex-col justify-between h-full">
            <nav className="space-y-1">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-brandText-tertiary">
                Municipal Governance
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-primary-blue font-semibold border border-blue-200/60'
                        : 'text-brandText-secondary hover:text-brandText-primary hover:bg-surface-hover'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Jurisdiction Card */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-brandText-primary mb-1">
                <Shield size={14} className="text-primary-blue" />
                <span>Zone: Bengaluru Central</span>
              </div>
              <p className="text-[11px] text-brandText-secondary">
                Wards: 112 – 148 • 5 Active Departments
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
