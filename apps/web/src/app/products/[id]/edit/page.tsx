'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button, Alert, Skeleton } from '@/components/ui';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useProduct } from '@/features/products/hooks/use-product';
import { ProductForm } from '@/features/products/components';
import { ChevronLeft, Edit3, ArrowRight, ShieldAlert } from 'lucide-react';
import { UserRole } from '@safqa/types';

function EditProductContent() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';

  const { data: currentUser } = useCurrentUser();

  const { data: product, isLoading, isError, error } = useProduct(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] dir-rtl">
        <Header />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-10 w-72 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] dir-rtl">
        <Header />
        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-2">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold">الإعلان غير موجود</h1>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            قد يكون هذا الإعلان قد تم حذفه أو أن الرابط غير صحيح.
          </p>
          <Link href="/products">
            <Button variant="outline" className="gap-2 text-xs">
              <ArrowRight className="w-4 h-4" />
              العودة إلى سوق الإعلانات
            </Button>
          </Link>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  // Ownership verification check
  const user = currentUser?.user ?? null;
  const isOwner = user && (user.id === product.user_id || user.id === product.user?.id);
  const isAdmin = user && user.role === UserRole.SUPER_ADMIN;

  if (user && !isOwner && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] dir-rtl">
        <Header />
        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-2">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold">غير مصرح لك بتعديل هذا الإعلان</h1>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            يمكن فقط لصاحب الإعلان أو المشرفين تعديل بياناته.
          </p>
          <Link href={`/products/${id}`}>
            <Button variant="outline" className="gap-2 text-xs">
              <ArrowRight className="w-4 h-4" />
              العودة لصفحة الإعلان
            </Button>
          </Link>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] dir-rtl">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-xs text-[var(--muted-foreground)] flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-[var(--primary)] transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-[var(--muted-foreground)]/60" />
          <Link href="/products" className="hover:text-[var(--primary)] transition-colors">
            سوق الإعلانات
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-[var(--muted-foreground)]/60" />
          <Link href={`/products/${id}`} className="hover:text-[var(--primary)] transition-colors line-clamp-1 max-w-[180px]">
            {product.title}
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-[var(--muted-foreground)]/60" />
          <span className="text-[var(--foreground)] font-semibold">تعديل الإعلان</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
              تعديل بيانات الإعلان
            </h1>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            قم بتحديث السعر أو الوصف أو معلومات التواصل للإعلان.
          </p>
        </div>

        {/* The Shared Form in Edit Mode */}
        <ProductForm mode="edit" initialData={product} />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function EditProductPage() {
  return (
    <AuthGuard>
      <EditProductContent />
    </AuthGuard>
  );
}
