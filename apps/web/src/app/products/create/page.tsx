'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { CreateProductForm } from '@/features/products/components';
import { ChevronLeft, PlusCircle } from 'lucide-react';

function CreateProductContent() {
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
          <span className="text-[var(--foreground)] font-semibold">إضافة إعلان جديد</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
              نشر إعلان جديد على صفقة
            </h1>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            أدخل تفاصيل السلعة وصورها للتواصل المباشر مع آلاف المشترين عبر الواتساب.
          </p>
        </div>

        {/* The Form */}
        <CreateProductForm />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function CreateProductPage() {
  return (
    <AuthGuard>
      <CreateProductContent />
    </AuthGuard>
  );
}
