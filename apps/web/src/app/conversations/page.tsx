'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { useConversations } from '@/features/conversations/hooks/use-conversations';
import { AuthGuard } from '@/features/auth/components/auth-guard';

function ConversationsContent() {
  const { data: conversations = [], isLoading: loading, isError } = useConversations();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-extrabold text-[var(--foreground)] mb-1">
          💬 المحادثات
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">صندوق الرسائل والمفاوضات المباشرة</p>

        {loading ? (
          <div className="text-center py-12 text-[var(--muted-foreground)]">جاري التحميل...</div>
        ) : isError ? (
          <div className="text-center py-12 text-[var(--destructive)]">حدث خطأ أثناء تحميل المحادثات</div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8">
            <p className="text-4xl mb-4">💬</p>
            <p className="text-base text-[var(--muted-foreground)] mb-4">لا توجد محادثات جارية</p>
            <Link href="/products">
              <Button variant="outline" size="sm">تصفح الإعلانات وتواصل مع البائعين ←</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/conversations/${conv.id}`}
                className="block bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm hover:border-[var(--primary)]/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--muted)] flex items-center justify-center overflow-hidden shrink-0">
                    {conv.buyer?.avatar_url || conv.seller?.avatar_url ? (
                      <img src={conv.buyer?.avatar_url || conv.seller?.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-[var(--muted-foreground)]">
                        {(conv.buyer?.full_name || conv.seller?.full_name || 'U')[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--foreground)] truncate">
                      {conv.buyer?.full_name || conv.seller?.full_name || 'مستخدم'}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">
                      {conv.product?.title || 'إعلان محذوف'}
                    </p>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="text-[11px] text-[var(--muted-foreground)]">
                      {new Date(conv.updated_at).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function ConversationsPage() {
  return (
    <AuthGuard>
      <ConversationsContent />
    </AuthGuard>
  );
}
