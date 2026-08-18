'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useSubmitReport } from '@/features/reports/hooks/use-submit-report';
import { tokenStorage } from '@/lib/api';

function NewReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetType = (searchParams.get('type') || 'PRODUCT') as 'PRODUCT' | 'USER' | 'MESSAGE';
  const targetId = searchParams.get('id') || '';

  const submitReportMutation = useSubmitReport();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!tokenStorage.hasToken()) {
      setError('يجب تسجيل الدخول لتقديم بلاغ');
      return;
    }

    submitReportMutation.mutate(
      {
        target_type: targetType,
        target_id: targetId,
        reason,
      },
      {
        onSuccess: () => {
          setSuccess('تم إرسال البلاغ بنجاح. سيقوم فريق الإدارة بمراجعته.');
          setTimeout(() => router.back(), 2000);
        },
        onError: (err: any) => {
          setError(err.message || 'فشل إرسال البلاغ');
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-extrabold text-[var(--foreground)] mb-1">
          🚩 تقديم بلاغ مخالفة
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">
          ساعدنا في الحفاظ على أمان المنصة بالإبلاغ عن الإعلانات أو الحسابات المخالفة
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 p-3 rounded-xl text-sm mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="target_type">نوع البلاغ</Label>
            <input
              id="target_type"
              disabled
              value={targetType === 'PRODUCT' ? 'إعلان مخالف' : targetType === 'USER' ? 'حساب مستخدم مخالف' : 'رسالة مخالفة'}
              className="w-full h-10 rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 px-3 text-sm"
            />
          </div>

          <div>
            <Label htmlFor="reason">سبب البلاغ بالتفصيل *</Label>
            <textarea
              id="reason"
              required
              minLength={5}
              maxLength={500}
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="اشرح سبب البلاغ (مثل: إعلان واحتيال، منتج ممنوع، معلومات غير صحيحة)..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-sm focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <Button
            type="submit"
            variant="destructive"
            disabled={submitReportMutation.isPending || !targetId}
            className="w-full"
          >
            {submitReportMutation.isPending ? 'جاري الإرسال...' : 'إرسال البلاغ'}
          </Button>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default function NewReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[var(--muted-foreground)]">
          جاري التحميل...
        </div>
      }
    >
      <NewReportContent />
    </Suspense>
  );
}
