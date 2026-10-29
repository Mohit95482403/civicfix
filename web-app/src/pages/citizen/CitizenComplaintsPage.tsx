import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { complaintsService } from '../../services/complaints.service';
import { Complaint } from '../../types/complaint';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { getStatusBadgeVariant, getPriorityBadgeVariant, formatDate, formatTimeAgo } from '../../utils/formatters';
import { Search, PlusCircle, MapPin, Clock } from 'lucide-react';

export const CitizenComplaintsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const highlightedId = searchParams.get('id');

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const data = await complaintsService.getMyComplaints();
        if (isMounted) {
          setComplaints(data);
          if (highlightedId) {
            const found = data.find(c => c.id === highlightedId);
            if (found) setSelectedComplaint(found);
          }
        }
      } catch (err) {
        console.warn('Failed to load complaints:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [highlightedId]);

  const filteredComplaints = complaints.filter(item => {
    const matchesSearch =
      item.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.address && item.address.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') {
      return ['submitted', 'under_review', 'assigned', 'in_progress'].includes(item.status);
    }
    if (statusFilter === 'resolved') {
      return ['resolved', 'closed'].includes(item.status);
    }
    return item.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandText">My Complaints</h1>
          <p className="text-sm text-brandText-muted mt-1">
            Track status, review notes, and monitor resolution progress on all your reported issues.
          </p>
        </div>
        <Link to="/citizen/complaints/new">
          <Button variant="primary" className="shadow-sm">
            <PlusCircle className="w-4 h-4 mr-1.5" /> File New Complaint
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl overflow-x-auto">
            {[
              { id: 'all', label: 'All Issues' },
              { id: 'active', label: 'Active & In Progress' },
              { id: 'resolved', label: 'Resolved & Closed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === tab.id
                    ? 'bg-white text-brandText shadow-xs'
                    : 'text-brandText-muted hover:text-brandText'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-80">
            <Input
              type="text"
              placeholder="Search by ticket # or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefixIcon={<Search className="w-4 h-4 text-brandText-muted" />}
              className="py-1.5 text-xs"
            />
          </div>
        </div>
      </Card>

      {/* Complaints List */}
      {isLoading ? (
        <div className="py-16 flex justify-center items-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredComplaints.length === 0 ? (
        <EmptyState
          title="No complaints found"
          description={
            searchQuery || statusFilter !== 'all'
              ? 'Try modifying your search or filters.'
              : 'You have not submitted any complaints yet.'
          }
          action={
            searchQuery || statusFilter !== 'all'
              ? {
                  label: 'Clear Filters',
                  onClick: () => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  },
                }
              : {
                  label: 'Submit First Complaint',
                  onClick: () => window.location.href = '/citizen/complaints/new',
                }
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredComplaints.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedComplaint(item)}
              className="bg-white border border-border-light hover:border-primary/40 rounded-xl p-5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-primary bg-primary-50 px-2.5 py-0.5 rounded-md">
                    {item.trackingNumber}
                  </span>
                  <Badge variant={getStatusBadgeVariant(item.status)}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant={getPriorityBadgeVariant(item.priority)}>
                    {item.priority}
                  </Badge>
                  <span className="text-xs text-brandText-muted">
                    {item.category?.name || 'General Issue'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-brandText">{item.title}</h3>
                <p className="text-xs text-brandText-muted line-clamp-2">{item.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-brandText-muted pt-1">
                  {item.address && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reported {formatTimeAgo(item.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-end">
                <Button variant="outline" size="sm" className="text-xs">
                  View Timeline & Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedComplaint(null)}
          title={`Ticket ${selectedComplaint.trackingNumber}`}
          size="lg"
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border-light">
              <div>
                <h3 className="text-lg font-bold text-brandText">{selectedComplaint.title}</h3>
                <p className="text-xs text-brandText-muted mt-0.5">
                  Category: <span className="font-semibold text-brandText">{selectedComplaint.category?.name}</span> • 
                  Submitted: {formatDate(selectedComplaint.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(selectedComplaint.status)}>
                  {selectedComplaint.status.replace('_', ' ')}
                </Badge>
                <Badge variant={getPriorityBadgeVariant(selectedComplaint.priority)}>
                  {selectedComplaint.priority} Priority
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase text-brandText-muted tracking-wider mb-1">
                Description
              </h4>
              <p className="text-sm text-brandText bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed">
                {selectedComplaint.description}
              </p>
            </div>

            {selectedComplaint.address && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-brandText-muted tracking-wider mb-1">
                  Reported Location
                </h4>
                <div className="flex items-center gap-2 text-sm text-brandText">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>{selectedComplaint.address}</span>
                </div>
              </div>
            )}

            {/* Lifecycle Stages */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-brandText-muted tracking-wider mb-3">
                Resolution Workflow
              </h4>
              <div className="space-y-3 pl-2 border-l-2 border-primary/30 ml-2">
                <div className="relative pl-5">
                  <div className="absolute -left-[17px] top-1 w-3 h-3 rounded-full bg-primary" />
                  <p className="text-xs font-semibold text-brandText">Ticket Registered</p>
                  <p className="text-xs text-brandText-muted">{formatDate(selectedComplaint.createdAt)}</p>
                </div>
                <div className="relative pl-5">
                  <div className={`absolute -left-[17px] top-1 w-3 h-3 rounded-full ${
                    selectedComplaint.status !== 'submitted' ? 'bg-primary' : 'bg-slate-300'
                  }`} />
                  <p className="text-xs font-semibold text-brandText">Reviewed by Municipal Triage</p>
                  <p className="text-xs text-brandText-muted">Assigned to Department Works</p>
                </div>
                <div className="relative pl-5">
                  <div className={`absolute -left-[17px] top-1 w-3 h-3 rounded-full ${
                    ['in_progress', 'resolved', 'closed'].includes(selectedComplaint.status) ? 'bg-primary' : 'bg-slate-300'
                  }`} />
                  <p className="text-xs font-semibold text-brandText">Field Crew Dispatched</p>
                  <p className="text-xs text-brandText-muted">Remediation in progress on site</p>
                </div>
                <div className="relative pl-5">
                  <div className={`absolute -left-[17px] top-1 w-3 h-3 rounded-full ${
                    ['resolved', 'closed'].includes(selectedComplaint.status) ? 'bg-emerald-500' : 'bg-slate-300'
                  }`} />
                  <p className="text-xs font-semibold text-brandText">Issue Resolved</p>
                  <p className="text-xs text-brandText-muted">Inspected and verified</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-light flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedComplaint(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
