'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Header } from '../../components/layout/header';
import { Footer } from '../../components/layout/footer';
import { MobileNav } from '../../components/layout/mobile-nav';
import { ProductCard } from '../../components/marketplace/product-card';
import { Button, Badge, EmptyState, Skeleton } from '../../components/ui';
import { Search, Sparkles, Filter } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  condition: string;
  status: string;
  created_at: string;
  category?: { name: string; slug?: string };
  media?: { url: string }[];
}

interface PaginatedResult {
  data: Product[];
  total: number;
  page: number;
  totalPages: number;
}

const conditions = [
  { key: 'ALL', label: 'الكل' },
  { key: 'NEW', label: 'جديد' },
  { key: 'LIKE_NEW', label: 'شبه جديد' },
  { key: 'USED_GOOD', label: 'مستعمل بحالة جيدة' },
];

export default function MarketplacePage() {
  const [result, setResult] = useState<PaginatedResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [condition, setCondition] = useState('ALL');
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (condition !== 'ALL') params.set('condition', condition);
    params.set('page', String(page));
    params.set('limit', '12');

    try {
      const res = await fetch(`http://localhost:3001/products?${params.toString()}`);
      const data: PaginatedResult = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [q, condition, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[var(--primary)] to-emerald-800 text-white p-8 sm:p-12 mb-10 overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white backdrop-blur-md border-none">
              <Sparkles className="w-3.5 h-3.5 ms-1" /> سوق صفقة المباشر
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
              تصفح أحدث الإعلانات والصفقات المتاحة
            </h1>
            <p className="text-sm sm:text-base text-white/90 mb-6 leading-relaxed">
              ابحث عن المنتجات الحقيقية المستعملة والجديدة وتواصل مباشرة مع أصحابها.
            </p>

            {/* Quick Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-md max-w-lg">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ما الذي تبحث عنه اليوم؟"
                className="flex-1 px-4 py-2 text-sm text-[var(--foreground)] bg-transparent focus:outline-none placeholder:text-gray-400"
              />
              <Button type="submit" size="sm" className="shrink-0 gap-1 font-bold">
                <Search className="w-4 h-4" />
                بحث
              </Button>
            </form>
          </div>

          <div className="absolute -left-10 -bottom-10 opacity-10 text-white pointer-events-none select-none text-9xl font-extrabold">
            صفقة
          </div>
        </div>

        {/* Filters & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[var(--muted-foreground)] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> الحالة:
            </span>
            {conditions.map((c) => (
              <Button
                key={c.key}
                size="sm"
                variant={condition === c.key ? 'primary' : 'outline'}
                onClick={() => {
                  setCondition(c.key);
                  setPage(1);
                }}
                className="rounded-full text-xs"
              >
                {c.label}
              </Button>
            ))}
          </div>

          {result && (
            <p className="text-xs text-[var(--muted-foreground)]">
              عرض <span className="font-bold text-[var(--foreground)]">{result.data.length}</span> من إجمالي <span className="font-bold text-[var(--foreground)]">{result.total}</span> إعلان
            </p>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : !result?.data || result.data.length === 0 ? (
          <EmptyState
            icon="🛍️"
            title="لم نجد إعلانات مطابقة"
            description="جرب البحث بكلمات مختلفة أو تغيير خيارات التصفية لعرض المزيد من الإعلانات."
            actionLabel="إعادة ضبط البحث"
            onAction={() => {
              setQ('');
              setCondition('ALL');
              setPage(1);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {result.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {result && result.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← السابق
            </Button>
            <span className="text-xs text-[var(--muted-foreground)] px-3">
              صفحة <strong className="text-[var(--foreground)]">{page}</strong> من <strong className="text-[var(--foreground)]">{result.totalPages}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= result.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              التالي →
            </Button>
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
