'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ProductCard } from '@/features/products/components/product-card';
import { useUserProfile } from '@/features/users/hooks/use-user-profile';
import { Button, Skeleton } from '@/components/ui';
import { User, Calendar, ShieldCheck, ArrowRight, Package } from 'lucide-react';

const dateFormatter = new Intl.DateTimeFormat('ar-EG', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export default function UserPublicProfilePage({ params }: { params: { id: string } }) {
  const { data: profileData, isLoading: loading, isError } = useUserProfile(params.id);

  const profile = useMemo(() => {
    return (profileData as any)?.user ?? profileData;
  }, [profileData]);

  const joinDate = useMemo(() => {
    if (!profile?.created_at) return '';
    try {
      return dateFormatter.format(new Date(profile.created_at));
    } catch {
      return profile.created_at;
    }
  }, [profile?.created_at]);

  const products = useMemo(() => profile?.products ?? [], [profile?.products]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 flex items-center gap-6">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48 rounded-lg" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </div>
        ) : isError || !profile ? (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">المستخدم غير موجود</h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              ربما تم حذف هذا الحساب أو أن الرابط غير صحيح.
            </p>
            <Link href="/products">
              <Button size="sm" variant="outline" className="gap-1.5 font-bold">
                <ArrowRight className="w-4 h-4" />
                تصفح الإعلانات
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Seller Header */}
            <div className="bg-gradient-to-br from-[var(--surface)] via-[var(--card)] to-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-right">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/70 text-white flex items-center justify-center text-3xl font-extrabold shadow-md border-4 border-[var(--background)] shrink-0 overflow-hidden">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                  ) : (
                    profile.full_name?.charAt(0) || '👤'
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                        {profile.full_name}
                      </h1>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          بائع موثوق
                        </span>
                        {joinDate && (
                          <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            عضو منذ {joinDate}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link href="/products">
                      <Button size="sm" variant="ghost" className="gap-1.5 text-xs">
                        <ArrowRight className="w-4 h-4" />
                        العودة للسوق
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Products Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-[var(--foreground)] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[var(--primary)]" />
                  إعلانات البائع ({products.length})
                </h2>
              </div>

              {products.length === 0 ? (
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-10 text-center space-y-2 text-[var(--muted-foreground)]">
                  <Package className="w-8 h-8 mx-auto text-[var(--muted-foreground)]/60" />
                  <p className="text-sm font-semibold text-[var(--foreground)]">لا توجد إعلانات منشورة حالياً لهذا البائع</p>
                  <p className="text-xs">قد تكون جميع الإعلانات مباعة أو تم أرشفة العروض.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {products.map((p: any) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
