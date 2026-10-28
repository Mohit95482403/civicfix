// CivicFix Design Prototype — Mock Data
// All data is illustrative. This is NOT live municipal data.

export const CATEGORIES = [
  { id: 'cat-1', name: 'Roads & Potholes', icon: '🕳️', department: 'Roads & Infrastructure', sla: 48, priority: 'HIGH' },
  { id: 'cat-2', name: 'Garbage & Sanitation', icon: '🗑️', department: 'Solid Waste Management', sla: 24, priority: 'URGENT' },
  { id: 'cat-3', name: 'Streetlights', icon: '💡', department: 'Electrical & Street Lighting', sla: 24, priority: 'HIGH' },
  { id: 'cat-4', name: 'Water Supply', icon: '💧', department: 'Water Supply & Sewerage', sla: 12, priority: 'URGENT' },
  { id: 'cat-5', name: 'Drainage', icon: '🌊', department: 'Water Supply & Sewerage', sla: 24, priority: 'URGENT' },
  { id: 'cat-6', name: 'Public Infrastructure', icon: '🏗️', department: 'Public Works Department', sla: 72, priority: 'MEDIUM' },
  { id: 'cat-7', name: 'Other', icon: '📋', department: 'General', sla: 72, priority: 'LOW' },
];

export const STATUS_CONFIG = {
  SUBMITTED: { label: 'Submitted', badgeClass: 'badge-submitted', icon: '📋' },
  UNDER_REVIEW: { label: 'Under Review', badgeClass: 'badge-under_review', icon: '🔍' },
  VERIFIED: { label: 'Verified', badgeClass: 'badge-verified', icon: '✓' },
  ASSIGNED: { label: 'Assigned', badgeClass: 'badge-assigned', icon: '👤' },
  IN_PROGRESS: { label: 'In Progress', badgeClass: 'badge-in_progress', icon: '🔧' },
  RESOLVED: { label: 'Resolved', badgeClass: 'badge-resolved', icon: '✅' },
  CLOSED: { label: 'Closed', badgeClass: 'badge-closed', icon: '🔒' },
  REOPENED: { label: 'Reopened', badgeClass: 'badge-reopened', icon: '🔄' },
  REJECTED: { label: 'Rejected', badgeClass: 'badge-rejected', icon: '✕' },
  DUPLICATE: { label: 'Duplicate', badgeClass: 'badge-duplicate', icon: '📎' },
};

export const COMPLAINTS = [
  {
    id: 'cmp-001',
    reference: 'CF-2026-BLR-001042',
    title: 'Severe pothole causing vehicle skidding on 100ft Ring Road',
    description: 'Large 2-foot deep pothole near the bus stand junction. Water has collected inside creating dangerous conditions for two-wheelers and auto-rickshaws. Multiple vehicles have skidded here in the past week.',
    category: CATEGORIES[0],
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    citizen: { name: 'Priya Sharma', avatar: '👩' },
    staff: { name: 'Ramesh Kumar', department: 'Roads & Infrastructure' },
    location: { address: 'Opposite Koramangala BDA Complex, 100ft Road, Bengaluru', lat: 12.9716, lng: 77.5946 },
    createdAt: '2026-10-26T10:15:00Z',
    updatedAt: '2026-10-28T09:30:00Z',
    slaDueAt: '2026-10-28T10:15:00Z',
    timeline: [
      { status: 'IN_PROGRESS', date: '2026-10-28T09:30:00Z', actor: 'Ramesh Kumar', remark: 'Maintenance team arrived on site with asphalt mix and equipment.' },
      { status: 'ASSIGNED', date: '2026-10-27T14:00:00Z', actor: 'Sunita Patil', remark: 'Assigned to Ramesh Kumar, Roads & Infrastructure team.' },
      { status: 'VERIFIED', date: '2026-10-27T11:30:00Z', actor: 'Sunita Patil', remark: 'Verified as genuine road hazard. High priority.' },
      { status: 'UNDER_REVIEW', date: '2026-10-26T16:00:00Z', actor: 'System', remark: 'Complaint received and queued for departmental review.' },
      { status: 'SUBMITTED', date: '2026-10-26T10:15:00Z', actor: 'Priya Sharma', remark: 'Complaint submitted with 2 photographs.' },
    ],
    comments: [
      { author: 'Priya Sharma', role: 'CITIZEN', text: 'This pothole is getting worse with the rain. Please expedite.', date: '2026-10-27T08:00:00Z', isInternal: false },
      { author: 'Ramesh Kumar', role: 'STAFF', text: 'Awaiting asphalt supply delivery from depot. Expected by noon.', date: '2026-10-28T07:00:00Z', isInternal: true },
    ],
  },
  {
    id: 'cmp-002',
    reference: 'CF-2026-BLR-001041',
    title: 'Garbage overflow at 5th Cross junction for 3 days',
    description: 'The community garbage bin at 5th Cross Road has been overflowing for 3 days. Waste is spilling onto the road and causing a severe stench. Stray animals are scattering garbage across the street.',
    category: CATEGORIES[1],
    status: 'SUBMITTED',
    priority: 'URGENT',
    citizen: { name: 'Amit Patel', avatar: '👨' },
    staff: null,
    location: { address: '5th Cross Road, JP Nagar 2nd Phase, Bengaluru', lat: 12.9082, lng: 77.5929 },
    createdAt: '2026-10-28T06:30:00Z',
    updatedAt: '2026-10-28T06:30:00Z',
    slaDueAt: '2026-10-29T06:30:00Z',
    timeline: [
      { status: 'SUBMITTED', date: '2026-10-28T06:30:00Z', actor: 'Amit Patel', remark: 'Complaint submitted with 1 photograph.' },
    ],
    comments: [],
  },
  {
    id: 'cmp-003',
    reference: 'CF-2026-BLR-001040',
    title: 'Streetlight not working on MG Road near Metro station',
    description: 'The streetlight pole #47 near MG Road Metro Station exit has been non-functional for over a week. The area becomes very dark after 7 PM, creating safety concerns for pedestrians.',
    category: CATEGORIES[2],
    status: 'ASSIGNED',
    priority: 'HIGH',
    citizen: { name: 'Kavya Reddy', avatar: '👩' },
    staff: { name: 'Suresh B.', department: 'Electrical & Street Lighting' },
    location: { address: 'MG Road, Near Metro Station Exit 2, Bengaluru', lat: 12.9758, lng: 77.6065 },
    createdAt: '2026-10-25T18:45:00Z',
    updatedAt: '2026-10-27T10:00:00Z',
    slaDueAt: '2026-10-26T18:45:00Z',
    timeline: [
      { status: 'ASSIGNED', date: '2026-10-27T10:00:00Z', actor: 'Anand Verma', remark: 'Assigned to Suresh B., Electrical department.' },
      { status: 'VERIFIED', date: '2026-10-26T09:00:00Z', actor: 'Anand Verma', remark: 'Verified. Pole #47 confirmed non-functional.' },
      { status: 'SUBMITTED', date: '2026-10-25T18:45:00Z', actor: 'Kavya Reddy', remark: 'Complaint submitted with 1 photograph.' },
    ],
    comments: [],
  },
  {
    id: 'cmp-004',
    reference: 'CF-2026-BLR-001039',
    title: 'Water pipeline burst flooding residential street',
    description: 'Major water pipeline burst on 3rd Main Road. Water is gushing onto the road and flooding into nearby houses. Immediate attention required.',
    category: CATEGORIES[3],
    status: 'RESOLVED',
    priority: 'URGENT',
    citizen: { name: 'Ravi Mohan', avatar: '👨' },
    staff: { name: 'Kumar G.', department: 'Water Supply & Sewerage' },
    location: { address: '3rd Main Road, Indiranagar, Bengaluru', lat: 12.9719, lng: 77.6412 },
    createdAt: '2026-10-22T08:00:00Z',
    updatedAt: '2026-10-23T16:00:00Z',
    slaDueAt: '2026-10-22T20:00:00Z',
    resolvedAt: '2026-10-23T16:00:00Z',
    timeline: [
      { status: 'RESOLVED', date: '2026-10-23T16:00:00Z', actor: 'Kumar G.', remark: 'Pipeline section replaced and leak sealed. Road cleaned.' },
      { status: 'IN_PROGRESS', date: '2026-10-22T14:00:00Z', actor: 'Kumar G.', remark: 'Emergency team dispatched. Excavation started.' },
      { status: 'ASSIGNED', date: '2026-10-22T10:30:00Z', actor: 'Sunita Patil', remark: 'Emergency assignment to Kumar G.' },
      { status: 'VERIFIED', date: '2026-10-22T09:00:00Z', actor: 'Sunita Patil', remark: 'URGENT — Verified pipeline burst. Escalated.' },
      { status: 'SUBMITTED', date: '2026-10-22T08:00:00Z', actor: 'Ravi Mohan', remark: 'Complaint submitted with 3 photographs.' },
    ],
    comments: [],
  },
  {
    id: 'cmp-005',
    reference: 'CF-2026-BLR-001038',
    title: 'Drainage blockage causing waterlogging after rain',
    description: 'Storm drain near Jayanagar 4th Block is completely blocked. After every rain, the entire junction floods knee-deep, making it impassable for pedestrians and vehicles.',
    category: CATEGORIES[4],
    status: 'VERIFIED',
    priority: 'URGENT',
    citizen: { name: 'Meena K.', avatar: '👩' },
    staff: null,
    location: { address: 'Jayanagar 4th Block, Main Junction, Bengaluru', lat: 12.9250, lng: 77.5938 },
    createdAt: '2026-10-27T07:15:00Z',
    updatedAt: '2026-10-27T15:00:00Z',
    slaDueAt: '2026-10-28T07:15:00Z',
    timeline: [
      { status: 'VERIFIED', date: '2026-10-27T15:00:00Z', actor: 'Sunita Patil', remark: 'Verified. Storm drain blockage confirmed. Awaiting crew assignment.' },
      { status: 'SUBMITTED', date: '2026-10-27T07:15:00Z', actor: 'Meena K.', remark: 'Complaint submitted with 2 photographs.' },
    ],
    comments: [],
  },
  {
    id: 'cmp-006',
    reference: 'CF-2026-BLR-001037',
    title: 'Broken park bench and damaged playground equipment',
    description: 'The main bench in Cubbon Park children\'s area is broken and the slide has a cracked step. Children could get injured.',
    category: CATEGORIES[5],
    status: 'CLOSED',
    priority: 'MEDIUM',
    citizen: { name: 'Deepa S.', avatar: '👩' },
    staff: { name: 'Rajesh V.', department: 'Public Works Department' },
    location: { address: 'Cubbon Park, Children\'s Play Area, Bengaluru', lat: 12.9763, lng: 77.5929 },
    createdAt: '2026-10-18T11:00:00Z',
    updatedAt: '2026-10-21T10:00:00Z',
    slaDueAt: '2026-10-21T11:00:00Z',
    resolvedAt: '2026-10-20T15:00:00Z',
    closedAt: '2026-10-21T10:00:00Z',
    feedback: { rating: 5, text: 'Excellent work! Bench and slide repaired promptly.', date: '2026-10-21T10:00:00Z' },
    timeline: [
      { status: 'CLOSED', date: '2026-10-21T10:00:00Z', actor: 'Deepa S.', remark: 'Citizen rated 5 stars and closed the complaint.' },
      { status: 'RESOLVED', date: '2026-10-20T15:00:00Z', actor: 'Rajesh V.', remark: 'Bench repaired with new wooden slats. Slide step replaced.' },
      { status: 'IN_PROGRESS', date: '2026-10-19T09:00:00Z', actor: 'Rajesh V.', remark: 'Carpentry team arrived at park.' },
      { status: 'ASSIGNED', date: '2026-10-18T16:00:00Z', actor: 'Anand Verma', remark: 'Assigned to Rajesh V., PWD team.' },
      { status: 'VERIFIED', date: '2026-10-18T14:00:00Z', actor: 'Anand Verma', remark: 'Verified. Safety hazard for children confirmed.' },
      { status: 'SUBMITTED', date: '2026-10-18T11:00:00Z', actor: 'Deepa S.', remark: 'Complaint submitted with 2 photographs.' },
    ],
    comments: [],
  },
];

export const STAFF_MEMBERS = [
  { id: 'staff-1', name: 'Ramesh Kumar', email: 'ramesh@civicfix.org', department: 'Roads & Infrastructure', role: 'STAFF', activeComplaints: 3, available: true },
  { id: 'staff-2', name: 'Suresh B.', email: 'suresh@civicfix.org', department: 'Electrical & Street Lighting', role: 'STAFF', activeComplaints: 2, available: true },
  { id: 'staff-3', name: 'Kumar G.', email: 'kumar@civicfix.org', department: 'Water Supply & Sewerage', role: 'STAFF', activeComplaints: 1, available: true },
  { id: 'staff-4', name: 'Rajesh V.', email: 'rajesh@civicfix.org', department: 'Public Works Department', role: 'STAFF', activeComplaints: 4, available: false },
  { id: 'staff-5', name: 'Sunita Patil', email: 'sunita@civicfix.org', department: 'Roads & Infrastructure', role: 'SUPERVISOR', activeComplaints: 0, available: true },
];

export const DEPARTMENTS = [
  { id: 'dept-1', name: 'Roads & Infrastructure', code: 'ROADS', head: 'Sunita Patil', staffCount: 8, activeComplaints: 12, isActive: true },
  { id: 'dept-2', name: 'Solid Waste Management', code: 'SAN', head: 'Pradeep M.', staffCount: 12, activeComplaints: 18, isActive: true },
  { id: 'dept-3', name: 'Electrical & Street Lighting', code: 'ELEC', head: 'Naveen R.', staffCount: 5, activeComplaints: 7, isActive: true },
  { id: 'dept-4', name: 'Water Supply & Sewerage', code: 'WATER', head: 'Lakshmi D.', staffCount: 10, activeComplaints: 9, isActive: true },
  { id: 'dept-5', name: 'Public Works Department', code: 'PWD', head: 'Anil K.', staffCount: 6, activeComplaints: 4, isActive: true },
];

export const AUDIT_LOGS = [
  { id: 'aud-1', timestamp: '2026-10-28T09:30:00Z', actor: 'Ramesh Kumar', action: 'STATUS_UPDATED', resource: 'CF-2026-BLR-001042', detail: 'Status: ASSIGNED → IN_PROGRESS' },
  { id: 'aud-2', timestamp: '2026-10-27T14:00:00Z', actor: 'Sunita Patil', action: 'COMPLAINT_ASSIGNED', resource: 'CF-2026-BLR-001042', detail: 'Assigned to Ramesh Kumar' },
  { id: 'aud-3', timestamp: '2026-10-27T10:00:00Z', actor: 'Anand Verma', action: 'COMPLAINT_ASSIGNED', resource: 'CF-2026-BLR-001040', detail: 'Assigned to Suresh B.' },
  { id: 'aud-4', timestamp: '2026-10-27T09:00:00Z', actor: 'Anand Verma', action: 'STAFF_PROVISIONED', resource: 'Rajesh V.', detail: 'New STAFF account created in PWD' },
  { id: 'aud-5', timestamp: '2026-10-26T16:00:00Z', actor: 'System', action: 'STATUS_UPDATED', resource: 'CF-2026-BLR-001042', detail: 'Auto-queued for review' },
  { id: 'aud-6', timestamp: '2026-10-26T09:00:00Z', actor: 'Anand Verma', action: 'CATEGORY_CREATED', resource: 'Other', detail: 'New category added with 72h SLA' },
];

export const NOTIFICATIONS = [
  { id: 'not-1', title: 'Work started on your complaint', body: 'Maintenance team has arrived to fix the pothole on 100ft Road.', type: 'STATUS_UPDATE', reference: 'CF-2026-BLR-001042', isRead: false, date: '2026-10-28T09:30:00Z' },
  { id: 'not-2', title: 'Complaint assigned', body: 'Your complaint about the pothole has been assigned to Roads & Infrastructure.', type: 'ASSIGNMENT', reference: 'CF-2026-BLR-001042', isRead: true, date: '2026-10-27T14:00:00Z' },
  { id: 'not-3', title: 'Complaint verified', body: 'Your pothole report has been verified as a genuine road hazard.', type: 'STATUS_UPDATE', reference: 'CF-2026-BLR-001042', isRead: true, date: '2026-10-27T11:30:00Z' },
  { id: 'not-4', title: 'Water leak resolved', body: 'The pipeline burst on 3rd Main Road has been repaired. Please rate the resolution.', type: 'STATUS_UPDATE', reference: 'CF-2026-BLR-001039', isRead: true, date: '2026-10-23T16:00:00Z' },
];

export const DASHBOARD_METRICS = {
  total: 482,
  pendingTriage: 14,
  active: 38,
  resolvedThisWeek: 89,
  slaBreaches: 3,
  avgTurnaroundHours: 31.4,
  satisfactionRating: 4.6,
  reopenRate: 2.1,
};

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(dateStr) {
  return `${formatDate(dateStr)} at ${formatTime(dateStr)}`;
}

export function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHrs < 1) return 'Just now';
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}
