import React from 'react';
import { cn } from '../../lib/cn';
import { Button } from './button';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'حدث خطأ أثناء تحميل البيانات',
  message = 'يرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى.',
  onRetry,
  className,
  ...rest
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive-background)] text-[var(--destructive-foreground)]',
        className
      )}
      {...rest}
    >
      <div className="text-3xl mb-2">⚠️</div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-xs opacity-90 max-w-sm mt-1 mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="destructive" size="sm" onClick={onRetry}>
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
};
