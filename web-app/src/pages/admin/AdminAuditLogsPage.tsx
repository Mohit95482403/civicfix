import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { formatDate } from '../../utils/formatters';

interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}

const mockLogs: AuditLog[] = [
  {
    id: 'log-1',
    actor: 'admin@civicfix.local',
    action: 'DISPATCH_WORK_ORDER',
    target: 'Ticket CF-2026-00042 assigned to Roads Crew #1',
    timestamp: '2026-10-29T13:45:00Z',
    ipAddress: '10.0.4.12',
  },
  {
    id: 'log-2',
    actor: 'admin@civicfix.local',
    action: 'PROVISION_STAFF',
    target: 'Provisioned staff account ramesh.kumar@bbmp.gov.in',
    timestamp: '2026-10-29T12:30:00Z',
    ipAddress: '10.0.4.12',
  },
  {
    id: 'log-3',
    actor: 'staff@civicfix.local',
    action: 'STATUS_TRANSITION',
    target: 'Ticket CF-2026-00021 marked RESOLVED with proof image',
    timestamp: '2026-10-29T11:15:00Z',
    ipAddress: '172.16.8.94',
  },
  {
    id: 'log-4',
    actor: 'system_cron',
    action: 'SLA_HEALTH_CHECK',
    target: 'Calculated 96.2% monthly SLA compliance metric',
    timestamp: '2026-10-29T06:00:00Z',
    ipAddress: '127.0.0.1',
  },
];

export const AdminAuditLogsPage: React.FC = () => {
  const [logs] = useState<AuditLog[]>(mockLogs);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brandText">Security & DPDP Audit Logs</h1>
        <p className="text-sm text-brandText-muted mt-1">
          Immutable audit trail recording administrative actions, crew dispatches, and data access.
        </p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light text-left text-xs">
            <thead className="bg-slate-50 font-semibold text-brandText-muted uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Details</th>
                <th className="py-3 px-4">Source IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 text-brandText-muted whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-brandText">
                    {log.actor}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-brandText">
                    {log.target}
                  </td>
                  <td className="py-3.5 px-4 text-brandText-muted">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
