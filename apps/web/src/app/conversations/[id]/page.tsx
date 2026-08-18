'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useConversationMessages } from '@/features/conversations/hooks/use-conversation-messages';
import { useSendMessage } from '@/features/conversations/hooks/use-send-message';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { tokenStorage } from '@/lib/api';

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  const { data: messages = [], isLoading: loading, isError } = useConversationMessages(params.id);
  const { data: userData } = useCurrentUser();
  const sendMessageMutation = useSendMessage(params.id);
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

  if (!tokenStorage.hasToken()) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8 text-[var(--muted-foreground)]">
          يجب تسجيل الدخول لمشاهدة الرسائل
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 flex flex-col h-[calc(100vh-8rem)]">
        <h1 className="text-xl font-extrabold text-[var(--foreground)] mb-3">
          💬 غرفة المحادثة
        </h1>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-[var(--muted-foreground)]">جاري التحميل...</div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center text-[var(--destructive)]">حدث خطأ أثناء تحميل الرسائل</div>
        ) : (
          <div className="flex-1 flex flex-col bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
            {/* Message History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[var(--muted)]/20">
              {messages.length === 0 ? (
                <p className="text-center text-sm text-[var(--muted-foreground)] my-auto">لا توجد رسائل سابقة. ابدأ المحادثة الآن!</p>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                        isMe
                          ? 'mr-auto bg-[var(--primary)] text-white rounded-bl-sm'
                          : 'ml-auto bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] rounded-br-sm'
                      }`}
                    >
                      {!isMe && (
                        <span className="text-xs text-[var(--muted-foreground)] block mb-1 font-bold">
                          {msg.sender?.full_name}
                        </span>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <span
                        className={`text-[10px] block text-left mt-1 ${
                          isMe ? 'text-white/80' : 'text-[var(--muted-foreground)]'
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[var(--card)] border-t border-[var(--border)] flex gap-2">
              <Input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                maxLength={2000}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={sendMessageMutation.isPending || !inputText.trim()}
              >
                {sendMessageMutation.isPending ? 'إرسال...' : 'إرسال 🚀'}
              </Button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
