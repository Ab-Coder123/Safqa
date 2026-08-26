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
import { AuthGuard } from '@/features/auth/components/auth-guard';

function SettingsContent() {
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

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-extrabold text-[var(--foreground)] mb-1">
          ⚙️ إعدادات الحساب
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">إدارة بياناتك الشخصية وكلمة المرور</p>

        {message && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-sm mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-[var(--muted-foreground)]">جاري التحميل...</div>
        ) : (
          <div className="space-y-8">
            {/* Account Info Box */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-[var(--foreground)]">البيانات الشخصية</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[var(--muted-foreground)] block text-xs mb-1">الاسم الكامل</span>
                  <span className="font-semibold">{profile?.full_name}</span>
                </div>
                <div>
                  <span className="text-[var(--muted-foreground)] block text-xs mb-1">البريد الإلكتروني</span>
                  <span className="font-semibold">{profile?.email}</span>
                </div>
                <div>
                  <span className="text-[var(--muted-foreground)] block text-xs mb-1">رقم الهاتف</span>
                  <span className="font-semibold">{profile?.phone_number}</span>
                </div>
                <div>
                  <span className="text-[var(--muted-foreground)] block text-xs mb-1">النوع</span>
                  <span className="font-semibold">{profile?.gender === 'MALE' ? 'ذكر' : 'أنثى'}</span>
                </div>
              </div>
            </div>

            {/* Change Password Form */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">تغيير كلمة المرور</h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">كلمة المرور الحالية</label>
                  <Input
                    type="password"
                    required
                    value={pwForm.current_password}
                    onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">كلمة المرور الجديدة</label>
                  <Input
                    type="password"
                    required
                    minLength={8}
                    value={pwForm.new_password}
                    onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">تأكيد كلمة المرور الجديدة</label>
                  <Input
                    type="password"
                    required
                    minLength={8}
                    value={pwForm.confirm_new_password}
                    onChange={(e) => setPwForm({ ...pwForm, confirm_new_password: e.target.value })}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
                </Button>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">منطقة الخطر</h2>
              <p className="text-xs text-[var(--muted-foreground)] mb-4 leading-relaxed">
                حذف الحساب سيقوم بتعطيل حسابك وإخفاء جميع إعلاناتك المعروضة على المنصة.
              </p>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleteAccountMutation.isPending}
              >
                {deleteAccountMutation.isPending ? 'جاري الحذف...' : 'حذف حسابي نهائياً'}
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
