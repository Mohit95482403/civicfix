import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { complaintsService } from '../../services/complaints.service';
import { Complaint, ComplaintStatus } from '../../types/complaint';
import { getStatusBadgeVariant, getPriorityBadgeVariant, formatTimeAgo } from '../../utils/formatters';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Camera,
  Search,
  Eye,
  Check,
  UploadCloud,
} from 'lucide-react';

export const StaffDashboardPage: React.FC = () => {
  const { user, memberships } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Status update modal state
  const [updatingComplaint, setUpdatingComplaint] = useState<Complaint | null>(null);
  const [nextStatus, setNextStatus] = useState<ComplaintStatus>('in_progress');
  const [progressNotes, setProgressNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadStaffComplaints = async () => {
      try {
        const data = await complaintsService.getAllComplaints();
        if (isMounted) setComplaints(data);
      } catch (err) {
        console.warn('Could not load staff complaints:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadStaffComplaints();
    return () => { isMounted = false; };
  }, []);

  const totalAssigned = complaints.filter(c => c.status === 'assigned' || c.status === 'in_progress').length;
  const inProgress = complaints.filter(c => c.status === 'in_progress').length;
  const resolved = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;
  const urgent = complaints.filter(c => c.priority === 'urgent' && c.status !== 'resolved' && c.status !== 'closed').length;

  const filteredComplaints = complaints.filter((task) => {
    if (filter === 'ASSIGNED' && task.status !== 'assigned') return false;
    if (filter === 'IN_PROGRESS' && task.status !== 'in_progress') return false;
    if (filter === 'RESOLVED' && task.status !== 'resolved' && task.status !== 'closed') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.trackingNumber.toLowerCase().includes(q) ||
        (task.address && task.address.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenStatusModal = (complaint: Complaint, targetStatus: ComplaintStatus) => {
    setUpdatingComplaint(complaint);
    setNextStatus(targetStatus);
    setProgressNotes('');
  };

  const handleSaveStatus = async () => {
    if (!updatingComplaint) return;
    setIsUpdating(true);
    try {
      const updated = await complaintsService.updateStatus(
        updatingComplaint.id,
        nextStatus,
        progressNotes || `Status updated to ${nextStatus} by field staff`
      );
      setComplaints((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      setUpdatingComplaint(null);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentOrg = memberships[0]?.organization?.name || memberships[0]?.organizationName || 'Municipal Field Operations';

  return (
    <div className="space-y-6">
      {/* Header & Department Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-primary-900 to-primary rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              On Duty • Active Shift
            </span>
            <span className="text-xs text-white/70">{currentOrg}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Staff Work Orders • {user?.fullName || 'Technician'}
          </h1>
          <p className="text-sm text-white/80 mt-1">
            Review assigned municipal repair orders, log inspections, and submit photo resolution proof.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link to="/staff/assigned-complaints">
            <Button variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs">
              My Active Queue ({totalAssigned})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Work Orders"
          value={isLoading ? '...' : totalAssigned}
          icon={Wrench}
          iconColor="text-primary"
          iconBgColor="bg-primary-50"
          subtitle="Pending on-site resolution"
        />
        <StatCard
          title="In Progress"
          value={isLoading ? '...' : inProgress}
          icon={Clock}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          subtitle="Crews dispatched on site"
        />
        <StatCard
          title="High / Urgent Priority"
          value={isLoading ? '...' : urgent}
          icon={AlertTriangle}
          iconColor="text-rose-600"
          iconBgColor="bg-rose-50"
          subtitle="Escalated for immediate action"
        />
        <StatCard
          title="Resolved"
          value={isLoading ? '...' : resolved}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
          subtitle="Verified with photo evidence"
        />
      </div>

      {/* Main Work Order Queue Card */}
      <Card
        title="Field Work Order Queue"
        subtitle="Manage assigned municipal repairs, record on-site progress, and submit mandatory resolution evidence."
      >
        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-border-light">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'ALL', label: `All (${complaints.length})` },
              { id: 'ASSIGNED', label: 'Pending Start' },
              { id: 'IN_PROGRESS', label: 'In Progress' },
              { id: 'RESOLVED', label: 'Resolved' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  filter === tab.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-brandText-muted hover:bg-slate-100 hover:text-brandText'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search reference or street..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefixIcon={<Search className="w-4 h-4 text-brandText-muted" />}
              className="py-1.5 text-xs"
            />
          </div>
        </div>

        {/* Complaints list */}
        {isLoading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="py-12 text-center text-brandText-muted">
            <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-brandText">No work orders matching this filter</p>
            <p className="text-xs text-brandText-muted mt-1">Check back when new complaints are triaged.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredComplaints.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-border-light hover:border-primary/40 rounded-xl transition bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-primary bg-primary-50 px-2 py-0.5 rounded">
                      {item.trackingNumber}
                    </span>
                    <Badge variant={getStatusBadgeVariant(item.status)}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant={getPriorityBadgeVariant(item.priority)}>
                      {item.priority}
                    </Badge>
                    <span className="text-xs text-brandText-muted">
                      {item.category?.name || 'Infrastructure'}
                    </span>
                    <span className="text-xs text-brandText-muted">
                      • Reported {formatTimeAgo(item.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-brandText">{item.title}</h3>
                  <p className="text-xs text-brandText-muted line-clamp-1">{item.description}</p>

                  <div className="flex items-center gap-4 text-xs text-brandText-muted pt-1">
                    {item.address && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.address}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Target SLA: {item.category?.slaHours ? `${item.category.slaHours} hours` : '48 hours'}
                    </span>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                  <Link to={`/staff/complaints/${item.id}`}>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Eye className="w-3.5 h-3.5 mr-1" /> View Full
                    </Button>
                  </Link>

                  {item.status === 'assigned' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleOpenStatusModal(item, 'in_progress')}
                      className="text-xs"
                    >
                      <Wrench className="w-3.5 h-3.5 mr-1" /> Start Work
                    </Button>
                  )}

                  {item.status === 'in_progress' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleOpenStatusModal(item, 'resolved')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-xs text-white"
                    >
                      <Camera className="w-3.5 h-3.5 mr-1" /> Resolve
                    </Button>
                  )}

                  {item.status === 'resolved' && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 px-2.5 py-1 bg-emerald-50 rounded-lg">
                      <Check className="w-3.5 h-3.5" /> Work Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Status Update / Resolution Modal */}
      {updatingComplaint && (
        <Modal
          isOpen={true}
          onClose={() => setUpdatingComplaint(null)}
          title={`Update Work Order: ${updatingComplaint.trackingNumber}`}
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-brandText-muted uppercase">Target Status</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusBadgeVariant(nextStatus)} className="text-sm py-1 px-3 capitalize">
                  {nextStatus.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brandText mb-1">
                Field Progress Notes / Inspection Comments
              </label>
              <textarea
                rows={3}
                placeholder="Detail the materials used, crew members, repair actions completed..."
                value={progressNotes}
                onChange={(e) => setProgressNotes(e.target.value)}
                className="w-full rounded-xl border border-border-light p-3 text-xs text-brandText focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            {nextStatus === 'resolved' && (
              <div>
                <label className="block text-xs font-semibold text-brandText mb-1">
                  Resolution Proof Photo (Mandatory)
                </label>
                <div className="border-2 border-dashed border-border-light rounded-xl p-4 text-center bg-slate-50">
                  <UploadCloud className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs font-medium text-brandText">Upload resolution photograph</p>
                  <p className="text-[10px] text-brandText-muted">Required for supervisor sign-off</p>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-border-light flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setUpdatingComplaint(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveStatus}
                isLoading={isUpdating}
                className={nextStatus === 'resolved' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Confirm Status Update
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
