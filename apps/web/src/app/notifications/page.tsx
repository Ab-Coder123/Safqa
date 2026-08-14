'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '../../components/layout/header';
import { Footer } from '../../components/layout/footer';
import { MobileNav } from '../../components/layout/mobile-nav';
import { Card, CardContent, Button, Badge, EmptyState, Alert } from '../../components/ui';
import { Bell, CheckCheck, MessageSquare, AlertTriangle, Heart } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('يجب تسجيل الدخول لعرض الإشعارات');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('فشل جلب الإشعارات');
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch {
      setError('حدث خطأ أثناء تحميل الإشعارات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:3001/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch {
      /* ignore */
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3001/notifications/read-all', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[var(--foreground)]">الإشعارات</h1>
                {unreadCount > 0 && (
                  <Badge variant="destructive">{unreadCount} غير مقروء</Badge>
                )}
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">تنبيهات حسابك (يتم الحذف التلقائي بعد ٣ أيام)</p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} className="gap-1.5">
              <CheckCheck className="w-4 h-4 text-[var(--primary)]" />
              تحديد الكل كمقروء
            </Button>
          )}
        </div>

        {error ? (
          <Alert variant="destructive" title="خطأ في الوصول">
            {error}
          </Alert>
        ) : loading ? (
          <div className="text-center py-12 text-[var(--muted-foreground)]">جاري تحميل الإشعارات...</div>
        ) : notifications.length === 0 ? (
          <EmptyState icon="🔕" title="لا توجد إشعارات حالياً" description="ستصلك التنبيهات عند وجود رسائل جديدة، تعليقات، أو تحديثات على إعلاناتك." />
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((item) => (
              <Card
                key={item.id}
                onClick={() => !item.is_read && handleMarkAsRead(item.id)}
                className={`cursor-pointer transition-all ${
                  !item.is_read ? 'border-r-4 border-r-[var(--primary)] bg-[var(--accent)]/20 font-medium' : ''
                }`}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="mt-0.5 text-[var(--primary)] shrink-0">
                    {item.type === 'COMMENT' && <MessageSquare className="w-5 h-5" />}
                    {item.type === 'MODERATION' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                    {item.type === 'FAVORITE' && <Heart className="w-5 h-5 text-rose-500" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-sm text-[var(--foreground)]">{item.title}</h3>
                      <span className="text-[11px] text-[var(--muted-foreground)]">
                        {new Date(item.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{item.body}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
