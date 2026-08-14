import React from 'react';
import { cn } from '../../lib/cn';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn(
      'rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-sm transition-all hover:shadow-md',
      className
    )}
    {...props}
  />
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6 border-b border-[var(--border)]/50', className)} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-sm text-[var(--muted-foreground)]', className)} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-6', className)} {...props} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
);
