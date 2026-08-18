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
import { tokenStorage } from '@/lib/api';

export default function MyListingsPage() {
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

  if (!tokenStorage.hasToken()) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8 text-[var(--muted-foreground)]">
          يجب تسجيل الدخول لرؤية إعلاناتك
        </div>
        <Footer />
      </div>
    );
  }

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
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 p-3 rounded-xl text-sm mb-6">
            {actionMessage}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-[var(--muted-foreground)]">جاري التحميل...</div>
        ) : isError ? (
          <div className="text-center py-12 text-[var(--destructive)]">حدث خطأ أثناء تحميل الإعلانات</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8">
            <p className="text-4xl mb-4">🛒</p>
            <p className="text-base text-[var(--muted-foreground)] mb-4">لم تقم بنشر أي إعلانات بعد</p>
            <Link href="/products/create">
              <Button variant="outline" size="sm">ابدأ بنشر أول إعلان لك الآن →</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-bold text-[var(--foreground)]">{item.title}</h3>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === 'PUBLISHED'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : item.status === 'SOLD'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                      }`}
                    >
                      {item.status === 'PUBLISHED' ? 'معروض' : item.status === 'SOLD' ? 'تم البيع' : 'مؤرشف'}
                    </span>
                  </div>
                  <p className="text-base font-extrabold text-[var(--primary)] mb-1">
                    {item.price.toLocaleString('ar-EG')} جنيه
                  </p>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    القسم: {item.category?.name} | {new Date(item.created_at).toLocaleDateString('ar-EG')}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link href={`/products/${item.id}`}>
                    <Button variant="outline" size="sm">معاينة</Button>
                  </Link>
                  {item.status === 'PUBLISHED' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleMarkAsSold(item.id)}
                      disabled={markSoldMutation.isPending}
                    >
                      تم البيع
                    </Button>
                  )}
                  {item.status !== 'ARCHIVED' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleArchive(item.id)}
                      disabled={deleteMutation.isPending}
                    >
                      حذف
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
