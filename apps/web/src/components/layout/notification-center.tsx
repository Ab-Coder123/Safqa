'use client';

import React, { useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Popover, Button } from '../ui';
import { Bell, CheckCheck, MessageSquare, AlertTriangle, Shield, Star } from 'lucide-react';
import { useNotifications } from '@/features/notifications/hooks/use-notifications';
import { useMarkNotificationRead } from '@/features/notifications/hooks/use-mark-notification-read';
import { useMarkAllNotificationsRead } from '@/features/notifications/hooks/use-mark-all-notifications-read';
import type { NotificationItem } from '@/features/notifications/api/notifications.api';

// ─── Smart navigation per Notification_Workflow.md ───────────────────────────
function getDestination(item: NotificationItem): string | null {
  if (item.action_url) return item.action_url;
  switch (item.type) {
    case 'COMMENT':    return '/conversations';
    case 'PROMOTION':  return '/products';
    default:           return null;
  }
}

// ─── Mini icon by notification type ──────────────────────────────────────────
function MiniIcon({ type }: { type: string }) {
  const cls = 'w-4 h-4 shrink-0';
  switch (type) {
    case 'COMMENT':    return <MessageSquare className={`${cls} text-[var(--primary)]`} />;
    case 'MODERATION': return <AlertTriangle className={`${cls} text-amber-500`} />;
    case 'SYSTEM':     return <Shield className={`${cls} text-blue-500`} />;
    case 'PROMOTION':  return <Star className={`${cls} text-yellow-500`} />;
    default:           return <Bell className={`${cls} text-[var(--muted-foreground)]`} />;
  }
}

// ─── Memoized notification row — justified: rendered in list, parent fetches data ─
interface PopoverRowProps {
  item: NotificationItem;
  onMarkRead: (id: string) => void;
}

const PopoverRow = memo(function PopoverRow({ item, onMarkRead }: PopoverRowProps) {
  const router = useRouter();
  const destination = useMemo(() => getDestination(item), [item.action_url, item.type]);

  // useCallback: stable reference, passed to memo child onClick
  const handleClick = useCallback(() => {
    if (!item.is_read) onMarkRead(item.id);
    if (destination) router.push(destination);
  }, [item.is_read, item.id, destination, onMarkRead, router]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={item.title}
      className={`py-2.5 px-2 flex items-start gap-2.5 rounded-lg transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)] ${
        !item.is_read
          ? 'bg-[var(--primary)]/[0.04] font-medium'
          : 'hover:bg-[var(--accent)]/40'
      }`}
    >
      <MiniIcon type={item.type} />
      <div className="flex-1 text-right min-w-0">
        <p className={`text-xs leading-snug truncate ${!item.is_read ? 'font-bold text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}>
          {item.title}
        </p>
        <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-1 mt-0.5">{item.body}</p>
      </div>
      {!item.is_read && (
        <span className="w-2 h-2 rounded-full bg-[var(--primary)] mt-1 shrink-0" />
      )}
    </div>
  );
});

// ─── Main NotificationCenter ──────────────────────────────────────────────────

export function NotificationCenter() {
  // Same query key as /notifications page → shared cache, no duplicate fetch
  const { data } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unread_count ?? 0;

  // useMemo: stable preview slice reference for memoized children
  const previewItems = useMemo(() => notifications.slice(0, 5), [notifications]);

  const handleMarkRead = useCallback(
    (id: string) => markReadMutation.mutate(id),
    [markReadMutation]
  );

  const handleMarkAllRead = useCallback(() => {
    markAllReadMutation.mutate();
  }, [markAllReadMutation]);

  return (
    <Popover
      trigger={
        <div className="relative">
          <Button variant="ghost" size="icon" title="الإشعارات" aria-label={`الإشعارات${unreadCount > 0 ? ` — ${unreadCount} غير مقروء` : ''}`}>
            <Bell className="w-5 h-5 text-[var(--muted-foreground)]" />
          </Button>
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--destructive)] text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-[var(--background)] animate-pulse"
              aria-hidden="true"
            >
              {unreadCount > 9 ? '+9' : unreadCount}
            </span>
          )}
        </div>
      }
      align="start"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-1">
        <h4 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-1.5">
          الإشعارات
          {unreadCount > 0 && (
            <span className="text-[11px] font-extrabold text-[var(--primary)]">({unreadCount})</span>
          )}
        </h4>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markAllReadMutation.isPending}
            className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:underline"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            تحديد الكل
          </button>
        )}
      </div>

      {/* Preview List */}
      <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border)]/50">
        {previewItems.length === 0 ? (
          <p className="text-xs text-[var(--muted-foreground)] text-center py-6">
            لا توجد إشعارات حالياً
          </p>
        ) : (
          previewItems.map((item) => (
            <PopoverRow
              key={item.id}
              item={item}
              onMarkRead={handleMarkRead}
            />
          ))
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-2.5 border-t border-[var(--border)] mt-2 text-center">
        <Link
          href="/notifications"
          className="text-xs text-[var(--primary)] font-bold hover:underline"
        >
          عرض كل الإشعارات
        </Link>
      </div>
    </Popover>
  );
}
