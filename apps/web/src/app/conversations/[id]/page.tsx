'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useConversationMessages } from '@/features/conversations/hooks/use-conversation-messages';
import { useSendMessage } from '@/features/conversations/hooks/use-send-message';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { AuthGuard } from '@/features/auth/components/auth-guard';

function ChatRoomContent({ conversationId }: { conversationId: string }) {
  const { data: messages = [], isLoading: loading, isError } = useConversationMessages(conversationId);
  const { data: userData } = useCurrentUser();
  const sendMessageMutation = useSendMessage(conversationId);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = userData?.user?.id || '';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sendMessageMutation.isPending) return;

    const textToSend = inputText.trim();
    setInputText('');

    sendMessageMutation.mutate(textToSend);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 flex flex-col h-[calc(100vh-8rem)]">
        <h1 className="text-xl font-extrabold text-[var(--foreground)] mb-3">
          💬 غرفة المحادثة
        </h1>

        {/* Message Container */}
        <div className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 overflow-y-auto space-y-3 mb-4 shadow-inner">
          {loading ? (
            <div className="text-center py-12 text-[var(--muted-foreground)]">جاري تحميل الرسائل...</div>
          ) : isError ? (
            <div className="text-center py-12 text-[var(--destructive)]">فشل تحميل الرسائل</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-[var(--muted-foreground)]">ابدأ المحادثة الآن...</div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMine
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] rounded-br-none'
                        : 'bg-[var(--muted)] text-[var(--foreground)] rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-[var(--muted-foreground)] mt-1 px-1">
                    {new Date(msg.created_at).toLocaleTimeString('ar-EG', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 rounded-xl"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            type="submit"
            disabled={!inputText.trim() || sendMessageMutation.isPending}
            className="rounded-xl px-6"
          >
            {sendMessageMutation.isPending ? 'إرسال...' : 'إرسال'}
          </Button>
        </form>
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
