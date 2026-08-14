import React from 'react';
import { cn } from '../../lib/cn';
import { Spinner } from './spinner';

export interface LoadingStateProps {
  text?: string;
  fullPage?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  text = 'جاري التحميل...',
  fullPage = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-[var(--muted-foreground)]',
        fullPage ? 'fixed inset-0 bg-[var(--background)] z-50' : 'p-12',
        className
      )}
    >
      <Spinner size="lg" />
      {text && <p className="text-sm font-medium animate-pulse">{text}</p>}
    </div>
  );
};
