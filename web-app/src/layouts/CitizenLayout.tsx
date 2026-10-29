import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Home, Assignment, AddCircle, Notifications, Person, 
  Menu, Close, LogOut, ChevronRight
} from './nav-icons';

export function CitizenLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/citizen/dashboard', label: 'Home Dashboard', icon: Home },
    { path: '/citizen/complaints', label: 'My Reported Issues', icon: Assignment },
    { path: '/citizen/complaints/new', label: 'Report New Issue', icon: AddCircle },
    { path: '/citizen/notifications', label: 'Alerts & Updates', icon: Notifications },
    { path: '/citizen/profile', label: 'Profile & Settings', icon: Person },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'CZ';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-surface-canvas flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-brandText-secondary hover:text-brandText-primary rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <Close size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/citizen/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-teal-civic flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              CF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-brandText-primary">CivicFix</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  Citizen Portal
                </span>
              </div>
              <div className="text-[10px] text-brandText-secondary leading-tight hidden sm:block">
                Neighborhood Problem Reporting & Tracking
              </div>
            </div>
          </Link>
        </div>

        {/* User Identity & Logout */}
        <div className="flex items-center gap-3">
          <Link
            to="/citizen/profile"
            className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary-blue text-white flex items-center justify-center text-xs font-bold uppercase">
              {getInitials(user?.fullName)}
            </div>
            <div className="text-left text-xs hidden sm:block">
              <div className="font-semibold text-brandText-primary leading-tight">
                {user?.fullName || 'Citizen User'}
              </div>
              <div className="text-[10px] text-brandText-secondary">Verified Citizen</div>
            </div>
          </Link>

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
        {/* Sidebar for Desktop / Tablet */}
        <aside
          className={`fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-surface border-r border-slate-200 transition-transform duration-200 ease-in-out md:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 flex flex-col justify-between h-full">
            <nav className="space-y-1">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-brandText-tertiary">
                Citizen Services
              </div>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-primary-blue font-semibold'
                        : 'text-brandText-secondary hover:text-brandText-primary hover:bg-surface-hover'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={17} className={isActive ? 'text-primary' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight size={16} />}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Helpline Card */}
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
              <div className="font-semibold text-primary-blue mb-1">
                Ward Support Desk
              </div>
              <p className="text-[11px] text-brandText-secondary leading-relaxed">
                Emergency municipal control room hotline: <strong>1533</strong>. Available 24x7.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
