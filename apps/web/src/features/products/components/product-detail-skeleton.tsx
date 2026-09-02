import React from 'react';
import { Skeleton } from '@/components/ui';

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Gallery & Description Skeleton */}
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-20 aspect-[4/3] rounded-xl" />
          ))}
        </div>
        <div className="space-y-3 pt-4">
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
        </div>
      </div>

      {/* Sidebar / Seller Card Skeleton */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <Skeleton className="h-10 w-40 rounded-lg" />
          <Skeleton className="h-4 w-28 rounded" />
          <div className="pt-4 border-t border-[var(--border)]/60 space-y-3">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
