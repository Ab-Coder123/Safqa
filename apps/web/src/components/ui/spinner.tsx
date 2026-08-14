import React from 'react';
import { cn } from '../../lib/cn';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className, ...props }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <span
      className={cn(
        'inline-block rounded-full border-current border-t-transparent animate-spin opacity-80',
        sizes[size],
        className
      )}
      {...props}
    />
  );
};
