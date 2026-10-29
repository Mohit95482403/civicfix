export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'rejected'
  | 'closed';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ComplaintCategory {
  id: string;
  name: string;
  icon?: string;
  slaHours: number;
  departmentName?: string;
  slug?: string;
}

export interface Complaint {
  id: string;
  referenceNumber: string;
  trackingNumber: string; // Guaranteed alias
  title: string;
  description: string;
  category: {
    id?: string;
    name: string;
    slaHours?: number;
  };
  categoryIcon?: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  locationAddress: string;
  address: string; // Guaranteed alias
  latitude?: number | null;
  longitude?: number | null;
  imageUrl?: string | null;
  departmentId?: string | null;
  departmentName?: string;
  assignedStaffId?: string | null;
  assignedStaffName?: string | null;
  citizenName?: string;
  citizenPhone?: string | null;
  reportedAt: string;
  createdAt: string; // Guaranteed alias
  updatedAt: string;
  slaDueAt?: string | null;
  resolutionNotes?: string | null;
  resolutionImageUrl?: string | null;
}

export interface DashboardMetric {
  title: string;
  value: number | string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  icon?: string;
}
