import React, { useState } from 'react';
import { 
  Building2, Users, AlertTriangle, CheckCircle2, Clock, 
  Search, ShieldAlert, ArrowUpRight, Filter, ChevronRight, 
  Settings, History, UserCheck, Layers 
} from 'lucide-react';
import { 
  DASHBOARD_METRICS, DEPARTMENTS, STAFF_MEMBERS, 
  STATUS_CONFIG, AUDIT_LOGS, CATEGORIES, formatDateTime, timeAgo 
} from '../data/mockData';

export default function AdminView({ 
  complaints, 
  onSelectComplaint, 
  onAssignStaff, 
  onUpdateStatus 
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('TRIAGE'); // 'TRIAGE', 'DEPARTMENTS', 'AUDIT'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [assigningComplaint, setAssigningComplaint] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(STAFF_MEMBERS[0].id);

  const filteredComplaints = complaints.filter((item) => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.reference.toLowerCase().includes(q) ||
        item.category.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assigningComplaint) return;
    const staff = STAFF_MEMBERS.find((s) => s.id === selectedStaffId);
    if (!staff) return;

    onAssignStaff(assigningComplaint.id, staff);
    setAssigningComplaint(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Cards Row */}
      <div className="grid-metrics">
        <div className="metric-card">
          <div className="metric-header">
            <span>TOTAL COMPLAINTS</span>
            <Layers size={18} color="var(--color-primary)" />
          </div>
          <div className="metric-value">{DASHBOARD_METRICS.total + (complaints.length - 6)}</div>
          <div className="metric-sub" style={{ color: '#16845B' }}>
            <span>↑ 12% vs last month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>PENDING TRIAGE / REVIEW</span>
            <AlertTriangle size={18} color="#B7791F" />
          </div>
          <div className="metric-value" style={{ color: '#B7791F' }}>
            {complaints.filter(c => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length}
          </div>
          <div className="metric-sub">
            <span>Needs supervisor dispatch</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>AVG RESOLUTION TURNAROUND</span>
            <Clock size={18} color="#2463B5" />
          </div>
          <div className="metric-value">{DASHBOARD_METRICS.avgTurnaroundHours} hrs</div>
          <div className="metric-sub" style={{ color: '#16845B' }}>
            <span>Within 48h SLA target</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>CITIZEN SATISFACTION</span>
            <CheckCircle2 size={18} color="#16845B" />
          </div>
          <div className="metric-value" style={{ color: '#16845B' }}>
            {DASHBOARD_METRICS.satisfactionRating} / 5.0
          </div>
          <div className="metric-sub">
            <span>94% closure approval rating</span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
        <button
          type="button"
          onClick={() => setActiveAdminTab('TRIAGE')}
          className={`btn btn-sm ${activeAdminTab === 'TRIAGE' ? 'btn-primary' : 'btn-ghost'}`}
        >
          <Layers size={14} /> Complaints Management & Triage
        </button>
        <button
          type="button"
          onClick={() => setActiveAdminTab('DEPARTMENTS')}
          className={`btn btn-sm ${activeAdminTab === 'DEPARTMENTS' ? 'btn-primary' : 'btn-ghost'}`}
        >
          <Building2 size={14} /> Departments & SLA Rules
        </button>
        <button
          type="button"
          onClick={() => setActiveAdminTab('AUDIT')}
          className={`btn btn-sm ${activeAdminTab === 'AUDIT' ? 'btn-primary' : 'btn-ghost'}`}
        >
          <History size={14} /> System Audit Trail ({AUDIT_LOGS.length})
        </button>
      </div>

      {/* Tab 1: Complaints Triage Table */}
      {activeAdminTab === 'TRIAGE' && (
        <div className="table-container">
          <div className="table-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>FILTER:</span>
              {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '11px', padding: '4px 10px' }}
                  onClick={() => setStatusFilter(st)}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search ref, title, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '32px', height: '34px', fontSize: '12px' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                      No complaints match the filter.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((item) => {
                    const statusBadge = STATUS_CONFIG[item.status] || { label: item.status, badgeClass: 'badge-submitted' };
                    return (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 600, color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>
                          {item.reference}
                        </td>
                        <td style={{ maxWidth: '300px' }}>
                          <div style={{ fontWeight: 600, color: '#1E293B', marginBottom: '2px' }}>{item.title}</div>
                          <div style={{ fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.location.address}
                          </div>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span style={{ marginRight: '4px' }}>{item.category.icon}</span>
                          {item.category.name}
                        </td>
                        <td>
                          <span className={`badge ${statusBadge.badgeClass}`}>
                            {statusBadge.icon} {statusBadge.label}
                          </span>
                        </td>
                        <td>
                          <span className="badge" style={{ 
                            background: item.priority === 'URGENT' ? '#FEE2E2' : '#FEF3C7', 
                            color: item.priority === 'URGENT' ? '#C83B3B' : '#B7791F' 
                          }}>
                            {item.priority}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                          {item.staff ? (
                            <span style={{ fontWeight: 500, color: '#1E293B' }}>{item.staff.name}</span>
                          ) : (
                            <span style={{ color: '#B7791F', fontStyle: 'italic' }}>Unassigned</span>
                          )}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => onSelectComplaint(item)}
                            >
                              Inspect
                            </button>
                            {(!item.staff || item.status === 'SUBMITTED' || item.status === 'UNDER_REVIEW') && (
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => setAssigningComplaint(item)}
                              >
                                <UserCheck size={13} /> Assign
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Departments & SLA Rules */}
      {activeAdminTab === 'DEPARTMENTS' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          <div className="table-container">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', fontWeight: 600, fontSize: '15px' }}>
              Municipal Departments & Head Officers
            </div>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Head Officer</th>
                  <th>Active Staff</th>
                  <th>Active Tickets</th>
                </tr>
              </thead>
              <tbody>
                {DEPARTMENTS.map((dept) => (
                  <tr key={dept.id}>
                    <td style={{ fontWeight: 600 }}>{dept.name}</td>
                    <td style={{ color: '#64748B' }}>{dept.head}</td>
                    <td>{dept.staffCount} officers</td>
                    <td>
                      <span className="badge badge-submitted">{dept.activeComplaints} issues</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-container">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', fontWeight: 600, fontSize: '15px' }}>
              Service Level Agreement (SLA) Matrix
            </div>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Default SLA</th>
                  <th>Priority</th>
                  <th>Responsible Unit</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((cat) => (
                  <tr key={cat.id}>
                    <td style={{ fontWeight: 600 }}>
                      <span style={{ marginRight: '6px' }}>{cat.icon}</span>
                      {cat.name}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{cat.sla} Hours</td>
                    <td>
                      <span className="badge" style={{ 
                        background: cat.priority === 'URGENT' ? '#FEE2E2' : '#FEF3C7', 
                        color: cat.priority === 'URGENT' ? '#C83B3B' : '#B7791F' 
                      }}>
                        {cat.priority}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: '#64748B' }}>{cat.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Audit Trail */}
      {activeAdminTab === 'AUDIT' && (
        <div className="table-container">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', fontWeight: 600, fontSize: '15px' }}>
            System-Wide Audit Log (DPDP & Governance Compliant)
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Event Action</th>
                <th>Target Resource</th>
                <th>Audit Detail</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_LOGS.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td style={{ fontWeight: 600, color: '#1E293B' }}>{log.actor}</td>
                  <td>
                    <span className="badge badge-assigned" style={{ fontSize: '11px' }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{log.resource}</td>
                  <td style={{ color: '#475569', fontSize: '13px' }}>{log.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Staff Modal */}
      {assigningComplaint && (
        <div className="proto-modal-backdrop" onClick={() => setAssigningComplaint(null)}>
          <div className="proto-modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="proto-modal-header">
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  DISPATCH TECHNICIAN
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1E293B' }}>
                  Assign: {assigningComplaint.reference}
                </h3>
              </div>
              <button onClick={() => setAssigningComplaint(null)} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignSubmit}>
              <div className="proto-modal-body">
                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  Issue: <strong>{assigningComplaint.title}</strong>
                </div>

                <div className="form-group">
                  <label className="form-label">SELECT FIELD TECHNICIAN *</label>
                  <select 
                    className="form-select"
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                  >
                    {STAFF_MEMBERS.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} — {staff.department} ({staff.activeComplaints} active tasks)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="proto-modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setAssigningComplaint(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Assignment & Notify Technician
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
