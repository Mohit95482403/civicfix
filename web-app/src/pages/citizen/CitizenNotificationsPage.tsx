import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bell, CheckCheck, Wrench } from 'lucide-react';
import { formatTimeAgo } from '../../utils/formatters';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'status_update' | 'assignment' | 'sla_warning' | 'system';
  createdAt: string;
  read: boolean;
  trackingNumber?: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Field Team Assigned',
    message: 'Your report regarding broken streetlight on 4th Main Road has been assigned to Electrical Services Crew #3.',
    type: 'assignment',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: false,
    trackingNumber: 'CF-2026-00042',
  },
  {
    id: 'n2',
    title: 'Issue Resolved & Inspected',
    message: 'Solid waste disposal on Commercial Street has been cleared and verified by sanitation inspector.',
    type: 'status_update',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    read: false,
    trackingNumber: 'CF-2026-00021',
  },
  {
    id: 'n3',
    title: 'Complaint Registered',
    message: 'Water pipeline leakage reported in Indiranagar Sector 2 has been acknowledged by municipal triage.',
    type: 'system',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    read: true,
    trackingNumber: 'CF-2026-00014',
  },
];

export const CitizenNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandText">Notifications</h1>
          <p className="text-sm text-brandText-muted mt-1">
            Real-time updates on your reported civic issues and municipal announcements.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4 mr-1 text-primary" /> Mark all read
          </Button>
        )}
      </div>

      <Card>
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-brandText-muted">
            <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm">No notifications right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-border-light">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`p-4 sm:p-5 flex items-start gap-4 transition cursor-pointer ${
                  !item.read ? 'bg-primary-50/30 hover:bg-primary-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === 'status_update'
                      ? 'bg-emerald-100 text-emerald-600'
                      : item.type === 'assignment'
                      ? 'bg-blue-100 text-primary'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.type === 'status_update' ? (
                    <CheckCheck className="w-4 h-4" />
                  ) : item.type === 'assignment' ? (
                    <Wrench className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-brandText">{item.title}</h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-brandText-muted shrink-0">
                      {formatTimeAgo(item.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-brandText-muted leading-relaxed">
                    {item.message}
                  </p>

                  {item.trackingNumber && (
                    <span className="inline-block mt-1 font-mono text-[11px] font-semibold text-primary bg-primary-50 px-2 py-0.5 rounded">
                      Ticket {item.trackingNumber}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
