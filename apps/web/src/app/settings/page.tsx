'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMyProfile } from '@/features/users/hooks/use-my-profile';
import { useChangePassword } from '@/features/users/hooks/use-change-password';
import { useDeleteAccount } from '@/features/users/hooks/use-delete-account';
import { tokenStorage } from '@/lib/api';

export default function SettingsPage() {
  const { data: profileData, isLoading: loading } = useMyProfile();
  const changePasswordMutation = useChangePassword();
  const deleteAccountMutation = useDeleteAccount();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_new_password: '' });

  const profile = profileData?.user;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (pwForm.new_password !== pwForm.confirm_new_password) {
      setError('كلمة المرور الجديدة غير متطابقة مع التأكيد');
      return;
    }

    changePasswordMutation.mutate(
      {
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      },
      {
        onSuccess: (data) => {
          setMessage(data.message || 'تم تغيير كلمة المرور بنجاح');
          setPwForm({ current_password: '', new_password: '', confirm_new_password: '' });
        },
        onError: (err: any) => {
          setError(err.message || 'فشل تغيير كلمة المرور');
        },
      }
    );
  };

  const handleDeleteAccount = () => {
    if (!confirm('هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    deleteAccountMutation.mutate();
  };

  if (!tokenStorage.hasToken()) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8 text-[var(--muted-foreground)]">
          يجب تسجيل الدخول أولاً
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">إعدادات الحساب</h1>

        {message && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 p-3 rounded-xl text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Profile Summary */}
        {loading ? (
          <div className="text-center py-8 text-[var(--muted-foreground)]">جاري التحميل...</div>
        ) : profile && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-2">
            <h2 className="text-base font-bold text-[var(--foreground)] mb-3">معلوماتي</h2>
            <p className="text-sm text-[var(--muted-foreground)]"><strong className="text-[var(--foreground)]">الاسم: </strong>{profile.full_name}</p>
            <p className="text-sm text-[var(--muted-foreground)]"><strong className="text-[var(--foreground)]">البريد: </strong>{profile.email}</p>
            <p className="text-sm text-[var(--muted-foreground)]"><strong className="text-[var(--foreground)]">الهاتف: </strong>{profile.phone_number}</p>
          </div>
        )}

        {/* Change Password */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-[var(--foreground)] mb-4">تغيير كلمة المرور</h2>
          <form onSubmit={handleChangePassword} className="space-y-3">
            {(['current_password', 'new_password', 'confirm_new_password'] as const).map((field) => (
              <Input
                key={field}
                type="password"
                required
                placeholder={field === 'current_password' ? 'كلمة المرور الحالية' : field === 'new_password' ? 'كلمة المرور الجديدة' : 'تأكيد كلمة المرور الجديدة'}
                value={pwForm[field]}
                onChange={(e) => setPwForm({ ...pwForm, [field]: e.target.value })}
              />
            ))}
            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="w-full"
            >
              {changePasswordMutation.isPending ? 'جاري التحديث...' : 'تغيير كلمة المرور'}
            </Button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6">
          <h2 className="text-base font-bold text-red-600 dark:text-red-400 mb-1">منطقة الخطر</h2>
          <p className="text-xs text-[var(--muted-foreground)] mb-4">سيتم أرشفة جميع إعلاناتك وحذف حسابك بشكل نهائي.</p>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleteAccountMutation.isPending}
            size="sm"
          >
            {deleteAccountMutation.isPending ? 'جاري الحذف...' : 'حذف الحساب'}
          </Button>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
