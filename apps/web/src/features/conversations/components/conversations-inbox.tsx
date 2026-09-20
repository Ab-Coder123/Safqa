'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import { Search, MessageSquare, ShoppingBag, ArrowLeft, Clock, ShieldCheck, User } from 'lucide-react';
import { Input, Button, Skeleton } from '@/components/ui';
import { useConversations } from '../hooks/use-conversations';
import type { ConversationItem } from '../api/conversations.api';

// ─── Helpers ────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function resolveUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
}

const arabicDateFormatter = new Intl.DateTimeFormat('ar-EG', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function formatTime(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    return arabicDateFormatter.format(new Date(dateStr));
  } catch {
    return '';
  }
}

// ─── Memoized Conversation Card ──────────────────────────────────────────────

interface ConversationCardProps {
  conversation: ConversationItem;
}

const ConversationCard = memo(function ConversationCard({ conversation }: ConversationCardProps) {
  const otherUser = conversation.other_user;
  const product = conversation.product;
  const lastMessage = conversation.last_message;
  const unreadCount = conversation.unread_count || 0;

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

  return (
    <Link
      href={`/conversations/${conversation.id}`}
      className={`group block bg-[var(--card)] border rounded-2xl p-4 transition-all duration-200 hover:shadow-md hover:border-[var(--primary)]/60 ${
        unreadCount > 0
          ? 'border-[var(--primary)]/40 bg-[var(--primary)]/[0.02]'
          : 'border-[var(--border)]'
      }`}
    >
      <div className="flex items-center gap-3.5">
        {/* User Avatar */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--muted)] flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt={otherUser.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/70 text-white flex items-center justify-center font-bold text-sm">
                {initials}
              </div>
            )}
          </div>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[11px] font-extrabold flex items-center justify-center shadow-sm">
              {unreadCount > 9 ? '+9' : unreadCount}
            </span>
          )}
        </div>

        {/* Content Preview */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-sm font-bold text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
              {otherUser?.full_name || 'مستخدم'}
            </h3>
            <span className="text-[11px] text-[var(--muted-foreground)] shrink-0 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(conversation.updated_at)}
            </span>
          </div>

          {/* Linked Product Info */}
          {product ? (
            <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-1">
              <span className="font-medium text-[var(--foreground)] truncate max-w-[200px]">
                {product.title}
              </span>
              <span>•</span>
              <span className="font-bold text-[var(--primary)] shrink-0">
                {product.price.toLocaleString('ar-EG')} ج.م
              </span>
            </div>
          ) : (
            <div className="text-xs text-[var(--muted-foreground)] mb-1">إعلان معروض</div>
          )}

          {/* Last Message Excerpt */}
          <p
            className={`text-xs truncate ${
              unreadCount > 0
                ? 'font-bold text-[var(--foreground)]'
                : 'text-[var(--muted-foreground)]'
            }`}
          >
            {lastMessage ? lastMessage.content : 'لا توجد رسائل بعد...'}
          </p>
        </div>

        {/* Product Thumbnail (if available) */}
        {productImageUrl && (
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-[var(--border)] shrink-0 bg-[var(--muted)] hidden sm:block">
            <img src={productImageUrl} alt={product?.title || ''} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </Link>
  );
});

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

const InboxSkeleton = memo(function InboxSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-3.5">
          <Skeleton className="w-12 h-12 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            <Skeleton className="h-3 w-48 rounded-md" />
            <Skeleton className="h-3 w-40 rounded-md" />
          </div>
          <Skeleton className="w-12 h-12 rounded-xl shrink-0 hidden sm:block" />
        </div>
      ))}
    </div>
  );
});

// ─── Main Inbox Component ─────────────────────────────────────────────────────

export function ConversationsInbox() {
  const { data: conversations = [], isLoading, isError } = useConversations();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Memoized filtered conversation list to avoid re-filtering on unrelated re-renders
  const filteredConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((conv) => {
      const userName = conv.other_user?.full_name?.toLowerCase() || '';
      const productTitle = conv.product?.title?.toLowerCase() || '';
      const lastMsg = conv.last_message?.content?.toLowerCase() || '';
      return userName.includes(q) || productTitle.includes(q) || lastMsg.includes(q);
    });
  }, [conversations, searchQuery]);

  const totalUnread = useMemo(() => {
    return conversations.reduce((acc, conv) => acc + (conv.unread_count || 0), 0);
  }, [conversations]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[var(--primary)]/10 via-[var(--card)] to-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center shrink-0 shadow-sm">
            <MessageSquare className="w-6 h-6 text-[var(--primary)]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)] tracking-tight">
                المحادثات والرسائل
              </h1>
              {!isLoading && conversations.length > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                  {conversations.length} محادثة
                </span>
              )}
              {totalUnread > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white shadow-sm">
                  {totalUnread} غير مقروء
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              صندوق المحادثات والتفاوض المباشر مع البائعين والمشترين
            </p>
          </div>
        </div>

        <Link href="/products" className="self-start sm:self-center">
          <Button size="sm" variant="outline" className="text-xs gap-1.5 h-9">
            <ShoppingBag className="w-3.5 h-3.5" />
            استكشف إعلانات جديدة
          </Button>
        </Link>
      </div>

      {/* Search Filter Bar */}
      {conversations.length > 0 && (
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="ابحث بالاسم أو اسم المنتج أو محتوى الرسالة..."
            className="pl-10 h-11 rounded-xl bg-[var(--card)] border-[var(--border)] text-sm"
          />
          <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      )}

      {/* Loading State */}
      {isLoading && <InboxSkeleton />}

      {/* Error State */}
      {isError && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl p-8 text-center">
          <p className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-2">
            تعذر تحميل المحادثات
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            يرجى التأكد من اتصال الإنترنت وتحديث الصفحة.
          </p>
        </div>
      )}

      {/* Empty State: No Conversations in System */}
      {!isLoading && !isError && conversations.length === 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-10 sm:p-14 text-center shadow-sm max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-3xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
            لا توجد محادثات جارية بعد
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-6 leading-relaxed max-w-md mx-auto">
            تصفح إعلانات السوق واضغط على زر &quot;تواصل مع البائع&quot; لبدء محادثة مباشرة والتفاوض على أي صفقة.
          </p>
          <Link href="/products">
            <Button size="lg" variant="primary" className="font-bold gap-2 px-6 shadow-md hover:shadow-lg transition-shadow">
              <span>تصفح الإعلانات وتواصل مع البائعين</span>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* Empty State: No Search Matches */}
      {!isLoading && !isError && conversations.length > 0 && filteredConversations.length === 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center text-sm text-[var(--muted-foreground)]">
          لم يتم العثور على أي محادثة تطابق &quot;{searchQuery}&quot;
        </div>
      )}

      {/* Conversations List */}
      {!isLoading && !isError && filteredConversations.length > 0 && (
        <div className="space-y-3">
          {filteredConversations.map((conv) => (
            <ConversationCard key={conv.id} conversation={conv} />
          ))}
        </div>
      )}
    </div>
  );
}
