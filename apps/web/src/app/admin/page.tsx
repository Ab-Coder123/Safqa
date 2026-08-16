'use client';

import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '../../components/layout/header';
import { Footer } from '../../components/layout/footer';
import { MobileNav } from '../../components/layout/mobile-nav';
import { Tabs, TabsList, TabsTrigger, TabsContent, Alert, Skeleton } from '../../components/ui';
import { ShieldAlert } from 'lucide-react';
import type { ReportItem, UserItem } from '../../components/admin/admin-tabs';

// ────────────────────────────────────────────
// ✅ Performance: dynamic() — Admin tabs loaded only when admin visits
// Standard user sessions NEVER download this code (Section 8 of Performance Engineering Workflow)
// ────────────────────────────────────────────
const AdminStatsTab = dynamic(
  () => import('../../components/admin/admin-tabs').then((mod) => mod.AdminStatsTab),
  { loading: () => <Skeleton className="h-40 w-full rounded-xl" /> }
);

const AdminReportsTab = dynamic(
  () => import('../../components/admin/admin-tabs').then((mod) => mod.AdminReportsTab),
  { loading: () => <Skeleton className="h-64 w-full rounded-xl" /> }
);

const AdminUsersTab = dynamic(
  () => import('../../components/admin/admin-tabs').then((mod) => mod.AdminUsersTab),
  { loading: () => <Skeleton className="h-64 w-full rounded-xl" /> }
);

interface SystemStats {
  total_users: number;
  total_products: number;
  pending_reports: number;
  total_categories: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ useCallback — stable reference, safe to use as useEffect dependency
  const fetchAdminData = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('يجب تسجيل الدخول بحساب مشرف (SUPER_ADMIN)');
      setLoading(false);
      return;
    }

    try {
      const [statsRes, reportsRes, usersRes] = await Promise.all([
        fetch('http://localhost:3001/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:3001/reports', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:3001/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!statsRes.ok) throw new Error('صلاحية الوصول غير متاحة (تتطلب حساب SUPER_ADMIN)');

      setStats(await statsRes.json());
      setReports(await reportsRes.json());
      setUsers(await usersRes.json());
    } catch (err: any) {
      setError(err.message || 'فشل تحميل بيانات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const pendingReportsCount = reports.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--foreground)]">لوحة الإدارة والإشراف (Super Admin)</h1>
            <p className="text-xs text-[var(--muted-foreground)]">مراقبة إحصائيات المنصة، معالجة البلاغات المعلقة، وحظر الحسابات المخالفة</p>
          </div>
        </div>

        {error ? (
          <Alert variant="destructive" title="خطأ في الصلاحيات">
            {error}
          </Alert>
        ) : loading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ) : (
          <Tabs defaultValue="stats">
            <TabsList className="mb-6">
              <TabsTrigger value="stats">📊 الإحصائيات</TabsTrigger>
              <TabsTrigger value="reports">
                🚩 البلاغات المعلقة ({pendingReportsCount})
              </TabsTrigger>
              <TabsTrigger value="users">👥 المستخدمين ({users.length})</TabsTrigger>
            </TabsList>

            {/* ✅ dynamic() — each tab loads its JS only when rendered */}
            <TabsContent value="stats">
              {stats && <AdminStatsTab stats={stats} />}
            </TabsContent>

            <TabsContent value="reports">
              <AdminReportsTab reports={reports} onRefresh={fetchAdminData} />
            </TabsContent>

            <TabsContent value="users">
              <AdminUsersTab users={users} onRefresh={fetchAdminData} />
            </TabsContent>
          </Tabs>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
