import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { complaintsService, COMPLAINT_CATEGORIES } from '../../services/complaints.service';
import { Complaint } from '../../types/complaint';
import { 
  ArrowRight, Search, Wrench, Building2, CheckCircle2 
} from 'lucide-react';
import { formatStatusLabel, getStatusBadgeVariant } from '../../utils/formatters';

export function LandingPage() {

  const [trackQuery, setTrackQuery] = useState('');
  const [trackedComplaint, setTrackedComplaint] = useState<Complaint | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    try {
      const complaint = await complaintsService.getComplaintById(trackQuery.trim());
      if (complaint) {
        setTrackedComplaint(complaint);
        setIsModalOpen(true);
      } else {
        setSearchError('No complaint found with this reference number. Example: CF-2026-BLR-001042');
      }
    } catch {
      setSearchError('Failed to retrieve ticket status.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-16 py-8 sm:py-14 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-primary-blue">
          <span className="w-2 h-2 rounded-full bg-primary-blue animate-pulse" />
          <span>Unified Civic Problem Reporting & Resolution Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brandText-primary tracking-tight leading-tight">
          Report It. Track It. <br />
          <span className="text-primary-blue">Improve Your City.</span>
        </h1>

        <p className="text-base sm:text-lg text-brandText-secondary leading-relaxed">
          CivicFix bridges the gap between citizens and municipal maintenance crews. 
          Report road craters, overflowing waste, or broken streetlights with verified photo proof and live GPS tracking.
        </p>

        {/* Quick Ticket Tracking Box */}
        <div className="pt-2 max-w-xl mx-auto">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Enter Complaint ID (e.g., CF-2026-BLR-001042)"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white shadow-sm"
              />
            </div>
            <Button type="submit" variant="primary" size="md" isLoading={isSearching} className="py-3 px-6 rounded-xl">
              Track Status
            </Button>
          </form>
          {searchError && (
            <p className="text-xs text-semantic-error mt-2 font-medium">{searchError}</p>
          )}
        </div>
      </section>

      {/* Three Portals Entry Grid */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brandText-primary">Three Integrated Roles. One Unified Engine.</h2>
          <p className="text-sm text-brandText-secondary mt-1">
            Seamless collaboration between residents, field technicians, and city governance officials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Citizen Portal Card */}
          <Card hoverable className="p-6 flex flex-col justify-between border-blue-100 bg-gradient-to-b from-white to-blue-50/20">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-primary-blue flex items-center justify-center font-bold text-xl">
                🏘️
              </div>
              <h3 className="text-lg font-bold text-brandText-primary">Citizen Portal</h3>
              <p className="text-xs text-brandText-secondary leading-relaxed">
                Submit complaints with camera photos & GPS pin drop. Receive unique tracking codes, monitor resolution progress, and rate work quality.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">✓ Photo & GPS coordinate evidence</li>
                <li className="flex items-center gap-2">✓ Live municipal SLA countdowns</li>
                <li className="flex items-center gap-2">✓ Automated status update alerts</li>
              </ul>
            </div>
            <div className="pt-6">
              <Link to="/citizen/dashboard" className="block w-full">
                <Button variant="primary" fullWidth icon={<ArrowRight size={14} />}>
                  Access Citizen Portal
                </Button>
              </Link>
            </div>
          </Card>

          {/* Staff Portal Card */}
          <Card hoverable className="p-6 flex flex-col justify-between border-amber-100 bg-gradient-to-b from-white to-amber-50/20">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
                👷
              </div>
              <h3 className="text-lg font-bold text-brandText-primary">Staff Field Portal</h3>
              <p className="text-xs text-brandText-secondary leading-relaxed">
                Field technicians and work order supervisors view assigned tasks, update real-time progress, add internal notes, and upload repair proof.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">✓ Work order triage & shift queues</li>
                <li className="flex items-center gap-2">✓ Mandatory photo evidence upload</li>
                <li className="flex items-center gap-2">✓ Department-scoped assignments</li>
              </ul>
            </div>
            <div className="pt-6">
              <Link to="/staff/dashboard" className="block w-full">
                <Button variant="secondary" fullWidth icon={<Wrench size={14} />}>
                  Access Staff Portal
                </Button>
              </Link>
            </div>
          </Card>

          {/* Admin Console Card */}
          <Card hoverable className="p-6 flex flex-col justify-between border-emerald-100 bg-gradient-to-b from-white to-emerald-50/20">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                🏛️
              </div>
              <h3 className="text-lg font-bold text-brandText-primary">Admin Governance</h3>
              <p className="text-xs text-brandText-secondary leading-relaxed">
                Municipal corporation executives manage departments, dispatch field teams, audit resolution times, and inspect immutable DPDP audit logs.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">✓ City-wide complaint triage & SLA</li>
                <li className="flex items-center gap-2">✓ Technician onboarding & provisioning</li>
                <li className="flex items-center gap-2">✓ DPDP Act compliant audit logs</li>
              </ul>
            </div>
            <div className="pt-6">
              <Link to="/admin/dashboard" className="block w-full">
                <Button variant="outline" fullWidth icon={<Building2 size={14} />}>
                  Access Admin Console
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brandText-primary">Public Problem Categories</h2>
          <p className="text-sm text-brandText-secondary mt-1">
            Standardized categories mapped to responsible municipal departments.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {COMPLAINT_CATEGORIES.map((cat) => (
            <Card key={cat.id} hoverable className="p-4 text-center space-y-2">
              <div className="text-3xl">{cat.icon}</div>
              <div className="font-semibold text-xs text-brandText-primary">{cat.name}</div>
              <div className="text-[10px] text-brandText-tertiary">SLA: {cat.slaHours}h target</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Tracking Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={trackedComplaint?.referenceNumber || 'Complaint Tracking Details'}
        subtitle="Live status from municipal dispatch ledger"
      >
        {trackedComplaint && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{trackedComplaint.categoryIcon || '📌'}</span>
                <div>
                  <h4 className="text-sm font-bold text-brandText-primary">{trackedComplaint.category?.name || 'Infrastructure'}</h4>
                  <p className="text-xs text-brandText-secondary">{trackedComplaint.departmentName}</p>
                </div>
              </div>
              <Badge variant={getStatusBadgeVariant(trackedComplaint.status)} hasDot>
                {formatStatusLabel(trackedComplaint.status)}
              </Badge>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-brandText-secondary uppercase">Problem Description</h5>
              <p className="text-sm text-brandText-primary bg-slate-50 p-3 rounded-lg border border-slate-200/60 leading-relaxed">
                {trackedComplaint.title}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                <span className="text-brandText-tertiary block mb-1">Reported Location</span>
                <span className="font-semibold text-brandText-primary">{trackedComplaint.locationAddress}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                <span className="text-brandText-tertiary block mb-1">Assigned Technician</span>
                <span className="font-semibold text-brandText-primary">{trackedComplaint.assignedStaffName || 'Under Triage'}</span>
              </div>
            </div>

            {trackedComplaint.resolutionNotes && (
              <div className="space-y-1.5 bg-emerald-50 p-3 rounded-lg border border-emerald-200/70 text-xs text-emerald-900">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-700" />
                  Field Technician Progress Note
                </span>
                <p>{trackedComplaint.resolutionNotes}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Close Tracking
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
