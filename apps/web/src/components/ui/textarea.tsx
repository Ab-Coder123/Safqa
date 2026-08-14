import React from 'react';
import { cn } from '../../lib/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        className={cn(
          'w-full px-3.5 py-2.5 text-sm rounded-lg border transition-colors outline-none font-sans resize-y',
          'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)]',
          'placeholder:text-[var(--muted-foreground)]',
          'focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20',
          'disabled:opacity-50 disabled:bg-[var(--muted)] disabled:cursor-not-allowed',
          error && 'border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]/20',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
