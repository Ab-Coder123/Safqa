'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Header } from '../../components/layout/header';
import { Footer } from '../../components/layout/footer';
import { MobileNav } from '../../components/layout/mobile-nav';
import { Tabs, TabsList, TabsTrigger, TabsContent, Alert, Skeleton } from '../../components/ui';
import { ShieldAlert } from 'lucide-react';
import { useAdminStats, useAdminReports, useAdminUsers } from '@/features/admin/hooks/use-admin';
import { tokenStorage } from '@/lib/api';

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

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useAdminStats();
  const { data: reports = [], isLoading: reportsLoading } = useAdminReports();
  const { data: users = [], isLoading: usersLoading } = useAdminUsers();

  const loading = statsLoading || reportsLoading || usersLoading;
  const pendingReportsCount = reports.filter((r) => r.status === 'PENDING').length;

  if (!tokenStorage.hasToken()) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          <Alert variant="destructive" title="خطأ في الصلاحيات">
            يجب تسجيل الدخول بحساب مشرف (SUPER_ADMIN)
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

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

        {statsError ? (
          <Alert variant="destructive" title="خطأ في الصلاحيات">
            صلاحية الوصول غير متاحة (تتطلب حساب SUPER_ADMIN)
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
              <AdminReportsTab reports={reports} />
            </TabsContent>

            <TabsContent value="users">
              <AdminUsersTab users={users} />
            </TabsContent>
          </Tabs>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
