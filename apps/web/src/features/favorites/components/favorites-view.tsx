'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, RefreshCw, ShoppingBag, Sparkles } from 'lucide-react';
import { Button, Skeleton } from '@/components/ui';
import { ProductCard } from '@/features/products/components/product-card';
import { useFavorites } from '../hooks/use-favorites';

export function FavoritesView() {
  const { data: favorites = [], isLoading, isError, refetch, isRefetching } = useFavorites();

  const count = favorites.length;

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-500/10 via-[var(--card)] to-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)] tracking-tight">
                الإعلانات المفضلة
              </h1>
              {!isLoading && !isError && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                  {count} {count === 1 ? 'إعلان' : count === 2 ? 'إعلانان' : count > 10 ? 'إعلان' : 'إعلانات'}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              جميع المنتجات والإعلانات التي قمت بحفظها لسهولة المتابعة والتفاوض لاحقاً
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching || isLoading}
            className="text-xs gap-1.5 h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
            تحديث
          </Button>

          <Link href="/products">
            <Button size="sm" variant="primary" className="text-xs gap-1.5 h-9">
              <ShoppingBag className="w-3.5 h-3.5" />
              تصفح الإعلانات
            </Button>
          </Link>
        </div>
      </div>

      {/* ── ERROR STATE ── */}
      {isError && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl p-6 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-rose-700 dark:text-rose-400 mb-1">
            تعذر تحميل قائمة المفضلة
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mb-4 max-w-md mx-auto">
            حدث خطأ أثناء الاتصال بالخادم لجلب إعلاناتك المحفوظة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="text-xs gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            إعادة المحاولة
          </Button>
        </div>
      )}

      {/* ── LOADING SKELETON ── */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-3 space-y-3 animate-pulse shadow-sm"
            >
              <Skeleton className="w-full aspect-[4/3] rounded-xl" />
              <div className="space-y-2 p-1">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-5 w-1/3 rounded-md" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-3 w-1/4 rounded-md" />
                  <Skeleton className="h-3 w-1/4 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!isLoading && !isError && count === 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-10 sm:p-14 text-center shadow-sm max-w-xl mx-auto my-8">
          <div className="relative w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-200 dark:border-rose-900 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500/20" />
            <span className="absolute -top-1.5 -right-1.5 bg-[var(--primary)] text-white p-1 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-[var(--foreground)] mb-2">
            قائمتك المفضلة فارغة حالياً
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-8 leading-relaxed max-w-md mx-auto">
            لم تقم بحفظ أي منتجات أو إعلانات بعد. عندما يعجبك أي إعلان أثناء التصفح، اضغط على زر القلب ❤️ لحفظه والرجوع إليه في أي وقت!
          </p>

          <Link href="/products">
            <Button size="lg" variant="primary" className="font-bold gap-2 px-6 shadow-md hover:shadow-lg transition-shadow">
              <span>استكشف الإعلانات الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* ── FAVORITES GRID ── */}
      {!isLoading && !isError && count > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((item) => {
            const product = (item as any).product || item;
            return (
              <ProductCard
                key={product.id}
                product={product}
                initialFavorited={true}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
