import React from 'react';
import { cn } from '../../lib/cn';
import { Button } from './button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  ...rest
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]',
        className
      )}
      {...rest}
    >
      {icon && <div className="text-4xl text-[var(--muted-foreground)] mb-3">{icon}</div>}
      <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
      {description && (
        <p className="text-xs text-[var(--muted-foreground)] max-w-sm mt-1 mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
