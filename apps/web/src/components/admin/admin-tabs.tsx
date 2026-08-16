'use client';

import React, { useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, EmptyState, useToast } from '../../components/ui';
import { Users, Package, Flag, FolderTree, UserX, UserCheck, CheckCircle2, AlertOctagon } from 'lucide-react';

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface SystemStats {
  total_users: number;
  total_products: number;
  pending_reports: number;
  total_categories: number;
}

export interface ReportItem {
  id: string;
  target_type: string;
  target_id: string;
  reason: string;
  status: string;
  created_at: string;
  reporter: { full_name: string; email: string };
}

export interface UserItem {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  created_at: string;
  _count: { products: number };
}

// ────────────────────────────────────────────
// Stats Tab
// ────────────────────────────────────────────

export function AdminStatsTab({ stats }: { stats: SystemStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold text-[var(--muted-foreground)]">إجمالي المستخدمين</CardTitle>
          <Users className="w-4 h-4 text-[var(--primary)]" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-[var(--foreground)]">{stats.total_users}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold text-[var(--muted-foreground)]">الإعلانات النشطة</CardTitle>
          <Package className="w-4 h-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-emerald-600">{stats.total_products}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold text-[var(--muted-foreground)]">البلاغات المعلقة</CardTitle>
          <Flag className="w-4 h-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-amber-500">{stats.pending_reports}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold text-[var(--muted-foreground)]">الأقسام المتاحة</CardTitle>
          <FolderTree className="w-4 h-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-indigo-500">{stats.total_categories}</div>
        </CardContent>
      </Card>
    </div>
  );
}

// ────────────────────────────────────────────
// Reports Moderation Tab
// ────────────────────────────────────────────

interface ReportsTabProps {
  reports: ReportItem[];
  onRefresh: () => void;
}

export function AdminReportsTab({ reports, onRefresh }: ReportsTabProps) {
  const { toast } = useToast();

  const handleResolveReport = useCallback(async (id: string) => {
    const reason = prompt('سبب قبول البلاغ وأرشفة الهدف:');
    if (!reason) return;
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`http://localhost:3001/reports/${id}/resolve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason }),
    });
    if (res.ok) {
      toast({ title: 'تم قبول البلاغ وأرشفة الإعلان المخالف', type: 'success' });
      onRefresh();
    }
  }, [toast, onRefresh]);

  const handleDismissReport = useCallback(async (id: string) => {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`http://localhost:3001/reports/${id}/dismiss`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      toast({ title: 'تم رفض البلاغ', type: 'info' });
      onRefresh();
    }
  }, [toast, onRefresh]);

  if (reports.length === 0) {
    return <EmptyState icon="🚩" title="لا توجد بلاغات حالية" description="جميع البلاغات المقدمة تم التعامل معها ومراجعتها." />;
  }

  return (
    <div className="flex flex-col gap-4">
      {reports.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={item.status === 'PENDING' ? 'warning' : item.status === 'RESOLVED' ? 'success' : 'secondary'}>
                  {item.status}
                </Badge>
                <span className="text-xs font-bold text-[var(--foreground)]">الهدف: {item.target_type}</span>
              </div>
              <p className="text-sm font-semibold text-[var(--foreground)] mb-1">السبب: {item.reason}</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                مُقدم البلاغ: {item.reporter?.full_name} ({item.reporter?.email})
              </p>
            </div>

            {item.status === 'PENDING' && (
              <div className="flex items-center gap-2">
                <Button variant="destructive" size="sm" onClick={() => handleResolveReport(item.id)}>
                  <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                  قبول وأرشفة
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDismissReport(item.id)}>
                  <AlertOctagon className="w-3.5 h-3.5 ml-1" />
                  رفض البلاغ
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────
// Users Moderation Tab
// ────────────────────────────────────────────

interface UsersTabProps {
  users: UserItem[];
  onRefresh: () => void;
}

export function AdminUsersTab({ users, onRefresh }: UsersTabProps) {
  const { toast } = useToast();

  const handleSuspendUser = useCallback(async (id: string) => {
    const reason = prompt('سبب تعليق حساب المستخدم:');
    if (!reason) return;
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`http://localhost:3001/admin/users/${id}/suspend`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason }),
    });
    if (res.ok) {
      toast({ title: 'تم تعليق الحساب وأرشفة إعلاناته تلقائياً', type: 'success' });
      onRefresh();
    }
  }, [toast, onRefresh]);

  const handleActivateUser = useCallback(async (id: string) => {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`http://localhost:3001/admin/users/${id}/activate`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      toast({ title: 'تم إعادة تنشيط الحساب بنجاح', type: 'success' });
      onRefresh();
    }
  }, [toast, onRefresh]);

  return (
    <div className="flex flex-col gap-3">
      {users.map((u) => (
        <Card key={u.id}>
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-[var(--foreground)]">{u.full_name}</h4>
                <Badge variant={u.role === 'SUPER_ADMIN' ? 'primary' : 'outline'} className="text-[10px]">
                  {u.role}
                </Badge>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{u.email} • {u.phone_number}</p>
              <p className="text-[11px] text-[var(--muted-foreground)] mt-1">عدد الإعلانات: {u._count?.products || 0}</p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={u.status === 'ACTIVE' ? 'success' : u.status === 'SUSPENDED' ? 'destructive' : 'secondary'}>
                {u.status}
              </Badge>

              {u.role !== 'SUPER_ADMIN' && (
                u.status === 'ACTIVE' ? (
                  <Button variant="destructive" size="sm" onClick={() => handleSuspendUser(u.id)} className="gap-1">
                    <UserX className="w-3.5 h-3.5" />
                    تعليق الحساب
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleActivateUser(u.id)} className="gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    إعادة تنشيط
                  </Button>
                )
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
