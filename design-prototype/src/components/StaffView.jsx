import React, { useState } from 'react';
import { 
  Wrench, CheckCircle2, Clock, AlertTriangle, MapPin, 
  ChevronRight, Camera, Upload, Filter, Search, ArrowUpRight 
} from 'lucide-react';
import { STATUS_CONFIG, formatDateTime, timeAgo } from '../data/mockData';

export default function StaffView({ complaints, onSelectComplaint, onUpdateStatus }) {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [resolutionModalComplaint, setResolutionModalComplaint] = useState(null);
  const [resolutionRemark, setResolutionRemark] = useState('');
  const [hasEvidencePhoto, setHasEvidencePhoto] = useState(true);

  // Filter complaints assigned to staff
  const staffComplaints = complaints.filter((item) => {
    if (activeTab === 'ASSIGNED' && item.status !== 'ASSIGNED') return false;
    if (activeTab === 'IN_PROGRESS' && item.status !== 'IN_PROGRESS') return false;
    if (activeTab === 'RESOLVED' && item.status !== 'RESOLVED' && item.status !== 'CLOSED') return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.reference.toLowerCase().includes(q) ||
        item.location.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (!resolutionModalComplaint || !resolutionRemark.trim()) return;

    onUpdateStatus(
      resolutionModalComplaint.id,
      'RESOLVED',
      `Field Resolution: ${resolutionRemark.trim()} (Evidence photo verified)`
    );
    setResolutionModalComplaint(null);
    setResolutionRemark('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner / Staff Identity */}
      <div style={{ 
        background: '#ffffff', 
        border: '1px solid #E2E8F0', 
        borderRadius: '12px', 
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            background: 'var(--color-primary-light)', 
            color: 'var(--color-primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '22px'
          }}>
            👷‍♂️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B' }}>Ramesh Kumar</h2>
              <span className="badge badge-verified">Active Field Technician</span>
            </div>
            <div style={{ fontSize: '13px', color: '#64748B' }}>
              Department: <strong>Roads & Infrastructure</strong> • Unit #BLR-NORTH-4
            </div>
          </div>
        </div>

        {/* Quick Metrics */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>ASSIGNED WORK ORDERS</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)' }}>
              {complaints.filter(c => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS').length}
            </div>
          </div>
          <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '20px' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>RESOLVED THIS WEEK</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#16845B' }}>18</div>
          </div>
          <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '20px' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>SLA COMPLIANCE</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>94.2%</div>
          </div>
        </div>
      </div>

      {/* Main Queue Card */}
      <div className="table-container">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              type="button"
              className={`btn btn-sm ${activeTab === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('ALL')}
            >
              All Assigned ({complaints.length})
            </button>
            <button 
              type="button"
              className={`btn btn-sm ${activeTab === 'ASSIGNED' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('ASSIGNED')}
            >
              Pending Start
            </button>
            <button 
              type="button"
              className={`btn btn-sm ${activeTab === 'IN_PROGRESS' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('IN_PROGRESS')}
            >
              In Progress
            </button>
            <button 
              type="button"
              className={`btn btn-sm ${activeTab === 'RESOLVED' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('RESOLVED')}
            >
              Resolved
            </button>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search assigned tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '32px', height: '34px', fontSize: '12px' }}
            />
          </div>
        </div>

        {/* Work Orders List */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {staffComplaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: '#94A3B8' }}>
              <CheckCircle2 size={36} color="#16845B" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 600, color: '#1E293B' }}>No pending tasks in this filter</div>
              <div style={{ fontSize: '12px' }}>All caught up! Great job maintaining civic infrastructure.</div>
            </div>
          ) : (
            staffComplaints.map((item) => {
              const statusBadge = STATUS_CONFIG[item.status] || { label: item.status, badgeClass: 'badge-submitted' };
              const isUrgent = item.priority === 'URGENT';

              return (
                <div 
                  key={item.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    transition: 'all 0.15s ease',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1, minWidth: '280px' }}>
                    <div style={{ 
                      width: '42px', 
                      height: '42px', 
                      borderRadius: '8px', 
                      background: '#F1F5F9', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '22px',
                      flexShrink: 0
                    }}>
                      {item.category.icon}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
                          {item.reference}
                        </span>
                        <span className={`badge ${statusBadge.badgeClass}`}>
                          {statusBadge.icon} {statusBadge.label}
                        </span>
                        <span className="badge" style={{ background: isUrgent ? '#FEE2E2' : '#FEF3C7', color: isUrgent ? '#C83B3B' : '#B7791F' }}>
                          {item.priority}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1E293B' }}>
                        {item.title}
                      </h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#64748B' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} color="var(--color-primary)" /> {item.location.address}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> Target SLA: {formatDateTime(item.slaDueAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Technician Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectComplaint(item)}
                    >
                      View Details
                    </button>

                    {item.status === 'ASSIGNED' && (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          onUpdateStatus(item.id, 'IN_PROGRESS', 'Technician Ramesh Kumar initiated on-site repair.');
                        }}
                      >
                        <Wrench size={14} /> Start Repair
                      </button>
                    )}

                    {item.status === 'IN_PROGRESS' && (
                      <button 
                        className="btn btn-primary btn-sm"
                        style={{ background: '#16845B' }}
                        onClick={() => setResolutionModalComplaint(item)}
                      >
                        <CheckCircle2 size={14} /> Complete & Upload Proof
                      </button>
                    )}

                    {item.status === 'RESOLVED' && (
                      <span style={{ fontSize: '12px', color: '#16845B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> Resolved (Pending Citizen Closure)
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Resolution & Mandatory Evidence Upload Modal */}
      {resolutionModalComplaint && (
        <div className="proto-modal-backdrop" onClick={() => setResolutionModalComplaint(null)}>
          <div className="proto-modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="proto-modal-header">
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#16845B' }}>
                  RESOLUTION EVIDENCE SUBMISSION
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1E293B' }}>
                  Complete Work: {resolutionModalComplaint.reference}
                </h3>
              </div>
              <button onClick={() => setResolutionModalComplaint(null)} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleResolveSubmit}>
              <div className="proto-modal-body">
                <div>
                  <label className="form-label">RESOLUTION REMARKS & ACTIONS TAKEN *</label>
                  <textarea 
                    className="form-textarea" 
                    rows={3} 
                    placeholder="Describe how the repair was conducted (e.g., asphalt patch filled, compacted, street debris cleared)..."
                    value={resolutionRemark}
                    onChange={(e) => setResolutionRemark(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">MANDATORY PROOF-OF-WORK PHOTOGRAPH *</label>
                  <div 
                    onClick={() => setHasEvidencePhoto(!hasEvidencePhoto)}
                    style={{
                      border: '2px dashed #86EFAC',
                      borderRadius: '10px',
                      padding: '20px',
                      textAlign: 'center',
                      background: hasEvidencePhoto ? '#F0FDF4' : '#F8FAFC',
                      cursor: 'pointer'
                    }}
                  >
                    {hasEvidencePhoto ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={32} color="#16845B" />
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#166534' }}>
                          After-Repair Photo Attached
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          REPAIR_PROOF_20261028_1042.jpg (3.1 MB)
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <Camera size={32} color="#64748B" />
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                          Click to snap resolution proof photo
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="proto-modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setResolutionModalComplaint(null)}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ background: '#16845B' }}
                  disabled={!resolutionRemark.trim() || !hasEvidencePhoto}
                >
                  Confirm & Mark Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
