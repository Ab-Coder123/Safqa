import React from 'react';
import { cn } from '../../lib/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-[var(--border)] opacity-70',
        className
      )}
      {...props}
    />
  );
};
