'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import { ArrowRight, Send, Check, CheckCheck, Clock, ExternalLink, MessageCircle, AlertCircle } from 'lucide-react';
import { Button, Input, Skeleton } from '@/components/ui';
import { useConversation } from '../hooks/use-conversation';
import { useConversationMessages } from '../hooks/use-conversation-messages';
import { useSendMessage } from '../hooks/use-send-message';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import type { MessageItem } from '../api/conversations.api';

// ─── Helpers ────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function resolveUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
}

const timeFormatter = new Intl.DateTimeFormat('ar-EG', {
  hour: '2-digit',
  minute: '2-digit',
});

function formatMessageTime(dateStr: string): string {
  try {
    return timeFormatter.format(new Date(dateStr));
  } catch {
    return '';
  }
}

// ─── Memoized Message Bubble ──────────────────────────────────────────────────

interface MessageBubbleProps {
  message: MessageItem;
  isMine: boolean;
}

const MessageBubble = memo(function MessageBubble({ message, isMine }: MessageBubbleProps) {
  const time = useMemo(() => formatMessageTime(message.created_at), [message.created_at]);

  return (
    <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} my-1.5 transition-opacity duration-150`}>
      <div
        className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-xs break-words select-text ${
          isMine
            ? 'bg-[var(--primary)] text-white rounded-br-xs'
            : 'bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] rounded-bl-xs'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>

      <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-[var(--muted-foreground)]">
        <span>{time}</span>
        {isMine && (
          <span title={message.is_read ? 'تمت القراءة' : 'تم الإرسال'}>
            {message.is_read ? (
              <CheckCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
            ) : (
              <Check className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            )}
          </span>
        )}
      </div>
    </div>
  );
});

// ─── Isolated Input Bar (Typing does NOT re-render message list) ──────────────

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
  isPending: boolean;
}

const ChatInputBar = memo(function ChatInputBar({ onSendMessage, isPending }: ChatInputBarProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isPending) return;
    const content = text.trim();
    setText('');
    onSendMessage(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2 bg-[var(--background)]">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="اكتب رسالتك هنا... (اضغط Enter للإرسال)"
        className="flex-1 h-12 rounded-xl bg-[var(--card)] border-[var(--border)] px-4 text-sm"
        disabled={isPending}
      />
      <Button
        type="submit"
        disabled={!text.trim() || isPending}
        className="h-12 px-5 rounded-xl gap-1.5 font-bold shadow-sm"
      >
        <span>{isPending ? 'جاري...' : 'إرسال'}</span>
        <Send className="w-4 h-4 rtl:rotate-180" />
      </Button>
    </form>
  );
});

// ─── Memoized Header with Product Details ────────────────────────────────────

interface ChatHeaderProps {
  conversationId: string;
}

const ChatHeader = memo(function ChatHeader({ conversationId }: ChatHeaderProps) {
  const { data: conv } = useConversation(conversationId);

  const otherUser = conv?.other_user;
  const product = conv?.product;
  const avatarUrl = resolveUrl(otherUser?.avatar_url);
  const productImageUrl = product?.media && product.media.length > 0 ? resolveUrl(product.media[0].url) : null;

  const initials = useMemo(() => {
    if (!otherUser?.full_name) return 'U';
    return otherUser.full_name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [otherUser?.full_name]);

  const whatsappHref = useMemo(() => {
    const rawNumber = product?.whatsapp_number || otherUser?.phone_number;
    if (!rawNumber) return null;
    const digits = rawNumber.replace(/\D/g, '');
    const cleanNumber = digits.startsWith('0') ? `2${digits}` : digits;
    const prefilledText = encodeURIComponent(`مرحباً ${otherUser?.full_name || ''}، بخصوص إعلانك "${product?.title || ''}" على صفقة:`);
    return `https://wa.me/${cleanNumber}?text=${prefilledText}`;
  }, [product?.whatsapp_number, product?.title, otherUser?.phone_number, otherUser?.full_name]);

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm mb-3">
      <div className="flex items-center justify-between gap-3">
        {/* User Info & Back Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/conversations"
            className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors shrink-0"
            title="العودة لصندوق المحادثات"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-0 rotate-180" />
          </Link>

          <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--muted)] shrink-0 flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt={otherUser?.full_name || ''} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/70 text-white flex items-center justify-center font-bold text-xs">
                {initials}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-[var(--foreground)] leading-tight">
              {otherUser?.full_name || 'محادثة'}
            </h2>
            <p className="text-[11px] text-[var(--muted-foreground)]">متصل الآن عبر صفقة</p>
          </div>
        </div>

        {/* WhatsApp External Transition (Workflow Spec) */}
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">محادثة واتساب</span>
          </a>
        )}
      </div>

      {/* Linked Product Banner */}
      {product && (
        <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {productImageUrl && (
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-[var(--border)] shrink-0 bg-[var(--muted)]">
                <img src={productImageUrl} alt={product.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-[var(--foreground)] truncate">{product.title}</p>
              <p className="text-[11px] font-extrabold text-[var(--primary)]">
                {product.price.toLocaleString('ar-EG')} ج.م
              </p>
            </div>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--primary)] hover:underline shrink-0"
          >
            <span>عرض الإعلان</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
});

// ─── Main Chat Room Component ─────────────────────────────────────────────────

interface ChatRoomProps {
  conversationId: string;
}

export function ChatRoom({ conversationId }: ChatRoomProps) {
  const { data: messages = [], isLoading, isError } = useConversationMessages(conversationId);
  const { data: userData } = useCurrentUser();
  const sendMessageMutation = useSendMessage(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = userData?.user?.id || '';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  const handleSendMessage = useCallback(
    (content: string) => {
      sendMessageMutation.mutate(content);
    },
    [sendMessageMutation]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] max-w-3xl w-full mx-auto">
      {/* Header */}
      <ChatHeader conversationId={conversationId} />

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-[var(--muted)]/20 border border-[var(--border)] rounded-2xl p-4 overflow-y-auto shadow-inner">
        {isLoading ? (
          <div className="space-y-3 p-4 animate-pulse">
            <Skeleton className="h-10 w-48 rounded-2xl self-start" />
            <Skeleton className="h-12 w-64 rounded-2xl self-end ml-auto" />
            <Skeleton className="h-8 w-40 rounded-2xl self-start" />
            <Skeleton className="h-14 w-72 rounded-2xl self-end ml-auto" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-rose-500 flex flex-col items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            <p className="text-sm font-bold">تعذر تحميل رسائل المحادثة</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 text-[var(--muted-foreground)] space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mx-auto mb-2">
              <MessageCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[var(--foreground)]">ابدأ المحادثة الآن</p>
            <p className="text-xs">اكتب رسالتك الأولى للتفاوض أو الاستفسار عن تفاصيل الصفقة.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isMine={msg.sender_id === currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Isolated Input Form */}
      <ChatInputBar
        onSendMessage={handleSendMessage}
        isPending={sendMessageMutation.isPending}
      />
    </div>
  );
}
