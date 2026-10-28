import React, { useState } from 'react';
import { X, Camera, MapPin, AlertTriangle, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function NewComplaintModal({ onClose, onSubmitComplaint }) {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [address, setAddress] = useState('12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru');
  const [hasPhoto, setHasPhoto] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newRef = `CF-2026-BLR-00${Math.floor(1043 + Math.random() * 900)}`;
      const newComplaint = {
        id: `cmp-${Date.now()}`,
        reference: newRef,
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory,
        status: 'SUBMITTED',
        priority: priority,
        citizen: { name: 'You (Citizen)', avatar: '👤' },
        staff: null,
        location: {
          address: address,
          lat: 12.9716 + (Math.random() - 0.5) * 0.05,
          lng: 77.5946 + (Math.random() - 0.5) * 0.05,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slaDueAt: new Date(Date.now() + (selectedCategory.sla || 48) * 3600 * 1000).toISOString(),
        timeline: [
          {
            status: 'SUBMITTED',
            date: new Date().toISOString(),
            actor: 'You (Citizen)',
            remark: 'Complaint filed via Citizen Mobile App with photographic proof.',
          },
        ],
        comments: [],
      };

      onSubmitComplaint(newComplaint);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="proto-modal-backdrop" onClick={onClose}>
      <div className="proto-modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="proto-modal-header">
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              STEP {step} OF 3
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1E293B' }}>
              {step === 1 && 'Select Issue Category'}
              {step === 2 && 'Upload Photo & GPS Location'}
              {step === 3 && 'Issue Details & Review'}
            </h3>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="proto-modal-body">
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontSize: '13px', color: '#64748B' }}>
                Choose the department category that best describes the civic problem:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '16px 12px',
                      borderRadius: '12px',
                      border: selectedCategory.id === cat.id ? '2px solid var(--color-primary)' : '1px solid #E2E8F0',
                      background: selectedCategory.id === cat.id ? 'var(--color-primary-light)' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '28px' }}>{cat.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{cat.name}</span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>SLA: {cat.sla}h</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Photo Capture Simulator */}
              <div>
                <label className="form-label" style={{ marginBottom: '6px', display: 'block' }}>
                  ATTACH PHOTOGRAPHIC EVIDENCE (REQUIRED)
                </label>
                <div 
                  onClick={() => setHasPhoto(!hasPhoto)}
                  style={{
                    border: '2px dashed #CBD5E1',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    background: hasPhoto ? '#F0FDF4' : '#F8FAFC',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {hasPhoto ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                        <Check size={24} />
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#166534' }}>1 Photo Attached (Geo-tagged)</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>IMG_20261028_104231.jpg (2.4 MB) • Click to remove</div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <Camera size={36} color="var(--color-primary)" />
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>Click to capture or attach photo</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>JPEG, PNG up to 10MB</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Picker */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label">PINPOINT GPS LOCATION</label>
                  <button 
                    type="button" 
                    className="btn-ghost" 
                    style={{ fontSize: '11px', color: 'var(--color-primary)', padding: 0 }}
                    onClick={() => setAddress('100ft Ring Road, Near Metro Station, Bengaluru')}
                  >
                    📍 Use Current Device GPS
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    style={{ flex: 1 }}
                  />
                </div>
                <div style={{ 
                  marginTop: '10px', 
                  height: '110px', 
                  borderRadius: '8px', 
                  background: 'linear-gradient(135deg, #E2E8F0 0%, #D1D5DB 100%)', 
                  border: '1px solid #CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: '#475569',
                  fontSize: '13px'
                }}>
                  <MapPin size={20} color="#DC2626" />
                  <span>Map Pin Preview: 12.9716° N, 77.5946° E</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">COMPLAINT TITLE *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Deep pothole causing two-wheeler accidents"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">DETAILED DESCRIPTION *</label>
                <textarea 
                  className="form-textarea" 
                  rows={3}
                  placeholder="Describe the issue, landmarks, severity, and how long it has persisted..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">SEVERITY / URGENCY</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setPriority(lvl)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: priority === lvl ? '2px solid var(--color-primary)' : '1px solid #CBD5E1',
                        background: priority === lvl ? 'var(--color-primary-light)' : '#ffffff',
                        color: priority === lvl ? 'var(--color-primary)' : '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ 
                background: '#F8FAFC', 
                border: '1px solid #E2E8F0', 
                padding: '12px', 
                borderRadius: '8px',
                fontSize: '12px',
                color: '#64748B'
              }}>
                <div style={{ fontWeight: 600, color: '#1E293B', marginBottom: '2px' }}>
                  Target Resolution Time: {selectedCategory.sla} Hours
                </div>
                Assigned to: <strong>{selectedCategory.department}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="proto-modal-footer">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={handleBack} disabled={isSubmitting}>
              <ArrowLeft size={16} /> Back
            </button>
          )}
          {step < 3 ? (
            <button className="btn btn-primary" onClick={handleNext}>
              Next Step <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit} 
              disabled={isSubmitting || !title.trim() || !description.trim()}
              style={{ background: '#176B5B' }}
            >
              {isSubmitting ? 'Submitting Issue...' : 'Submit Civic Complaint'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
