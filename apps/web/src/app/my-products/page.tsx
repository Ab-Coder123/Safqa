'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { SellerWorkspace } from '@/features/products/components';

export default function MyProductsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] dir-rtl">
        <Header />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SellerWorkspace />
        </main>
        <Footer />
        <MobileNav />
      </div>
    </AuthGuard>
  );
}
