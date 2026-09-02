import React from 'react';
import { Skeleton } from '@/components/ui';

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 space-y-3 shadow-sm"
        >
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <div className="space-y-2 px-1">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
            <div className="flex justify-between items-center pt-2 border-t border-[var(--border)]/40">
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="h-3 w-12 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
