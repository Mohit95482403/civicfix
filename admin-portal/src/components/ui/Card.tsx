import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Card({ children, className = '', title, subtitle, action }: CardProps) {
  return (
    <div className={`bg-surface border border-slate-200 rounded-lg shadow-sm overflow-hidden ${className}`}>
      {(title || subtitle || action) && (
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-brandText-primary">{title}</h3>}
            {subtitle && <p className="text-xs text-brandText-secondary mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
