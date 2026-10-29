import { Complaint, ComplaintCategory, ComplaintStatus, ComplaintPriority } from '../types/complaint';

export const COMPLAINT_CATEGORIES: ComplaintCategory[] = [
  { id: 'cat-1', name: 'Roads & Potholes', icon: '🕳️', slaHours: 48, departmentName: 'Roads & Infrastructure', slug: 'roads-potholes' },
  { id: 'cat-2', name: 'Solid Waste & Garbage', icon: '🗑️', slaHours: 24, departmentName: 'Solid Waste Management', slug: 'solid-waste' },
  { id: 'cat-3', name: 'Streetlights & Lighting', icon: '💡', slaHours: 24, departmentName: 'Electrical & Lighting', slug: 'streetlights' },
  { id: 'cat-4', name: 'Water Supply Leakage', icon: '💧', slaHours: 36, departmentName: 'Water & Sewerage', slug: 'water-supply' },
  { id: 'cat-5', name: 'Drainage & Overflow', icon: '🌊', slaHours: 48, departmentName: 'Storm Water Drainage', slug: 'drainage' },
  { id: 'cat-6', name: 'Public Infrastructure', icon: '🏗️', slaHours: 72, departmentName: 'Public Works', slug: 'public-infra' },
];

let INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-101',
    referenceNumber: 'CF-2026-BLR-001042',
    trackingNumber: 'CF-2026-BLR-001042',
    title: 'Severe pothole cluster causing vehicle skidding on 100ft Ring Road',
    description: 'Deep road crater in the fast lane opposite Koramangala BDA Complex. Multiple two-wheelers have skid in wet conditions.',
    category: { id: 'cat-1', name: 'Roads & Potholes', slaHours: 48 },
    categoryIcon: '🕳️',
    status: 'in_progress',
    priority: 'high',
    locationAddress: 'Opposite Koramangala BDA Complex, 100ft Road, Bengaluru',
    address: 'Opposite Koramangala BDA Complex, 100ft Road, Bengaluru',
    latitude: 12.9352,
    longitude: 77.6245,
    departmentName: 'Roads & Infrastructure',
    assignedStaffName: 'Ramesh Kumar (Tech #4)',
    citizenName: 'Rahul Patil',
    citizenPhone: '+919876543210',
    reportedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    resolutionNotes: 'Asphalt cold mix dispatch scheduled for morning shift.',
  },
  {
    id: 'cmp-102',
    referenceNumber: 'CF-2026-BLR-001045',
    trackingNumber: 'CF-2026-BLR-001045',
    title: 'Garbage dumping on footpath creating pedestrian hazard',
    description: 'Unattended bulk waste and construction debris dumped across the walking footpath outside 5th Block park entrance.',
    category: { id: 'cat-2', name: 'Solid Waste & Garbage', slaHours: 24 },
    categoryIcon: '🗑️',
    status: 'assigned',
    priority: 'urgent',
    locationAddress: '12th Main Road, HAL 2nd Stage, Indiranagar',
    address: '12th Main Road, HAL 2nd Stage, Indiranagar',
    latitude: 12.9716,
    longitude: 77.6412,
    departmentName: 'Solid Waste Management',
    assignedStaffName: 'Suresh B. (Sanitation Unit 2)',
    citizenName: 'Ananya Rao',
    citizenPhone: '+919876543212',
    reportedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
  },
  {
    id: 'cmp-103',
    referenceNumber: 'CF-2026-BLR-001036',
    trackingNumber: 'CF-2026-BLR-001036',
    title: 'Broken sodium streetlight outside primary school gate',
    description: 'The pole fixture was shattered during a recent storm, leaving the entire zebra crossing in complete darkness.',
    category: { id: 'cat-3', name: 'Streetlights & Lighting', slaHours: 24 },
    categoryIcon: '💡',
    status: 'resolved',
    priority: 'medium',
    locationAddress: '5th Block, Koramangala Main Road, Ward 151',
    address: '5th Block, Koramangala Main Road, Ward 151',
    latitude: 12.9341,
    longitude: 77.6189,
    departmentName: 'Electrical & Lighting',
    assignedStaffName: 'Karthik N. (Lineman)',
    citizenName: 'Rahul Patil',
    citizenPhone: '+919876543210',
    reportedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    resolutionNotes: 'Replaced bulb assembly and rewired circuit breaker. Lux test verified.',
  },
  {
    id: 'cmp-104',
    referenceNumber: 'CF-2026-BLR-001048',
    trackingNumber: 'CF-2026-BLR-001048',
    title: 'Water main pipeline valve fracture leaking onto residential street',
    description: 'Clean drinking water gushing from damaged inspection chamber at rate of ~200 liters/hour.',
    category: { id: 'cat-4', name: 'Water Supply Leakage', slaHours: 36 },
    categoryIcon: '💧',
    status: 'submitted',
    priority: 'urgent',
    locationAddress: '4th Cross, Malleshwaram West',
    address: '4th Cross, Malleshwaram West',
    latitude: 13.0031,
    longitude: 77.5643,
    departmentName: 'Water & Sewerage',
    citizenName: 'Deepak V.',
    citizenPhone: '+919876543214',
    reportedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 34 * 3600 * 1000).toISOString(),
  },
];

export const complaintsService = {
  async getCategories(): Promise<ComplaintCategory[]> {
    return COMPLAINT_CATEGORIES;
  },

  async getAllComplaints(): Promise<Complaint[]> {
    return [...INITIAL_COMPLAINTS];
  },

  async getMyComplaints(): Promise<Complaint[]> {
    return [...INITIAL_COMPLAINTS];
  },

  async getComplaints(filter?: { status?: string; role?: string; citizenEmail?: string }): Promise<Complaint[]> {
    let list = [...INITIAL_COMPLAINTS];
    if (filter?.status && filter.status !== 'all') {
      list = list.filter((c) => c.status === filter.status);
    }
    return list;
  },

  async getComplaintById(id: string): Promise<Complaint | null> {
    return (
      INITIAL_COMPLAINTS.find(
        (c) => c.id === id || c.referenceNumber === id || c.trackingNumber === id
      ) || null
    );
  },

  async createComplaint(data: {
    categoryId?: string;
    title: string;
    description: string;
    priority?: ComplaintPriority;
    category?: string;
    locationAddress?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    citizenName?: string;
    citizenPhone?: string;
  }): Promise<Complaint> {
    const newRef = `CF-2026-BLR-00${Math.floor(1050 + Math.random() * 900)}`;
    const cat =
      COMPLAINT_CATEGORIES.find(
        (c) => c.id === data.categoryId || c.name === data.category
      ) || COMPLAINT_CATEGORIES[0];

    const addr = data.address || data.locationAddress || 'Bengaluru';

    const newComplaint: Complaint = {
      id: `cmp-${Date.now()}`,
      referenceNumber: newRef,
      trackingNumber: newRef,
      title: data.title,
      description: data.description,
      category: {
        id: cat.id,
        name: cat.name,
        slaHours: cat.slaHours,
      },
      categoryIcon: cat.icon,
      status: 'submitted',
      priority: data.priority || 'medium',
      locationAddress: addr,
      address: addr,
      latitude: data.latitude || 12.9716,
      longitude: data.longitude || 77.5946,
      departmentName: cat.departmentName,
      citizenName: data.citizenName || 'Citizen User',
      citizenPhone: data.citizenPhone,
      reportedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaDueAt: new Date(Date.now() + cat.slaHours * 3600 * 1000).toISOString(),
    };

    INITIAL_COMPLAINTS = [newComplaint, ...INITIAL_COMPLAINTS];
    return newComplaint;
  },

  async updateStatus(
    id: string,
    status: ComplaintStatus,
    notes?: string
  ): Promise<Complaint> {
    return this.updateComplaintStatus(id, status, notes);
  },

  async updateComplaintStatus(
    id: string,
    status: ComplaintStatus,
    notes?: string
  ): Promise<Complaint> {
    const idx = INITIAL_COMPLAINTS.findIndex(
      (c) => c.id === id || c.referenceNumber === id || c.trackingNumber === id
    );
    if (idx === -1) throw new Error('Complaint not found');

    INITIAL_COMPLAINTS[idx] = {
      ...INITIAL_COMPLAINTS[idx],
      status,
      updatedAt: new Date().toISOString(),
      resolutionNotes: notes || INITIAL_COMPLAINTS[idx].resolutionNotes,
    };

    return INITIAL_COMPLAINTS[idx];
  },

  async assignStaff(id: string, staffName: string): Promise<Complaint> {
    const idx = INITIAL_COMPLAINTS.findIndex(
      (c) => c.id === id || c.referenceNumber === id || c.trackingNumber === id
    );
    if (idx === -1) throw new Error('Complaint not found');

    INITIAL_COMPLAINTS[idx] = {
      ...INITIAL_COMPLAINTS[idx],
      status: 'assigned',
      assignedStaffName: staffName,
      updatedAt: new Date().toISOString(),
    };

    return INITIAL_COMPLAINTS[idx];
  },
};
