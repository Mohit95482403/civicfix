import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'blue'
  | 'purple'
  | 'green'
  | 'amber'
  | 'gray';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  hasDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  hasDot = false,
  className,
  ...props
}) => {
  const variants: Record<BadgeVariant, string> = {
    primary: 'bg-primary-50 text-primary border-primary/20',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dotColors: Record<BadgeVariant, string> = {
    primary: 'bg-primary',
    blue: 'bg-blue-600',
    success: 'bg-emerald-600',
    green: 'bg-emerald-600',
    warning: 'bg-amber-600',
    amber: 'bg-amber-600',
    danger: 'bg-rose-600',
    purple: 'bg-purple-600',
    info: 'bg-sky-600',
    neutral: 'bg-slate-500',
    gray: 'bg-slate-500',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full border',
          variants[variant] || variants.neutral,
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {hasDot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant] || dotColors.neutral)} />
      )}
      <span>{children}</span>
    </span>
  );
};
