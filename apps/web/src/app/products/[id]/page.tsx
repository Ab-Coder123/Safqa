'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useProduct } from '@/features/products/hooks/use-product';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { data: product, isLoading: loading, isError, error } = useProduct(params.id);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)]">
        <Header />
        <div className="flex-1 flex items-center justify-center text-[var(--muted-foreground)]">جاري التحميل...</div>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)]">
        <Header />
        <div className="flex-1 flex items-center justify-center text-[var(--destructive)]">
          {(error as any)?.message || 'لم يتم العثور على الإعلان'}
        </div>
        <Footer />
      </div>
    );
  }

  const conditionLabel: Record<string, string> = {
    NEW: 'جديد',
    LIKE_NEW: 'شبه جديد',
    USED_GOOD: 'مستعمل بحالة جيدة',
    USED_FAIR: 'مستعمل بحالة مقبولة',
  };
  const isSold = product.status === 'SOLD';
  const isArchived = product.status === 'ARCHIVED';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[var(--muted-foreground)] flex items-center gap-2">
          <Link href="/" className="text-[var(--primary)] hover:underline">الرئيسية</Link>
          <span>&gt;</span>
          <Link href="/products" className="text-[var(--primary)] hover:underline">الإعلانات</Link>
          {product.category && (
            <>
              <span>&gt;</span>
              <span className="text-[var(--foreground)] font-medium">{product.category.name}</span>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT — Image & Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[16/10] w-full rounded-2xl bg-[var(--muted)] overflow-hidden flex items-center justify-center border border-[var(--border)]">
              {product.media && product.media.length > 0 ? (
                <img src={product.media[0].url} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl">📦</span>
              )}
              {(isSold || isArchived) && (
                <div className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1.5 rounded-full ${isSold ? 'bg-amber-500' : 'bg-red-500'}`}>
                  {isSold ? 'تم البيع' : 'محذوف'}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-[var(--foreground)] mb-3">{product.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[var(--accent)] text-[var(--primary)] px-3 py-1 rounded-full text-xs font-bold">
                  {conditionLabel[product.condition] || product.condition}
                </span>
                {product.category && (
                  <span className="bg-[var(--muted)] text-[var(--muted-foreground)] px-3 py-1 rounded-full text-xs font-medium">
                    {product.category.name}
                  </span>
                )}
              </div>

              <h2 className="text-base font-bold text-[var(--foreground)] mb-2">تفاصيل الإعلان</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
          </div>

          {/* RIGHT — Price & Seller Card */}
          <div className="space-y-6">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm sticky top-20">
              <p className="text-3xl font-extrabold text-[var(--primary)] mb-1">
                {product.price.toLocaleString('ar-EG')} <span className="text-sm font-normal">جنيه</span>
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mb-6">
                نُشر في {new Date(product.created_at).toLocaleDateString('ar-EG')}
              </p>

              <div className="border-t border-[var(--border)] pt-4 mt-4">
                <p className="text-xs font-bold text-[var(--muted-foreground)] mb-3">معلومات البائع</p>
                {product.user && (
                  <Link href={`/users/${product.user.id}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center overflow-hidden">
                      {product.user.avatar_url ? (
                        <img src={product.user.avatar_url} alt={product.user.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <span>👤</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                        {product.user.full_name}
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
