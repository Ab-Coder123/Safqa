'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import {
  ProductCard,
  ProductFilters,
  ProductGridSkeleton,
  type ProductFiltersState,
} from '@/features/products/components';
import { Button, EmptyState, Alert } from '@/components/ui';
import { Sparkles, ChevronRight, ChevronLeft, PackageSearch } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { useProducts } from '@/features/products/hooks/use-products';

const INITIAL_FILTERS: ProductFiltersState = {
  q: '',
  category_id: '',
  condition: 'ALL',
  min_price: '',
  max_price: '',
};

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFiltersState>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);

  // Debounce search query 400ms to avoid API flooding
  const debouncedQ = useDebounce(filters.q, 400);

  const parsedMinPrice = filters.min_price ? Number(filters.min_price) : undefined;
  const parsedMaxPrice = filters.max_price ? Number(filters.max_price) : undefined;

  const {
    data: result,
    isLoading: loading,
    isError,
    refetch,
  } = useProducts({
    q: debouncedQ || undefined,
    category_id: filters.category_id || undefined,
    condition: filters.condition !== 'ALL' ? filters.condition : undefined,
    min_price: !isNaN(parsedMinPrice as number) ? parsedMinPrice : undefined,
    max_price: !isNaN(parsedMaxPrice as number) ? parsedMaxPrice : undefined,
    page,
    limit: 12,
  });

  const handleFilterChange = (updated: Partial<ProductFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

  const products = result?.data || [];
  const totalPages = result?.totalPages || 1;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors dir-rtl">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[var(--primary)] to-emerald-800 text-white p-6 sm:p-10 mb-8 overflow-hidden shadow-lg">
          <div className="absolute -left-6 -bottom-6 opacity-10 text-white text-8xl font-black pointer-events-none select-none">
            صفقة
          </div>

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              سوق الصفقات الحرة
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              تصفح أحدث إعلانات البيع والشراء في مصر
            </h1>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl">
              تواصل مباشرة مع أصحاب الإعلانات عبر الواتساب بدون وسطاء أو عمولات.
            </p>
          </div>
        </div>

        {/* ── Advanced Filters ── */}
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          totalCount={result?.total}
          currentCount={products.length}
        />

        {/* ── Content View (Loading / Error / Empty / Grid) ── */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : isError ? (
          <div className="max-w-md mx-auto py-12 text-center space-y-4">
            <Alert variant="destructive" title="تعذر تحميل الإعلانات">
              حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.
            </Alert>
            <Button onClick={() => refetch()} variant="outline">
              إعادة المحاولة
            </Button>
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon="🛍️"
            title="لم نجد إعلانات مطابقة لبحثك"
            description="جرب البحث بكلمات مختلفة أو إزالة بعض خيارات التصفية لتوسيع نطاق البحث."
            actionLabel="إعادة ضبط خيارات البحث"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {result && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10 mb-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="gap-1 text-xs"
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </Button>

            <span className="text-xs text-[var(--muted-foreground)] px-2">
              صفحة <strong className="text-[var(--foreground)]">{page}</strong> من{' '}
              <strong className="text-[var(--foreground)]">{totalPages}</strong>
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="gap-1 text-xs"
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
