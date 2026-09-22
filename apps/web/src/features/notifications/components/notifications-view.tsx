'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell, CheckCheck, MessageSquare, AlertTriangle, Shield, Star, RefreshCw, BellOff,
} from 'lucide-react';
import { Button, Skeleton } from '@/components/ui';
import { useNotifications } from '../hooks/use-notifications';
import { useMarkNotificationRead } from '../hooks/use-mark-notification-read';
import { useMarkAllNotificationsRead } from '../hooks/use-mark-all-notifications-read';
import type { NotificationItem } from '../api/notifications.api';

// ─── Intl formatter (defined once — never re-created per render) ─────────────
const dateFormatter = new Intl.DateTimeFormat('ar-EG', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function formatTime(dateStr: string): string {
  try {
    return dateFormatter.format(new Date(dateStr));
  } catch {
    return '';
  }
}

// ─── getNotificationDestination: Smart navigation per Workflow spec ──────────
// Per Notification_Workflow.md: navigate by action_url or by type fallback
function getDestination(item: NotificationItem): string | null {
  if (item.action_url) return item.action_url;
  switch (item.type) {
    case 'COMMENT':
      return '/conversations';
    case 'MODERATION':
      return '/notifications';
    case 'SYSTEM':
      return '/notifications';
    case 'PROMOTION':
      return '/products';
    default:
      return null;
  }
}

// ─── NotificationIcon: renders type-based icon ───────────────────────────────
function NotificationIcon({ type, isRead }: { type: string; isRead: boolean }) {
  const baseClass = `w-5 h-5 shrink-0 transition-colors`;
  const dimClass = isRead ? 'opacity-50' : 'opacity-100';

  switch (type) {
    case 'COMMENT':
      return <MessageSquare className={`${baseClass} text-[var(--primary)] ${dimClass}`} />;
    case 'MODERATION':
      return <AlertTriangle className={`${baseClass} text-amber-500 ${dimClass}`} />;
    case 'SYSTEM':
      return <Shield className={`${baseClass} text-blue-500 ${dimClass}`} />;
    case 'PROMOTION':
      return <Star className={`${baseClass} text-yellow-500 ${dimClass}`} />;
    default:
      return <Bell className={`${baseClass} text-[var(--muted-foreground)] ${dimClass}`} />;
  }
}

// ─── NotificationCard: memoized — justified because it's in a list ───────────
// React.memo: justified — parent re-renders on tab switch & mark mutations
// useCallback: justified — passed to memo children to maintain referential stability

interface NotificationCardProps {
  item: NotificationItem;
  onMarkRead: (id: string) => void;
  isMarkingRead: boolean;
}

const NotificationCard = memo(function NotificationCard({
  item,
  onMarkRead,
  isMarkingRead,
}: NotificationCardProps) {
  const router = useRouter();
  const destination = useMemo(() => getDestination(item), [item.action_url, item.type]);
  const time = useMemo(() => formatTime(item.created_at), [item.created_at]);

  // useCallback justified: passed to onClick on memoized component
  const handleClick = useCallback(() => {
    if (!item.is_read && !isMarkingRead) {
      onMarkRead(item.id);
    }
    if (destination && destination !== '/notifications') {
      router.push(destination);
    }
  }, [item.is_read, item.id, isMarkingRead, onMarkRead, destination, router]);

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={item.title}
      className={`group flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
        !item.is_read
          ? 'bg-[var(--primary)]/[0.03] border-[var(--primary)]/30 border-r-4 border-r-[var(--primary)]'
          : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/30'
      } ${isMarkingRead ? 'pointer-events-none opacity-60' : 'hover:shadow-sm'}`}
    >
      {/* Icon */}
      <div className="mt-0.5 shrink-0">
        <NotificationIcon type={item.type} isRead={item.is_read} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className={`text-sm leading-snug truncate ${!item.is_read ? 'font-bold text-[var(--foreground)]' : 'font-semibold text-[var(--muted-foreground)]'}`}>
            {item.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            {!item.is_read && (
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] shrink-0" aria-label="غير مقروء" />
            )}
            <span className="text-[11px] text-[var(--muted-foreground)]">{time}</span>
          </div>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
          {item.body}
        </p>
        {destination && destination !== '/notifications' && (
          <span className="inline-flex items-center mt-1.5 text-[11px] font-bold text-[var(--primary)] group-hover:underline">
            عرض التفاصيل ←
          </span>
        )}
      </div>
    </div>
  );
});

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

const NotificationsSkeleton = memo(function NotificationsSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3.5 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <Skeleton className="w-5 h-5 rounded-full mt-0.5 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-3 w-14 rounded-md" />
            </div>
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-3/4 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
});

// ─── Filter Tab ───────────────────────────────────────────────────────────────
type FilterTab = 'all' | 'unread';

// ─── Main NotificationsView ───────────────────────────────────────────────────

export function NotificationsView() {
  const { data, isLoading, isError, refetch, isRefetching } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Correct API payload per roadmap spec: data is { notifications, unread_count }
  const allNotifications = data?.notifications ?? [];
  const unreadCount = data?.unread_count ?? 0;

  // useMemo justified: filtering an array that can grow large; parent re-renders on tab change
  const visibleNotifications = useMemo(() => {
    if (activeTab === 'unread') return allNotifications.filter((n) => !n.is_read);
    return allNotifications;
  }, [allNotifications, activeTab]);

  // useCallback justified: stable reference passed to memoized NotificationCard children
  const handleMarkRead = useCallback(
    (id: string) => {
      markReadMutation.mutate(id);
    },
    [markReadMutation]
  );

  const handleMarkAllRead = useCallback(() => {
    markAllReadMutation.mutate();
  }, [markAllReadMutation]);

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[var(--primary)]/10 via-[var(--card)] to-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center shrink-0 shadow-sm">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)] tracking-tight">
                مركز الإشعارات
              </h1>
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-500 text-white shadow-sm">
                  {unreadCount} غير مقروء
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              تنبيهات حسابك — يتم الحذف التلقائي بعد ٣ أيام
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefetch}
            disabled={isRefetching}
            className="text-xs gap-1.5 h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
            تحديث
          </Button>

          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleMarkAllRead}
              disabled={markAllReadMutation.isPending}
              className="text-xs gap-1.5 h-9"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
              تحديد الكل كمقروء
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs — local state, no global re-renders */}
      {!isLoading && !isError && allNotifications.length > 0 && (
        <div className="flex items-center gap-1 p-1 bg-[var(--muted)]/40 rounded-xl border border-[var(--border)] w-fit">
          {(['all', 'unread'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm border border-[var(--border)]'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {tab === 'all' ? `الكل (${allNotifications.length})` : `غير المقروء (${unreadCount})`}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {isLoading && <NotificationsSkeleton />}

      {/* Error */}
      {isError && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-6 h-6 text-rose-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-1">تعذر تحميل الإشعارات</p>
          <p className="text-xs text-[var(--muted-foreground)] mb-3">يرجى التأكد من اتصال الإنترنت</p>
          <Button size="sm" variant="outline" onClick={handleRefetch}>
            إعادة المحاولة
          </Button>
        </div>
      )}

      {/* Empty — no notifications at all */}
      {!isLoading && !isError && allNotifications.length === 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-10 sm:p-14 text-center shadow-sm max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-3xl bg-[var(--muted)] flex items-center justify-center mx-auto mb-4">
            <BellOff className="w-8 h-8 text-[var(--muted-foreground)]" />
          </div>
          <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">لا توجد إشعارات</h2>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-sm mx-auto">
            ستصلك التنبيهات عند وصول رسائل جديدة، قرارات الإشراف، أو تحديثات إعلاناتك.
          </p>
        </div>
      )}

      {/* Empty — unread tab but nothing unread */}
      {!isLoading && !isError && allNotifications.length > 0 && visibleNotifications.length === 0 && activeTab === 'unread' && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center text-sm text-[var(--muted-foreground)]">
          <CheckCheck className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
          <p className="font-bold text-[var(--foreground)] mb-1">كل الإشعارات تمت قراءتها</p>
          <p className="text-xs">لا توجد إشعارات غير مقروءة في الوقت الحالي.</p>
        </div>
      )}

      {/* Notifications List — each card is memoized */}
      {!isLoading && !isError && visibleNotifications.length > 0 && (
        <div className="space-y-3">
          {visibleNotifications.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              onMarkRead={handleMarkRead}
              isMarkingRead={markReadMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
