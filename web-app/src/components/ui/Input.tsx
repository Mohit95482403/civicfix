import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, prefixIcon, suffixIcon, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-brandText-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {prefixIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {prefixIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={twMerge(
              clsx(
                'block w-full rounded-lg border text-sm text-brandText-primary placeholder-slate-400 bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent py-2.5',
                prefixIcon ? 'pl-10' : 'pl-3.5',
                suffixIcon ? 'pr-10' : 'pr-3.5',
                error
                  ? 'border-semantic-error text-semantic-error focus:ring-semantic-error'
                  : 'border-slate-300 hover:border-slate-400',
                className
              )
            )}
            {...props}
          />
          {suffixIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {suffixIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-semantic-error font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-brandText-tertiary">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
