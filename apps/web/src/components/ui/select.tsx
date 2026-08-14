import React from 'react';
import { cn } from '../../lib/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, disabled, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full px-3.5 py-2.5 text-sm rounded-lg border transition-colors outline-none appearance-none font-sans cursor-pointer',
            'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)]',
            'focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20',
            'disabled:opacity-50 disabled:bg-[var(--muted)] disabled:cursor-not-allowed',
            error && 'border-[var(--destructive)] focus:border-[var(--destructive)]',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted-foreground)] text-xs">
          ▼
        </span>
      </div>
    );
  }
);

Select.displayName = 'Select';
