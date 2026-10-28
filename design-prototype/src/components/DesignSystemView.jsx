import React, { useState } from 'react';
import { 
  Palette, Type, Layers, CheckCircle2, ShieldCheck, 
  AlertTriangle, Copy, Check 
} from 'lucide-react';
import { STATUS_CONFIG } from '../data/mockData';

export default function DesignSystemView() {
  const [copiedColor, setCopiedColor] = useState(null);

  const copyToClipboard = (hex) => {
    navigator.clipboard?.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const colors = [
    { name: 'Civic Teal (Primary)', hex: '#176B5B', rgb: '23, 107, 91', role: 'Brand Core & Action Buttons' },
    { name: 'Teal Hover', hex: '#115447', rgb: '17, 84, 71', role: 'Active / Hover State' },
    { name: 'Teal Light', hex: '#E8F4F0', rgb: '232, 244, 240', role: 'Tinted Surface / Active Tabs' },
    { name: 'Warm Gold (Accent)', hex: '#F4B942', rgb: '244, 185, 66', role: 'Highlights & Priority Flags' },
    { name: 'Navy Charcoal (Text)', hex: '#172B3A', rgb: '23, 43, 58', role: 'Primary Typography (4.5:1 Contrast)' },
    { name: 'Muted Slate (Secondary)', hex: '#617386', rgb: '97, 115, 134', role: 'Subtitles & Supporting Labels' },
    { name: 'Surface Canvas', hex: '#F7F9FC', rgb: '247, 249, 252', role: 'App Background' },
    { name: 'Card Surface', hex: '#FFFFFF', rgb: '255, 255, 255', role: 'Card & Modal Elevation' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Intro Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #176B5B 0%, #115447 100%)', 
        color: '#ffffff', 
        padding: '32px', 
        borderRadius: '16px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Palette size={28} />
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>CivicFix Design System Tokens</h2>
        </div>
        <p style={{ fontSize: '14px', color: '#E2E8F0', maxWidth: '720px', lineHeight: 1.6 }}>
          Designed for high legibility, strict WCAG 2.2 Level AA accessibility compliance, 
          and brand consistency across Flutter mobile and React web portals.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette size={20} color="var(--color-primary)" /> Core Color Palette
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
          Click any swatch to copy the hexadecimal token value to clipboard.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {colors.map((c, i) => (
            <div 
              key={i}
              onClick={() => copyToClipboard(c.hex)}
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: '#ffffff'
              }}
            >
              <div style={{ height: '80px', background: c.hex, position: 'relative' }}>
                {copiedColor === c.hex && (
                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'rgba(0,0,0,0.4)', 
                    color: '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    <Check size={14} /> Copied!
                  </div>
                )}
              </div>
              <div style={{ padding: '12px' }}>
                <div style={{ fontWeight: 600, fontSize: '13px', color: '#1E293B', marginBottom: '2px' }}>{c.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B' }}>
                  <code>{c.hex}</code>
                  <span>rgb({c.rgb})</span>
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Status Badge Lifecycle Matrix */}
      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={20} color="var(--color-primary)" /> Complaint Status Badge System
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
          Standardized 10-state lifecycle badges with high contrast foreground/background combinations.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <div key={key} style={{ 
              border: '1px solid #E2E8F0', 
              borderRadius: '8px', 
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              background: '#F8FAFC'
            }}>
              <div>
                <span className={`badge ${config.badgeClass}`}>
                  {config.icon} {config.label}
                </span>
              </div>
              <code style={{ fontSize: '11px', color: '#64748B' }}>{key}</code>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Typography Hierarchy */}
      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Type size={20} color="var(--color-primary)" /> Typography Hierarchy
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
          Primary font: Inter (400, 500, 600, 700). Scaled specifically for mobile and desktop screens.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            <div className="text-display">Display Title — 30px Bold</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>Used for major landing headers and mobile splash screens</div>
          </div>
          <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            <div className="text-page-title">Page Title — 24px SemiBold</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>Top-level portal titles, dashboard summaries</div>
          </div>
          <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            <div className="text-section">Section Header — 20px SemiBold</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>Form sections, card container headings</div>
          </div>
          <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            <div className="text-card-title">Card Title — 16px SemiBold</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>Complaint item title in list, table row primary text</div>
          </div>
          <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            <div className="text-body">Body Regular — 14px (Line height 1.5)</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>Complaint descriptions, instructions, modal dialogs</div>
          </div>
          <div>
            <div className="text-supporting">Supporting Text — 13px Muted Slate</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>Timestamps, metadata, secondary helper text</div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Button Matrix */}
      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
          Button Component Variations
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
          Interactive states supporting 44px minimum touch targets on mobile devices.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-primary">Primary Action</button>
          <button className="btn btn-secondary">Secondary Outline</button>
          <button className="btn btn-ghost">Ghost Button</button>
          <button className="btn btn-danger">Danger / Reject</button>
          <button className="btn btn-primary btn-sm">Small Button</button>
          <button className="btn btn-primary" disabled>Disabled State</button>
        </div>
      </div>
    </div>
  );
}
