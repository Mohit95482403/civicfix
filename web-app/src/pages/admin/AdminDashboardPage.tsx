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
import { Complaint } from '../../types/complaint';
import { getStatusBadgeVariant, getPriorityBadgeVariant } from '../../utils/formatters';
import {
  Layers,
  AlertTriangle,
  Clock,
  Star,
  Search,
  Building2,
  ArrowRight,
  UserPlus,
  Eye,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user, memberships } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Triage modal
  const [triageComplaint, setTriageComplaint] = useState<Complaint | null>(null);
  const [selectedStaffName, setSelectedStaffName] = useState('Ramesh Kumar (Roads Crew #1)');
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    let isMounted = true;
    complaintsService.getAllComplaints().then((data) => {
      if (isMounted) {
        setComplaints(data);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const total = complaints.length;
  const pendingTriage = complaints.filter(c => c.status === 'submitted' || c.status === 'under_review').length;
  const inProgress = complaints.filter(c => c.status === 'assigned' || c.status === 'in_progress').length;

  const currentOrg = memberships[0]?.organization?.name || 'Bengaluru Municipal Corporation (BBMP)';

  const filtered = complaints.filter((c) => {
    if (filter === 'SUBMITTED' && c.status !== 'submitted') return false;
    if (filter === 'ASSIGNED' && c.status !== 'assigned') return false;
    if (filter === 'IN_PROGRESS' && c.status !== 'in_progress') return false;
    if (filter === 'RESOLVED' && c.status !== 'resolved' && c.status !== 'closed') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.trackingNumber.toLowerCase().includes(q) ||
        (c.address && c.address.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleAssignSubmit = async () => {
    if (!triageComplaint) return;
    setIsAssigning(true);
    try {
      const updated = await complaintsService.updateStatus(
        triageComplaint.id,
        'assigned',
        `Dispatched to field crew: ${selectedStaffName}`
      );
      setComplaints((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      setTriageComplaint(null);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-primary-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Municipal Governance Console
            </span>
            <span className="text-xs text-white/70">{currentOrg}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            City Administrator Dashboard • {user?.fullName || 'Administrator'}
          </h1>
          <p className="text-sm text-white/80 mt-1">
            Supervise civic grievance triage, manage operational departments, allocate field crews, and review SLA health.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/admin/staff">
            <Button variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs">
              <UserPlus className="w-4 h-4 mr-1 text-primary" /> Provision Staff
            </Button>
          </Link>
          <Link to="/admin/reports">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xs">
              SLA Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Organization Complaints"
          value={isLoading ? '...' : total}
          icon={Layers}
          iconColor="text-primary"
          iconBgColor="bg-primary-50"
          subtitle="Within current municipal jurisdiction"
        />
        <StatCard
          title="Pending Triage / Dispatch"
          value={isLoading ? '...' : pendingTriage}
          icon={AlertTriangle}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50"
          subtitle="Requires supervisor assignment"
        />
        <StatCard
          title="Active in Field"
          value={isLoading ? '...' : inProgress}
          icon={Clock}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          subtitle="Work ongoing on site"
        />
        <StatCard
          title="Citizen Satisfaction"
          value="4.7 / 5.0"
          icon={Star}
          iconColor="text-amber-500"
          iconBgColor="bg-amber-50"
          subtitle="94% positive closure ratings"
        />
      </div>

      {/* Grid: Incident Triage & Department Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints Triage Queue (2 cols) */}
        <div className="lg:col-span-2">
          <Card
            title="Incident Triage & Complaints Queue"
            subtitle="Review citizen reports, assign responsible field crews, and inspect resolution SLA status."
            headerAction={
              <Link to="/admin/complaints" className="text-xs font-semibold text-primary hover:text-primary-dark">
                View All Complaints <ArrowRight className="w-3.5 h-3.5 inline ml-0.5" />
              </Link>
            }
          >
            {/* Filter and search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border-light">
              <div className="flex items-center gap-1 flex-wrap">
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'SUBMITTED', label: 'Pending Dispatch' },
                  { id: 'ASSIGNED', label: 'Assigned' },
                  { id: 'IN_PROGRESS', label: 'In Progress' },
                  { id: 'RESOLVED', label: 'Resolved' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id as any)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
                      filter === tab.id ? 'bg-primary text-white shadow-xs' : 'text-brandText-muted hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="w-full sm:w-56">
                <Input
                  type="text"
                  placeholder="Filter tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  prefixIcon={<Search className="w-3.5 h-3.5 text-brandText-muted" />}
                  className="py-1 text-xs"
                />
              </div>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="py-12 flex justify-center items-center">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center text-brandText-muted text-xs">
                No tickets matching this view.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border-light bg-slate-50 text-brandText-muted font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Reference</th>
                      <th className="py-2.5 px-3">Title & Category</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Priority</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-mono font-semibold text-primary">
                          {item.trackingNumber}
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          <div className="font-semibold text-brandText truncate">{item.title}</div>
                          <div className="text-[11px] text-brandText-muted truncate mt-0.5">
                            {item.category?.name || 'General Infrastructure'}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant={getStatusBadgeVariant(item.status)}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant={getPriorityBadgeVariant(item.priority)}>
                            {item.priority}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {item.status === 'submitted' || item.status === 'under_review' ? (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => setTriageComplaint(item)}
                              className="text-xs"
                            >
                              Dispatch Crew
                            </Button>
                          ) : (
                            <Link to={`/admin/complaints?id=${item.id}`}>
                              <Button size="sm" variant="ghost" className="text-xs text-primary">
                                <Eye className="w-3.5 h-3.5 mr-1" /> Details
                              </Button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Department Status Column (1 col) */}
        <div>
          <Card
            title="Department Performance"
            subtitle="Active load across municipal units"
            headerAction={
              <Link to="/admin/departments" className="text-xs font-semibold text-primary hover:text-primary-dark">
                Manage
              </Link>
            }
          >
            <div className="space-y-3">
              {[
                { name: 'Roads & Infrastructure', active: 12, resolved: 45, slaBreach: 0 },
                { name: 'Solid Waste Management', active: 18, resolved: 62, slaBreach: 0 },
                { name: 'Electrical & Streetlights', active: 7, resolved: 28, slaBreach: 1 },
                { name: 'Water Supply & Sewerage', active: 9, resolved: 33, slaBreach: 0 },
              ].map((dept, i) => (
                <div key={i} className="p-3 bg-slate-50/80 rounded-xl border border-border-light space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-brandText">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-primary" />
                      {dept.name}
                    </span>
                    <span className="text-primary font-mono">{dept.active} active</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-brandText-muted">
                    <span>{dept.resolved} resolved this month</span>
                    {dept.slaBreach > 0 ? (
                      <span className="text-rose-600 font-semibold">{dept.slaBreach} SLA breach</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">100% on time</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Dispatch / Triage Modal */}
      {triageComplaint && (
        <Modal
          isOpen={true}
          onClose={() => setTriageComplaint(null)}
          title={`Dispatch Field Crew: ${triageComplaint.trackingNumber}`}
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-border-light text-xs space-y-1">
              <p className="font-bold text-brandText">{triageComplaint.title}</p>
              <p className="text-brandText-muted">{triageComplaint.description}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brandText mb-1.5">
                Select Qualified Field Crew / Technician
              </label>
              <select
                value={selectedStaffName}
                onChange={(e) => setSelectedStaffName(e.target.value)}
                className="w-full rounded-xl border border-border-light bg-white p-2.5 text-xs text-brandText focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Ramesh Kumar (Roads Crew #1)">Ramesh Kumar (Roads Crew #1 - Koramangala)</option>
                <option value="Suresh B. (Electrical Maintenance)">Suresh B. (Electrical Maintenance - Indiranagar)</option>
                <option value="Anand V. (Sanitation Inspector)">Anand V. (Sanitation Inspector - Zone 4)</option>
                <option value="Kavita Reddy (Water Works Engineer)">Kavita Reddy (Water Works Engineer - Central)</option>
              </select>
            </div>

            <div className="pt-3 border-t border-border-light flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setTriageComplaint(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAssignSubmit}
                isLoading={isAssigning}
              >
                Dispatch Work Order
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
