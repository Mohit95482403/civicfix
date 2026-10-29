import { ComplaintStatus, ComplaintPriority } from '../types/complaint';

export function formatStatusLabel(status: ComplaintStatus | string): string {
  switch (status.toLowerCase()) {
    case 'submitted':
    case 'pending':
      return 'Submitted';
    case 'under_review':
      return 'Under Review';
    case 'assigned':
      return 'Assigned';
    case 'in_progress':
      return 'In Progress';
    case 'resolved':
      return 'Resolved';
    case 'rejected':
      return 'Rejected';
    case 'closed':
      return 'Closed';
    default:
      return status;
  }
}

export function getStatusBadgeVariant(
  status: ComplaintStatus | string
): 'info' | 'warning' | 'primary' | 'success' | 'danger' | 'neutral' {
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'info';
    case 'under_review':
      return 'warning';
    case 'assigned':
    case 'in_progress':
      return 'primary';
    case 'resolved':
      return 'success';
    case 'rejected':
      return 'danger';
    case 'closed':
    default:
      return 'neutral';
  }
}

export function getPriorityBadgeVariant(
  priority: ComplaintPriority | string
): 'danger' | 'warning' | 'info' | 'neutral' {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'danger';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
    default:
      return 'neutral';
  }
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatTimeAgo(dateString: string): string {
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${Math.max(1, diffMins)}m ago`;
  } catch {
    return dateString;
  }
}
