import React from 'react';
import { cn } from '../../lib/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  statusDot?: 'online' | 'offline' | 'busy';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'صفقة',
  size = 'md',
  statusDot,
  className,
  ...props
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (str: string) => {
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] font-semibold items-center justify-center border border-[var(--border)] select-none',
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {statusDot && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-[var(--background)]',
            size === 'sm' && 'w-2 h-2',
            size === 'md' && 'w-2.5 h-2.5',
            size === 'lg' && 'w-3 h-3',
            size === 'xl' && 'w-4 h-4',
            statusDot === 'online' && 'bg-[var(--success)]',
            statusDot === 'offline' && 'bg-[var(--muted-foreground)]',
            statusDot === 'busy' && 'bg-[var(--destructive)]'
          )}
        />
      )}
    </div>
  );
};
