import React, { useState } from 'react';
import { 
  Building2, Users, AlertTriangle, CheckCircle2, Clock, 
  Search, ShieldAlert, ArrowUpRight, Filter, ChevronRight, 
  Layers, Info, UserCheck, Star 
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface DemoComplaint {
  id: string;
  reference: string;
  title: string;
  category: string;
  categoryIcon: string;
  status: 'submitted' | 'under_review' | 'assigned' | 'in_progress' | 'resolved';
  priority: 'urgent' | 'high' | 'medium';
  department: string;
  assignedStaff: string | null;
  reportedAt: string;
}

const DEMO_COMPLAINTS: DemoComplaint[] = [
  {
    id: 'cmp-1',
    reference: 'CF-2026-BLR-001042',
    title: 'Severe pothole causing vehicle skidding on 100ft Ring Road',
    category: 'Roads & Infrastructure',
    categoryIcon: '🕳️',
    status: 'in_progress',
    priority: 'high',
    department: 'Roads & Infrastructure',
    assignedStaff: 'Ramesh Kumar',
    reportedAt: '2 days ago',
  },
  {
    id: 'cmp-2',
    reference: 'CF-2026-BLR-001041',
    title: 'Garbage overflow at 5th Cross junction for 3 days',
    category: 'Garbage & Sanitation',
    categoryIcon: '🗑️',
    status: 'submitted',
    priority: 'urgent',
    department: 'Solid Waste Management',
    assignedStaff: null,
    reportedAt: '6 hours ago',
  },
  {
    id: 'cmp-3',
    reference: 'CF-2026-BLR-001040',
    title: 'Streetlight not working on MG Road near Metro station',
    category: 'Streetlights',
    categoryIcon: '💡',
    status: 'assigned',
    priority: 'high',
    department: 'Electrical & Lighting',
    assignedStaff: 'Suresh B.',
    reportedAt: '3 days ago',
  },
  {
    id: 'cmp-4',
    reference: 'CF-2026-BLR-001039',
    title: 'Water pipeline burst flooding residential street',
    category: 'Water Supply',
    categoryIcon: '💧',
    status: 'resolved',
    priority: 'urgent',
    department: 'Water Supply & Sewerage',
    assignedStaff: 'Kumar G.',
    reportedAt: '6 days ago',
  },
];

const DEMO_DEPARTMENTS = [
  { name: 'Roads & Infrastructure', active: 12, resolved: 45, slaBreached: 1 },
  { name: 'Solid Waste Management', active: 18, resolved: 62, slaBreached: 0 },
  { name: 'Electrical & Lighting', active: 7, resolved: 28, slaBreached: 1 },
  { name: 'Water Supply & Sewerage', active: 9, resolved: 33, slaBreached: 0 },
];

export function AdminDashboard() {
  const [filter, setFilter] = useState<'ALL' | 'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComplaints = DEMO_COMPLAINTS.filter((c) => {
    if (filter === 'SUBMITTED' && c.status !== 'submitted') return false;
    if (filter === 'ASSIGNED' && c.status !== 'assigned') return false;
    if (filter === 'IN_PROGRESS' && c.status !== 'in_progress') return false;
    if (filter === 'RESOLVED' && c.status !== 'resolved') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.reference.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Demo Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
        <Info className="text-amber-700 mt-0.5 flex-shrink-0" size={18} />
        <div className="text-xs text-amber-800 leading-relaxed">
          <span className="font-semibold">Day 3 Project Foundation & Shell:</span> This administrative console is operating
          with baseline structure and sample municipal metrics. Database connections and live triage state management will be provisioned in Day 4–6.
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-brandText-secondary text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Complaints</span>
            <Layers size={16} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-brandText-primary">482</div>
          <p className="text-xs text-semantic-success mt-1">↑ 14% vs last month</p>
        </div>

        <div className="bg-surface border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-brandText-secondary text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Pending Triage</span>
            <AlertTriangle size={16} className="text-semantic-warning" />
          </div>
          <div className="text-3xl font-bold text-semantic-warning">14</div>
          <p className="text-xs text-brandText-secondary mt-1">Requires supervisor dispatch</p>
        </div>

        <div className="bg-surface border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-brandText-secondary text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Avg Turnaround</span>
            <Clock size={16} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-brandText-primary">31.4 hrs</div>
          <p className="text-xs text-semantic-success mt-1">Well within 48h SLA</p>
        </div>

        <div className="bg-surface border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-brandText-secondary text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Citizen Satisfaction</span>
            <Star size={16} className="text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-bold text-brandText-primary">4.6 / 5.0</div>
          <p className="text-xs text-brandText-secondary mt-1">94% positive closure ratings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints Triage Table (2 Cols) */}
        <div className="lg:col-span-2">
          <Card
            title="Incident Triage & Complaints Queue"
            subtitle="Review citizen reports, assign responsible field crews, and inspect resolution SLA status."
          >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  onClick={() => setFilter('ALL')}
                  className={`px-2.5 py-1 text-xs font-medium rounded ${
                    filter === 'ALL' ? 'bg-primary text-white' : 'text-brandText-secondary hover:bg-surface-hover'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('SUBMITTED')}
                  className={`px-2.5 py-1 text-xs font-medium rounded ${
                    filter === 'SUBMITTED' ? 'bg-primary text-white' : 'text-brandText-secondary hover:bg-surface-hover'
                  }`}
                >
                  Submitted
                </button>
                <button
                  onClick={() => setFilter('ASSIGNED')}
                  className={`px-2.5 py-1 text-xs font-medium rounded ${
                    filter === 'ASSIGNED' ? 'bg-primary text-white' : 'text-brandText-secondary hover:bg-surface-hover'
                  }`}
                >
                  Assigned
                </button>
                <button
                  onClick={() => setFilter('IN_PROGRESS')}
                  className={`px-2.5 py-1 text-xs font-medium rounded ${
                    filter === 'IN_PROGRESS' ? 'bg-primary text-white' : 'text-brandText-secondary hover:bg-surface-hover'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setFilter('RESOLVED')}
                  className={`px-2.5 py-1 text-xs font-medium rounded ${
                    filter === 'RESOLVED' ? 'bg-primary text-white' : 'text-brandText-secondary hover:bg-surface-hover'
                  }`}
                >
                  Resolved
                </button>
              </div>

              <div className="relative w-full sm:w-56">
                <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-7 pr-3 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-brandText-secondary font-semibold">
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3">Title & Dept</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Assigned To</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-semibold text-primary whitespace-nowrap">
                        {item.reference}
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-medium text-brandText-primary truncate">{item.title}</div>
                        <div className="text-[11px] text-brandText-secondary flex items-center gap-1 mt-0.5">
                          <span>{item.categoryIcon}</span>
                          <span>{item.department}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <Badge variant={item.status}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {item.assignedStaff ? (
                          <span className="font-medium text-brandText-primary">{item.assignedStaff}</span>
                        ) : (
                          <span className="text-semantic-warning italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <Button size="sm" variant={item.assignedStaff ? 'ghost' : 'primary'}>
                          {item.assignedStaff ? 'Inspect' : 'Dispatch'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Department Workload Summary (1 Col) */}
        <div>
          <Card
            title="Department Status"
            subtitle="Active load across operational units"
          >
            <div className="space-y-4">
              {DEMO_DEPARTMENTS.map((dept, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-semibold text-brandText-primary mb-1">
                    <span>{dept.name}</span>
                    <span className="text-primary">{dept.active} active</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-brandText-secondary">
                    <span>{dept.resolved} resolved this month</span>
                    {dept.slaBreached > 0 ? (
                      <span className="text-semantic-error font-semibold">{dept.slaBreached} breach</span>
                    ) : (
                      <span className="text-semantic-success">100% on time</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
