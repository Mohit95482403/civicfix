import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Shield, Building2, Wrench, CheckCircle2, LogOut } from 'lucide-react';

export const StaffProfilePage: React.FC = () => {
  const { user, memberships, logout } = useAuth();

  const primaryMembership = memberships[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brandText">Staff Profile & Credentials</h1>
        <p className="text-sm text-brandText-muted mt-1">
          Municipal field personnel verification and operational credentials.
        </p>
      </div>

      <Card title="Technician Details">
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-border-light">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xl border border-amber-500/20">
              {user?.fullName?.charAt(0) || 'S'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-brandText">{user?.fullName || 'Field Technician'}</h2>
              <p className="text-xs text-brandText-muted">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="blue" className="text-xs capitalize py-0.5 px-2">
                  <Shield className="w-3 h-3 mr-1" /> {user?.role?.replace('_', ' ')}
                </Badge>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Shift Active
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-semibold text-brandText-muted uppercase tracking-wider block mb-1">
                Authorized Municipality
              </span>
              <p className="font-bold text-brandText text-sm flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-primary" />
                {primaryMembership?.organization?.name || primaryMembership?.organizationName || 'Bruhat Bengaluru Mahanagara Palike (BBMP)'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-semibold text-brandText-muted uppercase tracking-wider block mb-1">
                Operational Department
              </span>
              <p className="font-bold text-brandText text-sm flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-primary" />
                Roads & Stormwater Infrastructure
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="p-4 bg-rose-50/60 border border-rose-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-rose-900">End Shift / Sign Out</h4>
          <p className="text-xs text-rose-700 mt-0.5">
            Clock out and terminate field session.
          </p>
        </div>
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={logout}
          className="shrink-0"
        >
          <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
        </Button>
      </div>
    </div>
  );
};
