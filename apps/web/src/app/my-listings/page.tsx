'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { useMyListings } from '@/features/products/hooks/use-my-listings';
import { useMarkProductSold } from '@/features/products/hooks/use-mark-product-sold';
import { useDeleteProduct } from '@/features/products/hooks/use-delete-product';
import { AuthGuard } from '@/features/auth/components/auth-guard';

function MyListingsContent() {
  const { data: products = [], isLoading: loading, isError } = useMyListings();
  const markSoldMutation = useMarkProductSold();
  const deleteMutation = useDeleteProduct();
  const [actionMessage, setActionMessage] = useState('');

  const handleMarkAsSold = (id: string) => {
    markSoldMutation.mutate(id, {
      onSuccess: () => {
        setActionMessage('تم تحديث حالة الإعلان إلى "تم البيع"');
      },
    });
  };

  const handleArchive = (id: string) => {
    if (!confirm('هل أنت متأكد من أرشفة (حذف) هذا الإعلان؟')) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setActionMessage('تم أرشفة الإعلان بنجاح');
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--foreground)]">📦 إعلاناتي</h1>
            <p className="text-sm text-[var(--muted-foreground)]">إدارة جميع إعلاناتك المعروضة والمباعة</p>
          </div>
          <Link href="/products/create">
            <Button size="sm">+ إضافة إعلان جديد</Button>
          </Link>
        </div>

        {actionMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl text-sm mb-6">
            {actionMessage}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-[var(--muted-foreground)]">جاري التحميل...</div>
        ) : isError ? (
          <div className="text-center py-12 text-[var(--destructive)]">حدث خطأ أثناء تحميل الإعلانات</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-base text-[var(--muted-foreground)] mb-4">لم تقم بنشر أي إعلانات بعد</p>
            <Link href="/products/create">
              <Button>نشر أول إعلان لك الآن</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[var(--muted)] overflow-hidden shrink-0 flex items-center justify-center">
                    {product.media && product.media[0] ? (
                      <img src={(product.media[0] as any).file_url || product.media[0].url} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[var(--foreground)]">{product.title}</h3>
                    <p className="text-sm font-semibold text-[var(--primary)] mt-0.5">
                      {product.price.toLocaleString('ar-EG')} جنيه
                    </p>
                    <div className="flex gap-2 mt-1">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          product.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : product.status === 'SOLD'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        {product.status === 'PUBLISHED' ? 'معروض' : product.status === 'SOLD' ? 'تم البيع' : 'مؤرشف'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link href={`/products/${product.id}`}>
                    <Button variant="ghost" size="sm">معاينة</Button>
                  </Link>
                  {product.status === 'PUBLISHED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsSold(product.id)}
                      disabled={markSoldMutation.isPending}
                    >
                      تحديد كـ "تم البيع"
                    </Button>
                  )}
                  {product.status !== 'ARCHIVED' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => handleArchive(product.id)}
                      disabled={deleteMutation.isPending}
                    >
                      أرشفة
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <AuthGuard>
      <MyListingsContent />
    </AuthGuard>
  );
}
