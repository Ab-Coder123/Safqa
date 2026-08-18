'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ProductCard } from '@/components/marketplace/product-card';
import { useUserProfile } from '@/features/users/hooks/use-user-profile';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { data: profileData, isLoading: loading, isError } = useUserProfile(params.id);

  const profile = profileData?.user;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="text-center py-16 text-[var(--muted-foreground)]">جاري التحميل...</div>
        ) : isError || !profile ? (
          <div className="text-center py-16 text-[var(--destructive)]">لم يتم العثور على المستخدم</div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 mb-8 flex items-center gap-5 shadow-sm">
              <div className="w-20 h-20 rounded-full bg-[var(--muted)] flex items-center justify-center overflow-hidden shrink-0 text-3xl">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                ) : (
                  '👤'
                )}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[var(--foreground)]">{profile.full_name}</h1>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  عضو منذ {new Date(profile.created_at).toLocaleDateString('ar-EG')}
                </p>
              </div>
            </div>

            {/* Listings */}
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">
              إعلانات المستخدم ({profile.products?.length || 0})
            </h2>
            {!profile.products?.length ? (
              <div className="text-center py-12 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-[var(--muted-foreground)] text-sm">
                لا توجد إعلانات منشورة حالياً
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {profile.products.map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
