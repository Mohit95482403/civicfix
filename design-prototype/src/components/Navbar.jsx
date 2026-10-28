import React from 'react';
import { Smartphone, Wrench, Building2, Palette, ShieldCheck } from 'lucide-react';

export default function Navbar({ currentRole, onSelectRole }) {
  const tabs = [
    { id: 'CITIZEN', label: 'Citizen Mobile App', icon: Smartphone },
    { id: 'STAFF', label: 'Field Staff Portal', icon: Wrench },
    { id: 'ADMIN', label: 'City Admin Dashboard', icon: Building2 },
    { id: 'DESIGN_SYSTEM', label: 'Design Tokens & UI Specs', icon: Palette },
  ];

  return (
    <header className="proto-header">
      {/* Brand Identity */}
      <div className="proto-brand">
        <div className="proto-logo-badge">
          CF
        </div>
        <div>
          <div className="proto-title">
            CivicFix
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 700, 
              background: 'var(--color-primary-light)', 
              color: 'var(--color-primary)', 
              padding: '2px 8px', 
              borderRadius: '9999px',
              letterSpacing: '0.5px'
            }}>
              DAY 2 PROTOTYPE
            </span>
          </div>
          <div className="proto-tagline">Report It. Track It. Improve Your City.</div>
        </div>
      </div>

      {/* Role / Experience Switcher */}
      <nav className="proto-nav-tabs" aria-label="Prototype Navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentRole === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`proto-nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => onSelectRole(tab.id)}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Status / Role pill */}
      <div className="proto-header-actions">
        <div style={{ 
          fontSize: '12px', 
          color: '#64748B', 
          background: '#F1F5F9', 
          padding: '6px 12px', 
          borderRadius: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px' 
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16845B' }} />
          <span>Interactive State Engine Active</span>
        </div>
      </div>
    </header>
  );
}
