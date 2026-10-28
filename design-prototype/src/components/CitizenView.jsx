import React, { useState } from 'react';
import { 
  Plus, Search, MapPin, Filter, Bell, Clock, ChevronRight, 
  Smartphone, Monitor, ThumbsUp, MessageSquare, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { CATEGORIES, STATUS_CONFIG, timeAgo } from '../data/mockData';

export default function CitizenView({ 
  complaints, 
  onSelectComplaint, 
  onOpenNewReport, 
  activeFilter, 
  setActiveFilter 
}) {
  const [deviceMode, setDeviceMode] = useState(true); // true = phone frame, false = wide
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeTab, setActiveTab] = useState('FEED'); // 'FEED' or 'MY_REPORTS'

  const filteredComplaints = complaints.filter((item) => {
    if (activeTab === 'MY_REPORTS' && !item.citizen?.name.includes('Priya') && !item.citizen?.name.includes('You')) {
      return false;
    }
    if (selectedCategory !== 'ALL' && item.category.name !== selectedCategory) {
      return false;
    }
    if (activeFilter !== 'ALL' && item.status !== activeFilter) {
      return false;
    }
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

  const renderContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Citizen App Top Bar */}
      <div style={{ 
        background: '#ffffff', 
        padding: '12px 16px', 
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '8px', 
            background: 'var(--color-primary)', 
            color: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 700 
          }}>
            CF
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={11} color="var(--color-primary)" /> Koramangala, Bengaluru
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>CivicFix Mobile</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="btn-ghost" 
            style={{ padding: '6px', borderRadius: '50%', position: 'relative' }}
            title="Notifications"
          >
            <Bell size={18} color="#475569" />
            <span style={{ 
              position: 'absolute', 
              top: '4px', 
              right: '4px', 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: '#C83B3B' 
            }} />
          </button>
        </div>
      </div>

      {/* Hero / Quick Action Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #176B5B 0%, #115447 100%)', 
        color: '#ffffff', 
        padding: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
            Spot a public problem?
          </h3>
          <p style={{ fontSize: '12px', color: '#E2E8F0', opacity: 0.9 }}>
            Take a photo, tag GPS & track resolution.
          </p>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={onOpenNewReport}
          style={{ 
            background: '#ffffff', 
            color: 'var(--color-primary)', 
            borderColor: '#ffffff',
            padding: '8px 14px', 
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          <Plus size={14} /> Report Issue
        </button>
      </div>

      {/* Tabs & Search */}
      <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button" 
            onClick={() => setActiveTab('FEED')}
            style={{ 
              flex: 1, 
              padding: '6px', 
              fontSize: '12px', 
              fontWeight: 600, 
              borderRadius: '6px',
              border: activeTab === 'FEED' ? '1px solid var(--color-primary)' : '1px solid transparent',
              background: activeTab === 'FEED' ? '#ffffff' : 'transparent',
              color: activeTab === 'FEED' ? 'var(--color-primary)' : '#64748B',
              cursor: 'pointer'
            }}
          >
            Nearby Civic Issues
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('MY_REPORTS')}
            style={{ 
              flex: 1, 
              padding: '6px', 
              fontSize: '12px', 
              fontWeight: 600, 
              borderRadius: '6px',
              border: activeTab === 'MY_REPORTS' ? '1px solid var(--color-primary)' : '1px solid transparent',
              background: activeTab === 'MY_REPORTS' ? '#ffffff' : 'transparent',
              color: activeTab === 'MY_REPORTS' ? 'var(--color-primary)' : '#64748B',
              cursor: 'pointer'
            }}
          >
            My Submitted Reports
          </button>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by street or ref (e.g. CF-2026)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '32px', fontSize: '13px', height: '36px' }}
          />
        </div>

        {/* Categories Chips */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            style={{
              padding: '4px 10px',
              borderRadius: '16px',
              fontSize: '11px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              border: selectedCategory === 'ALL' ? '1px solid var(--color-primary)' : '1px solid #CBD5E1',
              background: selectedCategory === 'ALL' ? 'var(--color-primary)' : '#ffffff',
              color: selectedCategory === 'ALL' ? '#ffffff' : '#475569',
              cursor: 'pointer'
            }}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                border: selectedCategory === cat.name ? '1px solid var(--color-primary)' : '1px solid #CBD5E1',
                background: selectedCategory === cat.name ? 'var(--color-primary)' : '#ffffff',
                color: selectedCategory === cat.name ? '#ffffff' : '#475569',
                cursor: 'pointer'
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredComplaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 16px', color: '#94A3B8' }}>
            <AlertCircle size={36} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
            <div style={{ fontWeight: 600, color: '#64748B' }}>No complaints found</div>
            <div style={{ fontSize: '12px' }}>Try adjusting your search query or filter</div>
          </div>
        ) : (
          filteredComplaints.map((item) => {
            const statusBadge = STATUS_CONFIG[item.status] || { label: item.status, badgeClass: 'badge-submitted' };
            return (
              <div 
                key={item.id}
                onClick={() => onSelectComplaint(item)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '18px' }}>{item.category.icon}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>{item.category.name}</span>
                  </div>
                  <span className={`badge ${statusBadge.badgeClass}`} style={{ fontSize: '11px', padding: '2px 8px' }}>
                    {statusBadge.icon} {statusBadge.label}
                  </span>
                </div>

                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '2px', lineHeight: 1.4 }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#64748B', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={12} /> {item.location.address.split(',')[0]}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={12} /> {timeAgo(item.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Citizen App Bottom Navigation */}
      <div className="phone-bottom-nav">
        <button className={`phone-nav-item ${activeTab === 'FEED' ? 'active' : ''}`} onClick={() => setActiveTab('FEED')}>
          <Monitor size={18} />
          <span>Feed</span>
        </button>
        <button className="phone-fab" onClick={onOpenNewReport} title="File Complaint">
          <Plus size={24} />
        </button>
        <button className={`phone-nav-item ${activeTab === 'MY_REPORTS' ? 'active' : ''}`} onClick={() => setActiveTab('MY_REPORTS')}>
          <CheckCircle2 size={18} />
          <span>My Reports</span>
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Device Mode Toggle Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: '#ffffff', 
          border: '1px solid #E2E8F0', 
          borderRadius: '24px', 
          padding: '4px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <button
            type="button"
            onClick={() => setDeviceMode(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              background: deviceMode ? 'var(--color-primary)' : 'transparent',
              color: deviceMode ? '#ffffff' : '#64748B',
              cursor: 'pointer'
            }}
          >
            <Smartphone size={14} /> Mobile Phone Simulation
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              background: !deviceMode ? 'var(--color-primary)' : 'transparent',
              color: !deviceMode ? '#ffffff' : '#64748B',
              cursor: 'pointer'
            }}
          >
            <Monitor size={14} /> Full Responsive Web View
          </button>
        </div>
      </div>

      {/* Frame Container */}
      {deviceMode ? (
        <div className="device-simulator-wrapper">
          <div className="smartphone-frame">
            <div className="phone-notch">
              <div className="phone-speaker" />
            </div>
            <div className="phone-screen">
              {renderContent()}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ 
          maxWidth: '680px', 
          margin: '0 auto', 
          background: '#ffffff', 
          borderRadius: '16px', 
          border: '1px solid #E2E8F0', 
          boxShadow: 'var(--shadow-md)',
          height: '750px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {renderContent()}
        </div>
      )}
    </div>
  );
}
