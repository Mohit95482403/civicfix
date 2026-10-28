import React, { useState } from 'react';
import { 
  Wrench, CheckCircle2, Clock, AlertTriangle, 
  MapPin, Camera, Filter, Search, ChevronRight, Info 
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface DemoTask {
  id: string;
  reference: string;
  title: string;
  category: string;
  categoryIcon: string;
  status: 'assigned' | 'in_progress' | 'resolved';
  priority: 'urgent' | 'high' | 'medium';
  location: string;
  slaDue: string;
  reportedAgo: string;
}

const DEMO_TASKS: DemoTask[] = [
  {
    id: 'task-1',
    reference: 'CF-2026-BLR-001042',
    title: 'Severe pothole causing vehicle skidding on 100ft Ring Road',
    category: 'Roads & Infrastructure',
    categoryIcon: '🕳️',
    status: 'in_progress',
    priority: 'high',
    location: 'Opposite Koramangala BDA Complex, 100ft Road',
    slaDue: 'Today at 10:15 AM',
    reportedAgo: '2d ago',
  },
  {
    id: 'task-2',
    reference: 'CF-2026-BLR-001045',
    title: 'Damaged storm drainage grate presenting tire trap risk',
    category: 'Roads & Infrastructure',
    categoryIcon: '🌊',
    status: 'assigned',
    priority: 'urgent',
    location: '12th Main Road, HAL 2nd Stage, Indiranagar',
    slaDue: 'Tomorrow at 08:00 AM',
    reportedAgo: '4h ago',
  },
  {
    id: 'task-3',
    reference: 'CF-2026-BLR-001036',
    title: 'Sunken manhole cover protruding 3 inches above road grade',
    category: 'Roads & Infrastructure',
    categoryIcon: '🕳️',
    status: 'resolved',
    priority: 'medium',
    location: '5th Block, Koramangala Main Road',
    slaDue: 'Resolved yesterday',
    reportedAgo: '3d ago',
  },
];

export function StaffDashboard() {
  const [filter, setFilter] = useState<'ALL' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = DEMO_TASKS.filter((task) => {
    if (filter === 'ASSIGNED' && task.status !== 'assigned') return false;
    if (filter === 'IN_PROGRESS' && task.status !== 'in_progress') return false;
    if (filter === 'RESOLVED' && task.status !== 'resolved') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.reference.toLowerCase().includes(q) ||
        task.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Demo Data Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
        <Info className="text-amber-700 mt-0.5 flex-shrink-0" size={18} />
        <div className="text-xs text-amber-800 leading-relaxed">
          <span className="font-semibold">Day 3 Project Foundation & Shell:</span> This staff portal is currently rendering
          initial UI foundation components with structured demo data. Real API dispatch and database state transitions will be connected in subsequent phases.
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-brandText-secondary text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Assigned Tasks</span>
            <Wrench size={16} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-brandText-primary">3</div>
          <p className="text-xs text-brandText-secondary mt-1">2 pending on-site work</p>
        </div>

        <div className="bg-surface border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-brandText-secondary text-xs font-semibold uppercase tracking-wider mb-2">
            <span>High Urgency</span>
            <AlertTriangle size={16} className="text-semantic-error" />
          </div>
          <div className="text-3xl font-bold text-semantic-error">1</div>
          <p className="text-xs text-brandText-secondary mt-1">Immediate action required</p>
        </div>

        <div className="bg-surface border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-brandText-secondary text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Resolved This Week</span>
            <CheckCircle2 size={16} className="text-semantic-success" />
          </div>
          <div className="text-3xl font-bold text-semantic-success">18</div>
          <p className="text-xs text-brandText-secondary mt-1">Photo evidence verified</p>
        </div>

        <div className="bg-surface border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-brandText-secondary text-xs font-semibold uppercase tracking-wider mb-2">
            <span>SLA Compliance</span>
            <Clock size={16} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-brandText-primary">94.2%</div>
          <p className="text-xs text-semantic-success mt-1">Within target SLA window</p>
        </div>
      </div>

      {/* Main Work Orders Queue */}
      <Card
        title="Field Work Order Queue"
        subtitle="Manage assigned municipal repairs, record on-site progress, and submit mandatory resolution evidence."
      >
        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === 'ALL' ? 'bg-primary text-white' : 'text-brandText-secondary hover:bg-surface-hover'
              }`}
            >
              All ({DEMO_TASKS.length})
            </button>
            <button
              onClick={() => setFilter('ASSIGNED')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === 'ASSIGNED' ? 'bg-primary text-white' : 'text-brandText-secondary hover:bg-surface-hover'
              }`}
            >
              Pending Start
            </button>
            <button
              onClick={() => setFilter('IN_PROGRESS')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === 'IN_PROGRESS' ? 'bg-primary text-white' : 'text-brandText-secondary hover:bg-surface-hover'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('RESOLVED')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === 'RESOLVED' ? 'bg-primary text-white' : 'text-brandText-secondary hover:bg-surface-hover'
              }`}
            >
              Resolved
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search reference or street..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Task Cards */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 size={36} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No tasks in this view</p>
              <p className="text-xs text-slate-400">Great job maintaining civic infrastructure.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                    {task.categoryIcon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold text-primary tracking-wide">
                        {task.reference}
                      </span>
                      <Badge variant={task.status}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant={task.priority}>
                        {task.priority.toUpperCase()}
                      </Badge>
                      <span className="text-[11px] text-slate-400">Reported {task.reportedAgo}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-brandText-primary mb-1">
                      {task.title}
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-brandText-secondary flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-primary" />
                        {task.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        SLA: {task.slaDue}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Technician Actions */}
                <div className="flex items-center gap-2 self-end lg:self-center">
                  {task.status === 'assigned' && (
                    <Button size="sm" variant="primary" icon={<Wrench size={13} />}>
                      Start Inspection
                    </Button>
                  )}
                  {task.status === 'in_progress' && (
                    <Button size="sm" variant="primary" className="bg-semantic-success hover:bg-emerald-700" icon={<Camera size={13} />}>
                      Submit Proof & Resolve
                    </Button>
                  )}
                  {task.status === 'resolved' && (
                    <span className="text-xs font-semibold text-semantic-success flex items-center gap-1">
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
