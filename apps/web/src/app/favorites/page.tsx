'use client';

import React from 'react';
import { Header } from '../../components/layout/header';
import { Footer } from '../../components/layout/footer';
import { MobileNav } from '../../components/layout/mobile-nav';
import { ProductCard } from '@/features/products/components/product-card';
import { EmptyState, Skeleton, Alert } from '../../components/ui';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/features/favorites/hooks/use-favorites';
import { AuthGuard } from '@/features/auth/components/auth-guard';

function FavoritesContent() {
  const { data: favorites = [], isLoading: loading, isError } = useFavorites();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--foreground)]">الإعلانات المفضلة</h1>
            <p className="text-xs text-[var(--muted-foreground)]">الإعلانات التي قمت بحفظها للرجوع إليها لاحقاً والتواصل مع أصحابها</p>
          </div>
        </div>

        {isError ? (
          <Alert variant="destructive" title="خطأ في الوصول">
            حدث خطأ أثناء تحميل المفضلة
          </Alert>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <EmptyState
            icon="❤️"
            title="لا توجد إعلانات مفضلة بعد"
            description="يمكنك ضغط أيقونة القلب على أي إعلان لحفظه هنا وسهولة الرجوع إليه."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <ProductCard
                key={item.id}
                product={(item as any).product || item}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <FavoritesContent />
    </AuthGuard>
  );
}
