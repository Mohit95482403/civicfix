import { describe, it, expect } from 'vitest';
import { complaintsService, COMPLAINT_CATEGORIES } from '../services/complaints.service';

describe('CivicFix Complaints Service & State Transitions', () => {
  it('retrieves active grievance categories with SLA hours', async () => {
    const categories = await complaintsService.getCategories();
    expect(categories.length).toBeGreaterThanOrEqual(6);
    expect(categories[0]).toHaveProperty('name');
    expect(categories[0]).toHaveProperty('slaHours');
  });

  it('retrieves municipal complaints list with guaranteed tracking IDs', async () => {
    const list = await complaintsService.getAllComplaints();
    expect(list.length).toBeGreaterThan(0);
    const item = list[0];
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('trackingNumber');
    expect(item).toHaveProperty('status');
  });

  it('supports reporting a new complaint with automatic tracking ID', async () => {
    const newIssue = await complaintsService.createComplaint({
      title: 'Water valve leakage on Church Street',
      description: 'Potable water spilling onto pavement',
      priority: 'high',
      categoryId: COMPLAINT_CATEGORIES[0].id,
      address: 'Church Street, Bengaluru',
    });

    expect(newIssue.id).toBeTruthy();
    expect(newIssue.trackingNumber).toMatch(/^CF-2026-BLR-/);
    expect(newIssue.status).toBe('submitted');
    expect(newIssue.title).toBe('Water valve leakage on Church Street');
  });

  it('transitions complaint lifecycle and updates audit notes', async () => {
    const all = await complaintsService.getAllComplaints();
    const target = all[0];

    const updated = await complaintsService.updateStatus(
      target.id,
      'in_progress',
      'Field inspection crew dispatched'
    );

    expect(updated.status).toBe('in_progress');
    expect(updated.resolutionNotes).toBe('Field inspection crew dispatched');
  });

  it('assigns qualified field staff to a complaint', async () => {
    const all = await complaintsService.getAllComplaints();
    const target = all[0];

    const assigned = await complaintsService.assignStaff(target.id, 'Suresh B. (Lineman)');
    expect(assigned.status).toBe('assigned');
    expect(assigned.assignedStaffName).toBe('Suresh B. (Lineman)');
  });
});
