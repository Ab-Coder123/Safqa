import React from 'react';
import { cn } from '../../lib/cn';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'destructive';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className,
  ...props
}) => {
  const variants = {
    info: 'bg-[var(--info-background)] border-[var(--info)]/30 text-[var(--info-foreground)]',
    success: 'bg-[var(--success-background)] border-[var(--success)]/30 text-[var(--success-foreground)]',
    warning: 'bg-[var(--warning-background)] border-[var(--warning)]/30 text-[var(--warning-foreground)]',
    destructive: 'bg-[var(--destructive-background)] border-[var(--destructive)]/30 text-[var(--destructive-foreground)]',
  };

  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-xl border p-4 text-sm flex flex-col gap-1',
        variants[variant],
        className
      )}
      {...props}
    >
      {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
      <div className="text-xs opacity-90 leading-relaxed">{children}</div>
    </div>
  );
};
