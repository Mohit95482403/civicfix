import React from 'react';
import { Button } from './Button';
import { FileText } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  action,
}) => {
  const finalLabel = action?.label || actionLabel;
  const finalAction = action?.onClick || onAction;

  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center max-w-sm mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
        {icon || <FileText className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-bold text-brandText mb-1">{title}</h3>
      <p className="text-xs text-brandText-muted mb-6 leading-relaxed">
        {description}
      </p>
      {finalLabel && finalAction && (
        <Button variant="primary" size="md" onClick={finalAction}>
          {finalLabel}
        </Button>
      )}
    </div>
  );
};
