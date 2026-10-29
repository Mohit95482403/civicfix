import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { complaintsService } from '../../services/complaints.service';
import { Complaint, ComplaintStatus } from '../../types/complaint';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { getStatusBadgeVariant, getPriorityBadgeVariant, formatDate, formatTimeAgo } from '../../utils/formatters';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Wrench,
  CheckCircle2,
  Camera,
} from 'lucide-react';

export const StaffComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    complaintsService.getComplaintById(id).then((found) => {
      if (isMounted) {
        if (found) setComplaint(found);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [id]);

  const handleUpdateStatus = async (newStatus: ComplaintStatus) => {
    if (!complaint) return;
    setIsUpdating(true);
    setStatusMessage(null);
    try {
      const updated = await complaintsService.updateStatus(
        complaint.id,
        newStatus,
        noteText.trim() ? noteText.trim() : `Status transitioned to ${newStatus}`
      );
      setComplaint(updated);
      setNoteText('');
      setStatusMessage(`Work order updated to ${newStatus.replace('_', ' ')} successfully.`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="text-center py-16 space-y-3">
        <h2 className="text-lg font-bold text-brandText">Work order not found</h2>
        <p className="text-xs text-brandText-muted">The requested complaint ID does not exist or was removed.</p>
        <Link to="/staff/dashboard">
          <Button variant="outline" size="sm">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back link & Status bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/staff/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brandText-muted hover:text-brandText transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Work Orders
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(complaint.status)}>
            {complaint.status.replace('_', ' ')}
          </Badge>
          <Badge variant={getPriorityBadgeVariant(complaint.priority)}>
            {complaint.priority} Priority
          </Badge>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Ticket Info Card */}
      <Card>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-primary bg-primary-50 px-2 py-0.5 rounded">
                {complaint.trackingNumber}
              </span>
              <span className="text-xs text-brandText-muted">• Category: {complaint.category?.name}</span>
            </div>
            <h1 className="text-xl font-extrabold text-brandText">{complaint.title}</h1>
            <p className="text-xs text-brandText-muted mt-1">
              Reported {formatDate(complaint.createdAt)} ({formatTimeAgo(complaint.createdAt)})
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-xl">
            <h4 className="text-xs font-bold uppercase text-brandText-muted tracking-wider mb-1.5">
              Citizen Problem Description
            </h4>
            <p className="text-xs text-brandText leading-relaxed">
              {complaint.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <h4 className="text-xs font-bold uppercase text-brandText-muted tracking-wider mb-1">
                Location & Landmarks
              </h4>
              <p className="text-xs text-brandText flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                {complaint.address || 'Street coordinates captured via GPS'}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-brandText-muted tracking-wider mb-1">
                Department SLA Window
              </h4>
              <p className="text-xs text-brandText flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                {complaint.category?.slaHours || 48} Hours target turnaround
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Staff Actions & Progress Notes */}
      <Card title="Technician Actions & Resolution Updates">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brandText mb-1.5">
              Add Field Note / Work Status Update
            </label>
            <textarea
              rows={3}
              placeholder="Record arrival on site, materials used, inspection findings..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full rounded-xl border border-border-light p-3 text-xs text-brandText focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-light">
            <div className="text-xs text-brandText-muted">
              Select next state to dispatch update:
            </div>

            <div className="flex items-center gap-2">
              {complaint.status === 'assigned' && (
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus('in_progress')}
                >
                  <Wrench className="w-3.5 h-3.5 mr-1" /> Mark In Progress
                </Button>
              )}

              {complaint.status === 'in_progress' && (
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus('resolved')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Camera className="w-3.5 h-3.5 mr-1" /> Submit Resolution & Close
                </Button>
              )}

              {complaint.status === 'resolved' && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> This order has been completed.
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
