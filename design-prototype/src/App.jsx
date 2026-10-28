import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CitizenView from './components/CitizenView';
import StaffView from './components/StaffView';
import AdminView from './components/AdminView';
import DesignSystemView from './components/DesignSystemView';
import ComplaintDetailModal from './components/ComplaintDetailModal';
import NewComplaintModal from './components/NewComplaintModal';
import { COMPLAINTS, AUDIT_LOGS } from './data/mockData';
import './App.css';

export default function App() {
  const [complaints, setComplaints] = useState(COMPLAINTS);
  const [currentRole, setCurrentRole] = useState('CITIZEN'); // CITIZEN, STAFF, ADMIN, DESIGN_SYSTEM
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Find currently selected complaint
  const activeComplaint = complaints.find((c) => c.id === selectedComplaintId) || null;

  // 1. Submit a new complaint
  const handleAddComplaint = (newComplaint) => {
    setComplaints([newComplaint, ...complaints]);
  };

  // 2. Update complaint status
  const handleUpdateStatus = (complaintId, nextStatus, remark) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          const actorName =
            currentRole === 'STAFF'
              ? 'Ramesh Kumar (Staff)'
              : currentRole === 'ADMIN'
              ? 'City Administrator'
              : 'Citizen';

          const newTimelineEvent = {
            status: nextStatus,
            date: new Date().toISOString(),
            actor: actorName,
            remark: remark || `Status transitioned to ${nextStatus}`,
          };

          return {
            ...c,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
            resolvedAt: nextStatus === 'RESOLVED' ? new Date().toISOString() : c.resolvedAt,
            closedAt: nextStatus === 'CLOSED' ? new Date().toISOString() : c.closedAt,
            timeline: [newTimelineEvent, ...c.timeline],
          };
        }
        return c;
      })
    );
  };

  // 3. Assign staff to a complaint
  const handleAssignStaff = (complaintId, staff) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          const newTimelineEvent = {
            status: 'ASSIGNED',
            date: new Date().toISOString(),
            actor: 'City Administrator',
            remark: `Assigned to ${staff.name} (${staff.department})`,
          };

          return {
            ...c,
            status: 'ASSIGNED',
            staff: staff,
            updatedAt: new Date().toISOString(),
            timeline: [newTimelineEvent, ...c.timeline],
          };
        }
        return c;
      })
    );
  };

  // 4. Add comment to a complaint
  const handleAddComment = (complaintId, comment) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            comments: [...(c.comments || []), comment],
          };
        }
        return c;
      })
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg-main)' }}>
      {/* Top Navbar with Role Switcher */}
      <Navbar currentRole={currentRole} onSelectRole={setCurrentRole} />

      {/* Main Experience View */}
      <main className="proto-main-container">
        {currentRole === 'CITIZEN' && (
          <CitizenView
            complaints={complaints}
            onSelectComplaint={(item) => setSelectedComplaintId(item.id)}
            onOpenNewReport={() => setIsNewReportOpen(true)}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        )}

        {currentRole === 'STAFF' && (
          <StaffView
            complaints={complaints}
            onSelectComplaint={(item) => setSelectedComplaintId(item.id)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {currentRole === 'ADMIN' && (
          <AdminView
            complaints={complaints}
            onSelectComplaint={(item) => setSelectedComplaintId(item.id)}
            onAssignStaff={handleAssignStaff}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {currentRole === 'DESIGN_SYSTEM' && <DesignSystemView />}
      </main>

      {/* Complaint Detail & Status Timeline Modal */}
      {activeComplaint && (
        <ComplaintDetailModal
          complaint={activeComplaint}
          onClose={() => setSelectedComplaintId(null)}
          onAddComment={handleAddComment}
          onUpdateStatus={handleUpdateStatus}
          currentRole={currentRole}
        />
      )}

      {/* Citizen New Complaint Multi-step Wizard */}
      {isNewReportOpen && (
        <NewComplaintModal
          onClose={() => setIsNewReportOpen(false)}
          onSubmitComplaint={handleAddComplaint}
        />
      )}
    </div>
  );
}
