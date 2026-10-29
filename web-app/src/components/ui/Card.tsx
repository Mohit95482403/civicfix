import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverable = false,
  title,
  subtitle,
  headerAction,
  children,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white border border-border-light rounded-2xl p-5 shadow-xs',
          hoverable && 'transition-all duration-150 hover:shadow-md hover:border-slate-300',
          className
        )
      )}
      {...props}
    >
      {(title || headerAction) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-border-light gap-2">
          <div>
            {title && <h3 className="text-base font-bold text-brandText">{title}</h3>}
            {subtitle && <p className="text-xs text-brandText-muted mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
