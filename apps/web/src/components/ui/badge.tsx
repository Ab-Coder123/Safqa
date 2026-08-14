import React from 'react';
import { cn } from '../../lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'primary',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  const variants = {
    primary: 'bg-[var(--primary)] text-[var(--primary-foreground)]',
    secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)]',
    success: 'bg-[var(--success-background)] text-[var(--success-foreground)] border border-[var(--success)]/20',
    warning: 'bg-[var(--warning-background)] text-[var(--warning-foreground)] border border-[var(--warning)]/20',
    destructive: 'bg-[var(--destructive-background)] text-[var(--destructive-foreground)] border border-[var(--destructive)]/20',
    info: 'bg-[var(--info-background)] text-[var(--info-foreground)] border border-[var(--info)]/20',
    outline: 'text-[var(--foreground)] border border-[var(--border)]',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
