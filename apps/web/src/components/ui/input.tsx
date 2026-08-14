import React from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, success, disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        disabled={disabled}
        className={cn(
          'w-full px-3.5 py-2.5 text-sm rounded-lg border transition-colors outline-none font-sans',
          'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)]',
          'placeholder:text-[var(--muted-foreground)]',
          'focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20',
          'disabled:opacity-50 disabled:bg-[var(--muted)] disabled:cursor-not-allowed',
          error && 'border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]/20',
          success && 'border-[var(--success)] focus:border-[var(--success)] focus:ring-[var(--success)]/20',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
