'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Popover, Button, Badge } from '../ui';
import { Bell, CheckCheck, MessageSquare, AlertTriangle, Heart } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3001/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (e) {
      // Fallback silent failure
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      await fetch('http://localhost:3001/notifications/read-all', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) {
      // Fail silently
    }
  };

  return (
    <Popover
      trigger={
        <div className="relative">
          <Button variant="ghost" size="icon" title="الإشعارات">
            <Bell className="w-5 h-5 text-[var(--muted-foreground)]" />
          </Button>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--destructive)] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[var(--background)] animate-pulse">
              {unreadCount > 9 ? '+9' : unreadCount}
            </span>
          )}
        </div>
      }
      align="start"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-2">
        <h4 className="font-bold text-sm text-[var(--foreground)]">الإشعارات</h4>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            تحديد الكل كقروء
          </button>
        )}
      </div>

      <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border)]">
        {notifications.length === 0 ? (
          <p className="text-xs text-[var(--muted-foreground)] text-center py-6">لا توجد إشعارات حالية</p>
        ) : (
          notifications.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className={`py-2.5 px-1 flex items-start gap-2.5 transition-colors ${
                !item.is_read ? 'bg-[var(--accent)]/30 font-medium' : ''
              }`}
            >
              <div className="mt-0.5 text-[var(--primary)]">
                {item.type === 'COMMENT' && <MessageSquare className="w-4 h-4" />}
                {item.type === 'MODERATION' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                {item.type === 'FAVORITE' && <Heart className="w-4 h-4 text-rose-500" />}
              </div>
              <div className="flex-1 text-right">
                <p className="text-xs font-semibold text-[var(--foreground)]">{item.title}</p>
                <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-2 mt-0.5">{item.body}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-2 border-t border-[var(--border)] mt-2 text-center">
        <Link href="/notifications" className="text-xs text-[var(--primary)] font-semibold hover:underline">
          عرض كل الإشعارات
        </Link>
      </div>
    </Popover>
  );
}
