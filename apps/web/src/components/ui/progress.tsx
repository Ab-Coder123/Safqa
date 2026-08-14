import React from 'react';
import { cn } from '../../lib/cn';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
}

export const Progress: React.FC<ProgressProps> = ({ value, className, ...props }) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-[var(--secondary)]',
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-[var(--primary)] transition-all duration-300 ease-in-out"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};
