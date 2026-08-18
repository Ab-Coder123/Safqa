'use client';

import React from 'react';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function CategoriesPage() {
  const { data: categories = [], isLoading, isError } = useCategories();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold text-[var(--foreground)] mb-2">تصفح الأقسام</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-8">اختر القسم الذي يناسبك للبحث وتصفح الإعلانات داخله</p>

        {isLoading ? (
          <div className="text-center py-12 text-[var(--muted-foreground)]">جاري تحميل الأقسام...</div>
        ) : isError ? (
          <div className="text-center py-12 text-[var(--destructive)]">فشل تحميل الأقسام</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-center shadow-sm hover:border-[var(--primary)]/50 transition-all cursor-pointer group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {cat.icon_url || '📦'}
                </div>
                <h2 className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                  {cat.name}
                </h2>
                {cat.children && cat.children.length > 0 && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    {cat.children.length} قسم فرعي
                  </p>
                )}
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
