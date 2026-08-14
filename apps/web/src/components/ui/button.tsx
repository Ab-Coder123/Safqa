import React from 'react';
import { cn } from '../../lib/cn';
import { Spinner } from './spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer border';
    
    const variants = {
      primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent hover:bg-[var(--primary-hover)] focus:ring-[var(--ring)]',
      secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] border-transparent hover:bg-[var(--secondary-hover)] focus:ring-[var(--ring)]',
      outline: 'bg-transparent text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--secondary)] focus:ring-[var(--ring)]',
      ghost: 'bg-transparent text-[var(--foreground)] border-transparent hover:bg-[var(--secondary)] focus:ring-[var(--ring)]',
      destructive: 'bg-[var(--destructive)] text-white border-transparent hover:opacity-90 focus:ring-[var(--destructive)]',
      link: 'bg-transparent text-[var(--primary)] border-transparent underline-offset-4 hover:underline p-0 h-auto',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 min-h-[32px] gap-1.5',
      md: 'text-sm px-4 py-2 min-h-[40px] gap-2',
      lg: 'text-base px-6 py-3 min-h-[48px] gap-2.5',
      icon: 'w-10 h-10 p-0 rounded-lg justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        style={{
          boxShadow: variant === 'primary' ? 'var(--shadow-sm)' : undefined,
        }}
        {...props}
      >
        {isLoading && <Spinner size={size === 'sm' ? 'sm' : 'md'} />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
