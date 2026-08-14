import React from 'react';
import { cn } from '../../lib/cn';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Separator: React.FC<SeparatorProps> = ({
  className,
  orientation = 'horizontal',
  ...props
}) => {
  return (
    <div
      role="separator"
      className={cn(
        'bg-[var(--border)] shrink-0 transition-colors',
        orientation === 'horizontal' ? 'h-[1px] w-full my-4' : 'h-full w-[1px] mx-4',
        className
      )}
      {...props}
    />
  );
};
