import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintsService } from '../../services/complaints.service';
import { Complaint } from '../../types/complaint';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getStatusBadgeVariant, getPriorityBadgeVariant, formatTimeAgo } from '../../utils/formatters';
import { Search, Eye } from 'lucide-react';

export const StaffComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

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

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandText">Department Complaints</h1>
          <p className="text-sm text-brandText-muted mt-1">
            Complete registry of civic tickets routed to your municipal operational division.
          </p>
        </div>
      </div>

      {/* Filter and search bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="Search tracking #, issue, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefixIcon={<Search className="w-4 h-4 text-brandText-muted" />}
            className="py-1.5 text-xs"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border-light bg-white px-3 py-2 text-xs text-brandText focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Lifecycle Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-border-light bg-white px-3 py-2 text-xs text-brandText focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </Card>

      {/* Complaints Table */}
      <Card>
        {isLoading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-brandText-muted">
            <p className="text-sm">No work orders matching query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-light text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-brandText-muted uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Issue Details</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-medium text-primary text-xs">
                      {item.trackingNumber}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-brandText text-xs truncate">{item.title}</div>
                      <div className="text-[11px] text-brandText-muted truncate">{item.category?.name}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-brandText-muted max-w-[160px] truncate">
                      {item.address || 'GPS coordinates'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(item.status)}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getPriorityBadgeVariant(item.priority)}>
                        {item.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-xs text-brandText-muted">
                      {formatTimeAgo(item.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link to={`/staff/complaints/${item.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs text-primary">
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
