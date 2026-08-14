import React from 'react';
import { cn } from '../../lib/cn';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({ className, required, children, ...props }) => {
  return (
    <label
      className={cn(
        'inline-block text-sm font-medium text-[var(--foreground)] mb-1.5 select-none',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-[var(--destructive)] me-1 ms-1">*</span>}
    </label>
  );
};
