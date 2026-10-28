import React from 'react';

export type BadgeVariant =
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'urgent'
  | 'high'
  | 'medium'
  | 'low';

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  submitted: 'bg-blue-50 text-blue-700 border-blue-200',
  under_review: 'bg-amber-50 text-amber-700 border-amber-200',
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  assigned: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  in_progress: 'bg-sky-50 text-sky-700 border-sky-200',
  resolved: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  closed: 'bg-slate-100 text-slate-700 border-slate-200',
  urgent: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
  high: 'bg-amber-50 text-amber-700 border-amber-200',
  medium: 'bg-slate-100 text-slate-700 border-slate-200',
  low: 'bg-gray-100 text-gray-600 border-gray-200',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({ children, variant = 'submitted', className = '', icon }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${VARIANT_STYLES[variant]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
