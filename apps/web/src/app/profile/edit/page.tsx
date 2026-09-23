'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { EditProfileForm } from '@/features/users/components';

export default function EditProfilePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
        <Header />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
          <EditProfileForm />
        </main>
        <Footer />
        <MobileNav />
      </div>
    </AuthGuard>
  );
}
