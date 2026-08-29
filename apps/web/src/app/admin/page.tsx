'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Header } from '../../components/layout/header';
import { Footer } from '../../components/layout/footer';
import { MobileNav } from '../../components/layout/mobile-nav';
import { Tabs, TabsList, TabsTrigger, TabsContent, Alert, Skeleton } from '../../components/ui';
import { ShieldAlert } from 'lucide-react';
import { useAdminStats, useAdminReports, useAdminUsers } from '@/features/admin/hooks/use-admin';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { UserRole } from '@safqa/types';

// ────────────────────────────────────────────
// ✅ Performance: dynamic() — Admin tabs loaded only when admin visits
// Standard user sessions NEVER download this code (Section 8 of Performance Engineering Workflow)
// ────────────────────────────────────────────
const AdminStatsTab = dynamic(
  () => import('@/features/admin/components/admin-tabs').then((mod) => mod.AdminStatsTab),
  { loading: () => <Skeleton className="h-40 w-full rounded-xl" /> }
);

const AdminReportsTab = dynamic(
  () => import('@/features/admin/components/admin-tabs').then((mod) => mod.AdminReportsTab),
  { loading: () => <Skeleton className="h-64 w-full rounded-xl" /> }
);

const AdminUsersTab = dynamic(
  () => import('@/features/admin/components/admin-tabs').then((mod) => mod.AdminUsersTab),
  { loading: () => <Skeleton className="h-64 w-full rounded-xl" /> }
);

function AdminDashboardContent() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useAdminStats();
  const { data: reports = [], isLoading: reportsLoading } = useAdminReports();
  const { data: users = [], isLoading: usersLoading } = useAdminUsers();

  const loading = statsLoading || reportsLoading || usersLoading;
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
            <h1 className="text-2xl font-extrabold text-[var(--foreground)]">لوحة الإدارة والتحكم</h1>
            <p className="text-xs text-[var(--muted-foreground)]">إدارة البلاغات، مراجعة الحسابات، ومراقبة إحصائيات النظام</p>
          </div>
        </div>

        {statsError && (
          <Alert variant="destructive" title="خطأ" className="mb-6">
            تعذر تحميل بيانات الإدارة. تأكد من امتلاكك صلاحيات المشرف.
          </Alert>
        )}

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid grid-cols-3 max-w-md bg-[var(--card)] border border-[var(--border)]">
            <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
            <TabsTrigger value="reports" className="relative">
              البلاغات
              {pendingReportsCount > 0 && (
                <span className="mr-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                  {pendingReportsCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">المستخدمين</TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <AdminStatsTab stats={stats} loading={loading} />
          </TabsContent>

          <TabsContent value="reports">
            <AdminReportsTab reports={reports} loading={loading} />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersTab users={users} loading={loading} />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AuthGuard requiredRole={UserRole.SUPER_ADMIN}>
      <AdminDashboardContent />
    </AuthGuard>
  );
}
