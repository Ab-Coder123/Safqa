'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { SettingsWorkspace } from '@/features/users/components/settings-workspace';

function SettingsContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-[var(--foreground)] flex items-center gap-2">
            ⚙️ إعدادات الحساب
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            إدارة ملفك الشخصي وبياناتك وكلمة المرور
          </p>
        </div>

        <SettingsWorkspace />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
