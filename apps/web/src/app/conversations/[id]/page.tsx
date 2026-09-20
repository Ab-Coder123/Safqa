'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { ChatRoom } from '@/features/conversations/components';

function ChatRoomContent({ conversationId }: { conversationId: string }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 pb-20 lg:pb-6">
        <ChatRoom conversationId={conversationId} />
      </main>
      <Footer />
    </div>
  );
}

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
      <ChatRoomContent conversationId={params.id} />
    </AuthGuard>
  );
}
