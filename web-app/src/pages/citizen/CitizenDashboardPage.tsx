import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { complaintsService } from '../../services/complaints.service';
import { Complaint } from '../../types/complaint';
import { getStatusBadgeVariant, getPriorityBadgeVariant, formatDate, formatTimeAgo } from '../../utils/formatters';
import { PlusCircle, FileText, Clock, CheckCircle2, ArrowRight, MapPin, Eye } from 'lucide-react';

export const CitizenDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchComplaints = async () => {
      try {
        const data = await complaintsService.getMyComplaints();
        if (isMounted) setComplaints(data);
      } catch (err) {
        console.warn('Could not fetch citizen complaints:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchComplaints();
    return () => { isMounted = false; };
  }, []);

  const total = complaints.length;
  const inProgress = complaints.filter(c => c.status === 'in_progress' || c.status === 'under_review' || c.status === 'assigned').length;
  const resolved = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Action */}
      <div className="bg-gradient-to-r from-primary-900 via-primary to-teal-civic rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm mb-3">
            Citizen Action Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName || 'Citizen'}!
          </h1>
          <p className="mt-2 text-white/80 text-sm sm:text-base leading-relaxed">
            Report civic concerns, track municipal resolution in real time, and help keep our city clean, safe, and livable.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/citizen/complaints/new">
              <Button variant="secondary" className="bg-white text-primary hover:bg-slate-50 font-semibold shadow-md">
                <PlusCircle className="w-4 h-4 mr-1.5 text-primary" /> Report an Issue
              </Button>
            </Link>
            <Link to="/citizen/complaints">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                View All My Complaints <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Reported"
          value={isLoading ? '...' : total}
          icon={FileText}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          subtitle="Cumulative tickets logged by you"
        />
        <StatCard
          title="Active / In Progress"
          value={isLoading ? '...' : inProgress}
          icon={Clock}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50"
          subtitle="Assigned to municipal field crews"
        />
        <StatCard
          title="Resolved"
          value={isLoading ? '...' : resolved}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
          subtitle="Fixed and closed issues"
        />
      </div>

      {/* Recent Activity Section */}
      <Card
        title="Recent Complaints"
        subtitle="Latest issues submitted to your local municipal corporation"
        headerAction={
          <Link to="/citizen/complaints" className="text-sm font-semibold text-primary hover:text-primary-dark">
            View all ({total})
          </Link>
        }
      >
        {isLoading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : complaints.length === 0 ? (
          <EmptyState
            title="No complaints filed yet"
            description="Notice a pothole, leaking water pipe, broken street light, or garbage dump? File a complaint in less than 2 minutes."
            action={{
              label: 'Report First Issue',
              onClick: () => window.location.href = '/citizen/complaints/new'
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-light text-left text-sm">
              <thead className="bg-slate-50/70 text-xs font-semibold text-brandText-muted uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {complaints.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-medium text-brandText text-xs">
                      {item.trackingNumber}
                      <div className="text-xs font-sans text-brandText truncate max-w-xs font-normal">
                        {item.title}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-brandText-muted">
                      {item.category?.name || 'General'}
                    </td>
                    <td className="py-3.5 px-4 text-brandText-muted">
                      <div className="flex items-center gap-1 truncate max-w-[180px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.address || 'Location captured'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={getStatusBadgeVariant(item.status)}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={getPriorityBadgeVariant(item.priority)}>
                        {item.priority}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-brandText-muted" title={formatDate(item.createdAt)}>
                      {formatTimeAgo(item.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to={`/citizen/complaints?id=${item.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
