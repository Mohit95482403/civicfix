import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { complaintsService } from '../../services/complaints.service';
import { Complaint } from '../../types/complaint';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { getStatusBadgeVariant, getPriorityBadgeVariant, formatDate, formatTimeAgo } from '../../utils/formatters';
import { Search, Eye } from 'lucide-react';

export const AdminComplaintsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const highlightedId = searchParams.get('id');

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    let isMounted = true;
    complaintsService.getAllComplaints().then((data) => {
      if (isMounted) {
        setComplaints(data);
        if (highlightedId) {
          const found = data.find((c) => c.id === highlightedId);
          if (found) setSelectedComplaint(found);
        }
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [highlightedId]);

  const filtered = complaints.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.trackingNumber.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.address && c.address.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandText">Complaints Management</h1>
          <p className="text-sm text-brandText-muted mt-1">
            Complete municipality grievance register with audit history and reassignment capabilities.
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="max-w-md">
          <Input
            placeholder="Search by ticket #, issue summary, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefixIcon={<Search className="w-4 h-4 text-brandText-muted" />}
            className="py-1.5 text-xs"
          />
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-brandText-muted text-sm">
            No complaints found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-light text-left text-xs">
              <thead className="bg-slate-50 font-semibold text-brandText-muted uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Title & Details</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Reported</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">
                      {item.trackingNumber}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-brandText truncate">{item.title}</div>
                      <div className="text-[11px] text-brandText-muted truncate">{item.category?.name}</div>
                    </td>
                    <td className="py-3.5 px-4 text-brandText-muted max-w-[160px] truncate">
                      {item.address || 'GPS coordinates'}
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
                    <td className="py-3.5 px-4 text-brandText-muted">
                      {formatTimeAgo(item.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedComplaint(item)}
                        className="text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-primary" /> Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Inspector Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedComplaint(null)}
          title={`Administrative Inspection: ${selectedComplaint.trackingNumber}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-light">
              <div>
                <h3 className="text-base font-bold text-brandText">{selectedComplaint.title}</h3>
                <p className="text-xs text-brandText-muted">
                  Submitted {formatDate(selectedComplaint.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(selectedComplaint.status)}>
                  {selectedComplaint.status.replace('_', ' ')}
                </Badge>
                <Badge variant={getPriorityBadgeVariant(selectedComplaint.priority)}>
                  {selectedComplaint.priority}
                </Badge>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-border-light text-xs space-y-1">
              <span className="font-semibold text-brandText-muted uppercase">Description:</span>
              <p className="text-brandText leading-relaxed">{selectedComplaint.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-border-light">
                <span className="font-semibold text-brandText-muted block mb-1">Category & SLA</span>
                <span className="font-bold text-brandText">{selectedComplaint.category?.name}</span>
                <p className="text-[11px] text-brandText-muted mt-0.5">
                  Resolution Target: {selectedComplaint.category?.slaHours || 48} hours
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-border-light">
                <span className="font-semibold text-brandText-muted block mb-1">Location Coordinates</span>
                <span className="font-bold text-brandText truncate block">
                  {selectedComplaint.address || 'GPS captured on mobile'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border-light flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedComplaint(null)}>
                Close Inspector
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
