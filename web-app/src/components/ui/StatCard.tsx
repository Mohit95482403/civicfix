import React from 'react';
import { Card } from './Card';
import { clsx } from 'clsx';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode | React.ElementType;
  change?: string;
  subtitle?: string;
  color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
  iconColor?: string;
  iconBgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  subtitle,
  color = 'blue',
  iconColor,
  iconBgColor,
}) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
  };

  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function' || typeof icon === 'object') {
      const IconComp = icon as React.ElementType;
      return <IconComp className={clsx('w-5 h-5', iconColor)} />;
    }
    return icon as React.ReactNode;
  };

  return (
    <Card hoverable className="flex flex-col justify-between p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">
          {title}
        </span>
        <div
          className={clsx(
            'p-2.5 rounded-xl border flex items-center justify-center',
            iconBgColor ? `${iconBgColor} ${iconColor || ''} border-transparent` : colorMap[color]
          )}
        >
          {renderIcon()}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-extrabold text-brandText tracking-tight">
          {value}
        </div>
        {(change || subtitle) && (
          <p className="mt-1 text-xs text-brandText-muted flex items-center gap-1.5">
            {change && <span className="font-semibold text-emerald-600">{change}</span>}
            <span>{subtitle}</span>
          </p>
        )}
      </div>
    </Card>
  );
};
