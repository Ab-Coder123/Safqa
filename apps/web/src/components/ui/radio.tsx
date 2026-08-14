import React from 'react';
import { cn } from '../../lib/cn';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, disabled, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer select-none text-sm text-[var(--foreground)]',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <input
          type="radio"
          id={inputId}
          ref={ref}
          disabled={disabled}
          className="w-4 h-4 border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)] accent-[var(--primary)] cursor-pointer"
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
