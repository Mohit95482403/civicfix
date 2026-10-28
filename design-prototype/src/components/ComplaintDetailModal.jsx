import React, { useState } from 'react';
import { 
  X, MapPin, Calendar, Clock, AlertTriangle, CheckCircle2, 
  MessageSquare, User, Building2, Send, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { STATUS_CONFIG, formatDateTime, timeAgo } from '../data/mockData';

export default function ComplaintDetailModal({ complaint, onClose, onAddComment, onUpdateStatus, currentRole }) {
  const [commentText, setCommentText] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  if (!complaint) return null;

  const statusInfo = STATUS_CONFIG[complaint.status] || { label: complaint.status, badgeClass: 'badge-submitted' };

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(complaint.id, {
      author: currentRole === 'CITIZEN' ? 'You (Citizen)' : currentRole === 'STAFF' ? 'Ramesh Kumar (Staff)' : 'City Admin',
      role: currentRole,
      text: commentText.trim(),
      date: new Date().toISOString(),
      isInternal: currentRole !== 'CITIZEN' && isInternal,
    });
    setCommentText('');
  };

  return (
    <div className="proto-modal-backdrop" onClick={onClose}>
      <div className="proto-modal-card" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="proto-modal-header" style={{ background: '#F8FAFC' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.5px' }}>
                {complaint.reference}
              </span>
              <span className={`badge ${statusInfo.badgeClass}`}>
                {statusInfo.icon} {statusInfo.label}
              </span>
              <span className="badge" style={{ background: complaint.priority === 'URGENT' ? '#FEE2E2' : '#FEF3C7', color: complaint.priority === 'URGENT' ? '#C83B3B' : '#B7791F' }}>
                {complaint.priority}
              </span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1E293B', lineHeight: 1.3 }}>
              {complaint.title}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="btn-ghost" 
            style={{ padding: '6px', borderRadius: '50%' }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="proto-modal-body">
          {/* Metadata Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '12px',
            background: '#F1F5F9',
            padding: '12px 16px',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Building2 size={16} color="#64748B" />
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>CATEGORY & DEPT</div>
                <div style={{ fontWeight: 600, color: '#1E293B' }}>{complaint.category.name}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <User size={16} color="#64748B" />
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>REPORTED BY</div>
                <div style={{ fontWeight: 600, color: '#1E293B' }}>{complaint.citizen?.name || 'Citizen'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Clock size={16} color="#64748B" />
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>SLA TARGET DUE</div>
                <div style={{ fontWeight: 600, color: '#1E293B' }}>{formatDateTime(complaint.slaDueAt)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <ShieldCheck size={16} color="#64748B" />
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>ASSIGNED OFFICER</div>
                <div style={{ fontWeight: 600, color: '#1E293B' }}>
                  {complaint.staff ? complaint.staff.name : 'Unassigned'}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>DESCRIPTION</h4>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#1E293B' }}>
              {complaint.description}
            </p>
          </div>

          {/* Location Bar */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 14px', borderRadius: '8px' }}>
            <MapPin size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{complaint.location.address}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                GPS: {complaint.location.lat.toFixed(4)}, {complaint.location.lng.toFixed(4)}
              </div>
            </div>
          </div>

          {/* Evidence Photos Simulation */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>ATTACHED EVIDENCE</h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ 
                width: '140px', 
                height: '100px', 
                borderRadius: '8px', 
                background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)',
                border: '1px solid #CBD5E1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                fontSize: '11px',
                color: '#475569',
                fontWeight: 500
              }}>
                <span style={{ fontSize: '24px' }}>📷</span>
                <span>Report Photo 1</span>
              </div>
              {complaint.status === 'RESOLVED' || complaint.status === 'CLOSED' ? (
                <div style={{ 
                  width: '140px', 
                  height: '100px', 
                  borderRadius: '8px', 
                  background: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
                  border: '1px solid #86EFAC',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: '#166534',
                  fontWeight: 600
                }}>
                  <span style={{ fontSize: '24px' }}>✅</span>
                  <span>Fix Evidence (Proof)</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Status Timeline */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '12px' }}>AUDIT & STATUS TIMELINE</h4>
            <div className="timeline-list">
              {complaint.timeline.map((event, idx) => (
                <div className="timeline-item" key={idx}>
                  <div className={`timeline-dot ${idx === 0 ? 'completed' : ''}`} />
                  <div className="timeline-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="timeline-title">{event.status.replace('_', ' ')}</span>
                      <span className="timeline-time">{timeAgo(event.date)} ({formatDateTime(event.date)})</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>By: <strong>{event.actor}</strong></div>
                    {event.remark && <div className="timeline-remark">{event.remark}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Thread */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={15} /> COMMENTS & CITIZEN UPDATES ({complaint.comments?.length || 0})
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {(!complaint.comments || complaint.comments.length === 0) ? (
                <div style={{ fontSize: '13px', color: '#94A3B8', fontStyle: 'italic', padding: '8px 0' }}>
                  No comments posted yet.
                </div>
              ) : (
                complaint.comments.map((c, i) => (
                  <div key={i} style={{ 
                    background: c.isInternal ? '#FFFBEB' : '#F8FAFC', 
                    border: `1px solid ${c.isInternal ? '#FDE68A' : '#E2E8F0'}`, 
                    padding: '8px 12px', 
                    borderRadius: '8px' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#1E293B' }}>{c.author}</span>
                        {c.isInternal && (
                          <span style={{ fontSize: '10px', background: '#FEF3C7', color: '#92400E', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            INTERNAL NOTE
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{timeAgo(c.date)}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#334155' }}>{c.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Post comment input */}
            <form onSubmit={handleSendComment} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder={currentRole === 'CITIZEN' ? "Ask for an update or provide more details..." : "Add a public update or internal remark..."}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 16px' }} disabled={!commentText.trim()}>
                  <Send size={16} />
                </button>
              </div>
              {currentRole !== 'CITIZEN' && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={isInternal} 
                    onChange={(e) => setIsInternal(e.target.checked)} 
                  />
                  Mark as internal municipal note (hidden from citizen)
                </label>
              )}
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="proto-modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          {currentRole === 'STAFF' && complaint.status === 'ASSIGNED' && (
            <button 
              className="btn btn-primary"
              onClick={() => {
                onUpdateStatus(complaint.id, 'IN_PROGRESS', 'Field technician started inspection & work on site.');
              }}
            >
              Start Work (In Progress)
            </button>
          )}
          {currentRole === 'STAFF' && complaint.status === 'IN_PROGRESS' && (
            <button 
              className="btn btn-primary"
              style={{ background: '#16845B' }}
              onClick={() => {
                onUpdateStatus(complaint.id, 'RESOLVED', 'Issue resolved. Mandatory repair photo uploaded and verified on site.');
              }}
            >
              Mark as Resolved (Upload Proof)
            </button>
          )}
          {currentRole === 'CITIZEN' && complaint.status === 'RESOLVED' && (
            <button 
              className="btn btn-primary"
              style={{ background: '#16845B' }}
              onClick={() => {
                onUpdateStatus(complaint.id, 'CLOSED', 'Citizen verified resolution and closed ticket.');
              }}
            >
              Accept & Close Complaint (5★)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
