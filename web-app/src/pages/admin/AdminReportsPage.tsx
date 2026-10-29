import React from 'react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brandText">Reports & SLA Analytics</h1>
        <p className="text-sm text-brandText-muted mt-1">
          Detailed metrics on resolution velocity, department turnaround compliance, and citizen feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Overall SLA Adherence"
          value="96.2%"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
          subtitle="Tickets resolved within target hours"
        />
        <StatCard
          title="Avg Turnaround Time"
          value="28.4 hrs"
          icon={Clock}
          iconColor="text-primary"
          iconBgColor="bg-primary-50"
          subtitle="From citizen submission to field closure"
        />
        <StatCard
          title="Reopened Rate"
          value="1.8%"
          icon={TrendingUp}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          subtitle="Citizen appeals post-resolution"
        />
      </div>

      <Card title="Monthly Resolution Performance">
        <div className="space-y-4">
          {[
            { month: 'October 2026', total: 184, onTime: 178, rate: '96.7%' },
            { month: 'September 2026', total: 162, onTime: 154, rate: '95.1%' },
            { month: 'August 2026', total: 145, onTime: 139, rate: '95.8%' },
            { month: 'July 2026', total: 138, onTime: 131, rate: '94.9%' },
          ].map((row, i) => (
            <div key={i} className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-brandText block text-sm">{row.month}</span>
                <span className="text-brandText-muted">{row.total} tickets logged • {row.onTime} closed within SLA</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-600 text-sm">{row.rate}</span>
                <span className="text-[11px] text-brandText-muted block">SLA Compliance</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
