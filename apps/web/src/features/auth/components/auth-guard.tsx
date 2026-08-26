'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '../hooks/use-current-user';
import { tokenStorage } from '@/lib/api';
import { UserRole } from '@safqa/types';
import { Alert, Button, Skeleton } from '@/components/ui';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole | 'SUPER_ADMIN' | 'USER';
  fallbackUrl?: string;
}

/**
 * AuthGuard Component
 *
 * Wraps protected views and routes.
 * 1. Checks client-side token presence via tokenStorage.hasToken().
 * 2. Fetches user session via useCurrentUser().
 * 3. Enforces required role (e.g. SUPER_ADMIN for /admin).
 * 4. Automatically redirects unauthenticated users to /login.
 */
export function AuthGuard({
  children,
  requiredRole,
  fallbackUrl = '/login',
}: AuthGuardProps) {
  const router = useRouter();
  const hasToken = tokenStorage.hasToken();
  const { data: userData, isLoading, isError } = useCurrentUser();

  const user = userData?.user ?? null;

  useEffect(() => {
    if (!hasToken) {
      router.replace(fallbackUrl);
    }
  }, [hasToken, router, fallbackUrl]);

  // If no token, return empty while redirecting
  if (!hasToken) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <Skeleton className="h-12 w-48 rounded-xl mb-4" />
        <p className="text-sm text-[var(--muted-foreground)]">جاري إعادة التوجيه لتسجيل الدخول...</p>
      </div>
    );
  }

  // Loading user session
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  // Session error (invalid or expired token)
  if (isError || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <Alert variant="destructive" title="انتهت الجلسة">
          انتهت صلاحية تسجيل الدخول، يرجى تسجيل الدخول مرة أخرى للمتابعة.
        </Alert>
        <div className="mt-4">
          <Link href="/login">
            <Button className="w-full">الانتقال لتسجيل الدخول</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Role verification (SUPER_ADMIN check)
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center dir-rtl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-2">
          غير مصرح لك بالدخول
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
          هذه الصفحة مخصصة لمديري النظام ومشرفي المنصة فقط.
        </p>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
