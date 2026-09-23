'use client';

import React, { useState, useMemo, memo } from 'react';
import Link from 'next/link';
import { useMyProfile } from '../hooks/use-my-profile';
import { ProductCard } from '@/features/products/components/product-card';
import { Button, Skeleton } from '@/components/ui';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Package,
  Heart,
  Settings,
  Edit3,
  PlusCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

// ── Date Formatter (defined once at module level for optimal performance) ──
const dateFormatter = new Intl.DateTimeFormat('ar-EG', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    return dateFormatter.format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

// ── Profile Skeleton Loading ──
export const ProfileSkeleton = memo(function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" data-testid="profile-skeleton">
      {/* Top Banner Skeleton */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Skeleton className="w-24 h-24 rounded-full shrink-0" />
        <div className="flex-1 space-y-3 text-center sm:text-right w-full">
          <Skeleton className="h-6 w-48 mx-auto sm:mx-0 rounded-lg" />
          <Skeleton className="h-4 w-32 mx-auto sm:mx-0 rounded-md" />
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-2">
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl col-span-2 sm:col-span-1" />
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
});

// ── Main ProfileView Component ──
export const ProfileView = memo(function ProfileView() {
  const { data, isLoading, isError, refetch } = useMyProfile();
  const [activeTab, setActiveTab] = useState<'products' | 'info'>('products');

  // Backend returns { user: profile }
  const profile = useMemo(() => {
    return (data as any)?.user ?? data;
  }, [data]);

  const joinDate = useMemo(() => formatDate(profile?.created_at), [profile?.created_at]);
  const birthDate = useMemo(() => formatDate(profile?.birth_date), [profile?.birth_date]);

  const products = useMemo(() => profile?.products ?? [], [profile?.products]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !profile) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[var(--foreground)]">تعذر تحميل بيانات الملف الشخصي</h2>
        <p className="text-xs text-[var(--muted-foreground)]">يرجى التأكد من اتصالك بالإنترنت والمحاولة مجدداً</p>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── 1. Profile Header Card ── */}
      <div className="bg-gradient-to-br from-[var(--surface)] via-[var(--card)] to-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-right">
          {/* Avatar */}
          <div className="relative group shrink-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-24 h-24 rounded-full object-cover border-4 border-[var(--background)] shadow-md group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/70 text-white flex items-center justify-center text-3xl font-extrabold shadow-md border-4 border-[var(--background)]">
                {profile.full_name?.charAt(0) || '👤'}
              </div>
            )}
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[var(--background)] shadow-sm" title="حساب نشط" />
          </div>

          {/* User Details & Actions */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                  {profile.full_name}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--primary)]/10 text-[var(--primary)]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {profile.role === 'SUPER_ADMIN' ? 'مدير المنصة' : 'مستخدم موثوق'}
                  </span>
                  {joinDate && (
                    <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      عضو منذ {joinDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 pt-2 sm:pt-0">
                <Link href="/profile/edit">
                  <Button size="sm" variant="outline" className="gap-1.5 font-bold h-9">
                    <Edit3 className="w-4 h-4 text-[var(--primary)]" />
                    تعديل الملف
                  </Button>
                </Link>
                <Link href="/products/create">
                  <Button size="sm" className="gap-1.5 font-bold h-9 shadow-sm">
                    <PlusCircle className="w-4 h-4" />
                    أضف إعلاناً
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Contact Info Strip */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 border-t border-[var(--border)]/60 text-xs text-[var(--muted-foreground)]">
              {profile.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span className="dir-ltr">{profile.email}</span>
                </div>
              )}
              {profile.phone_number && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="dir-ltr font-semibold">{profile.phone_number}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Quick Metrics Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-[var(--foreground)]">{products.length}</span>
            <p className="text-xs text-[var(--muted-foreground)] font-medium">إعلاناتي</p>
          </div>
        </div>

        <Link href="/favorites" className="group">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:border-[var(--primary)]/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                المفضلة
              </span>
              <p className="text-xs text-[var(--muted-foreground)]">الإعلانات المحفوظة ←</p>
            </div>
          </div>
        </Link>

        <Link href="/settings" className="group col-span-2 sm:col-span-1">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:border-[var(--primary)]/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                الإعدادات
              </span>
              <p className="text-xs text-[var(--muted-foreground)]">الأمان والمظهر ←</p>
            </div>
          </div>
        </Link>
      </div>

      {/* ── 3. Tabs Navigation ── */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-2 px-3 text-sm font-bold transition-all relative ${
            activeTab === 'products'
              ? 'text-[var(--primary)]'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <span>إعلاناتي ({products.length})</span>
          {activeTab === 'products' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`pb-2 px-3 text-sm font-bold transition-all relative ${
            activeTab === 'info'
              ? 'text-[var(--primary)]'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <span>المعلومات الشخصية</span>
          {activeTab === 'info' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-full" />
          )}
        </button>
      </div>

      {/* ── 4. Tab Content: My Products ── */}
      {activeTab === 'products' && (
        <div>
          {products.length === 0 ? (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-10 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[var(--muted)] flex items-center justify-center mx-auto text-[var(--muted-foreground)]">
                <Package className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[var(--foreground)]">لا توجد إعلانات منشورة بعد</h3>
                <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
                  ابدأ ببيع منتجاتك وسياراتك أو عقاراتك الآن بسهولة وأمان في صفقة.
                </p>
              </div>
              <Link href="/products/create">
                <Button size="sm" className="font-bold gap-2">
                  <PlusCircle className="w-4 h-4" />
                  نشر إعلان جديد
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {products.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 5. Tab Content: Basic Info ── */}
      {activeTab === 'info' && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <h3 className="font-extrabold text-base text-[var(--foreground)]">بيانات الحساب الشخصية</h3>
            <Link href="/profile/edit">
              <Button size="sm" variant="ghost" className="text-xs text-[var(--primary)] font-bold gap-1">
                <Edit3 className="w-3.5 h-3.5" />
                تعديل البيانات
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-xs text-[var(--muted-foreground)] block mb-1">الاسم الكامل</span>
              <span className="font-bold text-[var(--foreground)]">{profile.full_name}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-xs text-[var(--muted-foreground)] block mb-1">البريد الإلكتروني</span>
              <span className="font-bold text-[var(--foreground)] dir-ltr block text-right">{profile.email}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-xs text-[var(--muted-foreground)] block mb-1">رقم الهاتف</span>
              <span className="font-bold text-[var(--foreground)] dir-ltr block text-right">
                {profile.phone_number || 'غير محدد'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-xs text-[var(--muted-foreground)] block mb-1">النوع</span>
              <span className="font-bold text-[var(--foreground)]">
                {profile.gender === 'MALE' ? 'ذكر' : profile.gender === 'FEMALE' ? 'أنثى' : 'غير محدد'}
              </span>
            </div>

            {birthDate && (
              <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-xs text-[var(--muted-foreground)] block mb-1">تاريخ الميلاد</span>
                <span className="font-bold text-[var(--foreground)]">{birthDate}</span>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-xs text-[var(--muted-foreground)] block mb-1">حالة الحساب</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {profile.status === 'ACTIVE' ? 'نشط ومفعل' : profile.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
