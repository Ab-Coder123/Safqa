'use client';

import React, { useState } from 'react';
import { Header } from '../../components/layout/header';
import { Footer } from '../../components/layout/footer';
import { MobileNav } from '../../components/layout/mobile-nav';
import { ProductCard } from '@/features/products/components/product-card';
import { Button, EmptyState, Skeleton } from '../../components/ui';
import { Search, Filter, Sparkles } from 'lucide-react';
import { useDebounce } from '../../hooks/use-debounce';
import { useProducts } from '@/features/products/hooks/use-products';

const conditions = [
  { key: 'ALL', label: 'الكل' },
  { key: 'NEW', label: 'جديد' },
  { key: 'LIKE_NEW', label: 'شبه جديد' },
  { key: 'USED_GOOD', label: 'مستعمل بحالة جيدة' },
];

export default function MarketplacePage() {
  const [q, setQ] = useState('');
  const [condition, setCondition] = useState('ALL');
  const [page, setPage] = useState(1);

  // ✅ Performance: Debounce search query 400ms to avoid API call on every keystroke
  const debouncedQ = useDebounce(q, 400);

  // ✅ Server State: TanStack Query hook
  const { data: result, isLoading: loading } = useProducts({
    q: debouncedQ,
    condition: condition !== 'ALL' ? condition : undefined,
    page,
    limit: 12,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const maxW: React.CSSProperties = {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '0 1.5rem',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)', color: 'var(--foreground)', direction: 'rtl' }}>
      <Header />

      <main style={{ flex: 1 }}>
        <div style={maxW}>
          {/* ── Hero Banner ── */}
          <div style={{ position: 'relative', borderRadius: '20px', background: 'linear-gradient(135deg, var(--primary), #065f46)', color: '#fff', padding: '2.5rem', marginTop: '2rem', marginBottom: '2rem', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            {/* Watermark */}
            <div style={{ position: 'absolute', left: '-20px', bottom: '-20px', opacity: 0.08, color: '#fff', fontSize: '6rem', fontWeight: 900, pointerEvents: 'none', userSelect: 'none', lineHeight: 1 }}>
              صفقة
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem' }}>
                <Sparkles size={14} />
                سوق صفقة المباشر
              </div>

              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1.25, marginBottom: '0.75rem' }}>
                تصفح أحدث الإعلانات والصفقات المتاحة
              </h1>

              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                ابحث عن المنتجات الحقيقية المستعملة والجديدة وتواصل مباشرة مع أصحابها.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', borderRadius: '12px', padding: '6px', boxShadow: 'var(--shadow-md)', maxWidth: '480px' }}>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                  placeholder="ما الذي تبحث عنه اليوم؟"
                  style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: 'var(--foreground)', backgroundColor: 'transparent', border: 'none', outline: 'none', direction: 'rtl' }}
                />
                <Button type="submit" size="sm">
                  <Search size={14} style={{ marginLeft: '4px' }} />
                  بحث
                </Button>
              </form>
            </div>
          </div>

          {/* ── Filters ── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted-foreground)' }}>
                <Filter size={14} />
                الحالة:
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
                >
                  {c.label}
                </Button>
              ))}
            </div>

            {result && (
              <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>
                عرض <strong style={{ color: 'var(--foreground)' }}>{result.data.length}</strong> من إجمالي{' '}
                <strong style={{ color: 'var(--foreground)' }}>{result.total}</strong> إعلان
              </p>
            )}
          </div>

          {/* ── Product Grid ── */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
                  <Skeleton style={{ aspectRatio: '4/3', width: '100%', borderRadius: '10px' }} />
                  <Skeleton style={{ height: '14px', width: '75%' }} />
                  <Skeleton style={{ height: '14px', width: '50%' }} />
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {result.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {result && result.totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '3rem', marginBottom: '2rem' }}>
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← السابق
              </Button>

              <span style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', padding: '0 0.5rem' }}>
                صفحة <strong style={{ color: 'var(--foreground)' }}>{page}</strong> من{' '}
                <strong style={{ color: 'var(--foreground)' }}>{result.totalPages}</strong>
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
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
