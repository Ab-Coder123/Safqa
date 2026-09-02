'use client';

import React, { useState } from 'react';
import { Button, useToast } from '@/components/ui';
import { AlertTriangle, X, ShieldAlert, Loader2 } from 'lucide-react';
import { useSubmitReport } from '@/features/reports/hooks/use-submit-report';
import { tokenStorage } from '@/lib/api';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType?: 'PRODUCT' | 'USER' | 'MESSAGE';
  targetTitle?: string;
}

const REPORT_REASONS = [
  { key: 'احتيال أو إعلان وهمي', label: 'احتيال أو إعلان وهمي (Scam / Fake)' },
  { key: 'منتج ممنوع أو غير قانوني', label: 'منتج ممنوع أو غير قانوني (Prohibited Item)' },
  { key: 'محتوى غير لائق أو مسيء', label: 'محتوى غير لائق أو مسيء (Inappropriate)' },
  { key: 'معلومات اتصال خاطئة أو مضللة', label: 'معلومات اتصال خاطئة أو مضللة' },
  { key: 'تصنيف في قسم خاطئ', label: 'تصنيف في قسم خاطئ' },
  { key: 'أخرى', label: 'سبب آخر (يرجى التوضيح)' },
];

export function ReportModal({
  isOpen,
  onClose,
  targetId,
  targetType = 'PRODUCT',
  targetTitle,
}: ReportModalProps) {
  const { toast } = useToast();
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0].key);
  const [description, setDescription] = useState('');

  const submitReportMutation = useSubmitReport();

  if (!isOpen) return null;

  const hasToken = tokenStorage.hasToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasToken) {
      toast({
        title: 'يجب تسجيل الدخول',
        description: 'يرجى تسجيل الدخول أولاً لتتمكن من تقديم بلاغ للإدارة.',
        type: 'error',
      });
      return;
    }

    const fullReason = description.trim()
      ? `${selectedReason}: ${description.trim()}`
      : selectedReason;

    try {
      await submitReportMutation.mutateAsync({
        target_type: targetType as any,
        target_id: targetId,
        reason: fullReason,
      });

      toast({
        title: 'تم إرسال البلاغ بنجاح',
        description: 'شكراً لمساعدتنا في الحفاظ على أمان مجتمع صفقة. سيقوم فريق الإشراف بمراجعة البلاغ.',
        type: 'success',
      });

      onClose();
    } catch (err: any) {
      toast({
        title: 'تعذر إرسال البلاغ',
        description: err?.message || 'حدث خطأ أثناء إرسال البلاغ. يرجى المحاولة مرة أخرى.',
        type: 'error',
      });
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 dir-rtl"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 text-rose-500">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-base text-[var(--foreground)]">تقديم بلاغ عن محتوى مخالف</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-lg hover:bg-[var(--muted)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {targetTitle && (
          <p className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/50 p-2.5 rounded-xl">
            الإعلان المبلغ عنه: <strong className="text-[var(--foreground)]">{targetTitle}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--foreground)] mb-2">
              سبب الإبلاغ:
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r.key}
                  className="flex items-center gap-2 text-xs text-[var(--foreground)] p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)]/40 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="report_reason"
                    checked={selectedReason === r.key}
                    onChange={() => setSelectedReason(r.key)}
                    className="accent-[var(--primary)]"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--foreground)] mb-1.5">
              تفاصيل إضافية (اختياري):
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وضح أي تفاصيل تساعد المشرفين في التحقق من الإعلان..."
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              إلغاء
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitReportMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
            >
              {submitReportMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  إرسال البلاغ
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
