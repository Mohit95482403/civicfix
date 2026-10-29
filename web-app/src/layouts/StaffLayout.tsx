import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Wrench, CheckCircle2, Menu, Close, 
  LogOut, HardHat, FileText 
} from './nav-icons';

export function StaffLayout() {
  const { user, memberships, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/staff/dashboard', label: 'Assigned Work Orders', icon: Wrench },
    { path: '/staff/complaints', label: 'Department Queue', icon: FileText },
    { path: '/staff/assigned-complaints', label: 'My Active Tasks', icon: HardHat },
    { path: '/staff/profile', label: 'Technician Profile', icon: CheckCircle2 },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'ST';
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
          
          <Link to="/staff/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
              CF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-brandText-primary">CivicFix</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                  Staff Portal
                </span>
              </div>
              <div className="text-[11px] text-brandText-secondary leading-tight hidden sm:block">
                Field Operations & Work Order Resolution
              </div>
            </div>
          </Link>
        </div>

        {/* User Identity & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <div className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold uppercase">
              {getInitials(user?.fullName)}
            </div>
            <div className="text-left text-xs">
              <div className="font-semibold text-brandText-primary">
                {user?.fullName || 'Field Technician'}
              </div>
              <div className="text-[10px] text-brandText-secondary capitalize">
                {memberships[0]?.departmentName || user?.role?.replace('_', ' ') || 'Roads & Infrastructure'}
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
                Field Operations
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
                        ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200/60'
                        : 'text-brandText-secondary hover:text-brandText-primary hover:bg-surface-hover'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Status Card */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-brandText-primary mb-1">
                <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
                <span>On-Duty Shift Active</span>
              </div>
              <p className="text-[11px] text-brandText-secondary">
                Shift: 08:00 – 17:00 • Unit #BLR-NORTH-4
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
