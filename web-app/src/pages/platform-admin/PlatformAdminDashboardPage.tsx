import React from 'react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Building2, Server, Users, Database } from 'lucide-react';

export const PlatformAdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
          Platform Super-Admin Scope
        </span>
        <h1 className="text-2xl font-bold tracking-tight mt-2">
          CivicFix Multi-Tenant Platform Console
        </h1>
        <p className="text-sm text-white/80 mt-1">
          Global tenant administration, multi-organization isolation health, and system infrastructure monitoring.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Active Municipal Tenants"
          value="4"
          icon={Building2}
          iconColor="text-primary"
          iconBgColor="bg-primary-50"
          subtitle="BBMP, GHMC, BMC, MCD"
        />
        <StatCard
          title="Total Registered Citizens"
          value="18,420"
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          subtitle="Across all jurisdictions"
        />
        <StatCard
          title="Supabase Database Health"
          value="Optimal"
          icon={Database}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
          subtitle="PostgreSQL 16 RLS enforced"
        />
        <StatCard
          title="Platform Uptime"
          value="99.98%"
          icon={Server}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          subtitle="Express + Vite clusters"
        />
      </div>

      <Card title="Connected Municipal Organizations">
        <div className="space-y-3">
          {[
            { name: 'Bruhat Bengaluru Mahanagara Palike', code: 'BBMP', state: 'Karnataka', status: 'Healthy', orgAdmins: 3 },
            { name: 'Greater Hyderabad Municipal Corporation', code: 'GHMC', state: 'Telangana', status: 'Healthy', orgAdmins: 2 },
            { name: 'Brihanmumbai Municipal Corporation', code: 'BMC', state: 'Maharashtra', status: 'Healthy', orgAdmins: 4 },
            { name: 'Municipal Corporation of Delhi', code: 'MCD', state: 'Delhi NCT', status: 'Healthy', orgAdmins: 3 },
          ].map((org, i) => (
            <div key={i} className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-brandText block text-sm">{org.name}</span>
                <span className="text-brandText-muted">Code: {org.code} • Region: {org.state}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-emerald-600 block">{org.status}</span>
                <span className="text-[11px] text-brandText-muted">{org.orgAdmins} Authorized Admins</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
