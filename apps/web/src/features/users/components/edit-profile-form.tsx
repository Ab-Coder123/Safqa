'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMyProfile } from '../hooks/use-my-profile';
import { useUpdateProfile } from '../hooks/use-update-profile';
import { usersApi } from '../api/users.api';
import { Button, Input, Label } from '@/components/ui';
import { isApiError } from '@/lib/api';
import {
  User,
  Camera,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { UserGender } from '@safqa/types';

export const EditProfileForm = memo(function EditProfileForm() {
  const router = useRouter();
  const { data, isLoading } = useMyProfile();
  const updateMutation = useUpdateProfile();

  const profile = (data as any)?.user ?? data;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<UserGender | ''>('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone_number || '');
      setGender(profile.gender || '');
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  // Avatar file upload per User_Profile_Workflow.md
  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size < 5MB per workflow constraint
    if (file.size > 5 * 1024 * 1024) {
      setClientErrors((prev) => ({
        ...prev,
        avatar: 'حجم الصورة يجب ألا يتجاوز 5 ميجابايت',
      }));
      return;
    }

    // Check format
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setClientErrors((prev) => ({
        ...prev,
        avatar: 'صيغة الصورة يجب أن تكون JPG أو PNG أو WEBP',
      }));
      return;
    }

    setClientErrors((prev) => {
      const copy = { ...prev };
      delete copy.avatar;
      return copy;
    });

    try {
      setAvatarUploading(true);
      const res = await usersApi.uploadAvatar(file);
      setAvatarUrl(res.url);
    } catch (err) {
      setClientErrors((prev) => ({
        ...prev,
        avatar: isApiError(err) ? err.message : 'تعذر رفع الصورة الرمزية',
      }));
    } finally {
      setAvatarUploading(false);
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      errors.fullName = 'الاسم الكامل يجب أن يكون 3 أحرف على الأقل';
    }

    if (phone.trim() && !/^(\+20|0)?1[0125][0-9]{8}$/.test(phone.trim())) {
      errors.phone = 'يرجى إدخال رقم هاتف مصري صحيح (مثال: 01012345678)';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSuccessMsg('');

    if (!validate()) return;

    try {
      await updateMutation.mutateAsync({
        full_name: fullName.trim(),
        phone_number: phone.trim() || undefined,
        gender: gender ? (gender as UserGender) : undefined,
        avatar_url: avatarUrl || undefined,
      });

      setSuccessMsg('تم حفظ التعديلات بنجاح!');
      setTimeout(() => {
        router.push('/profile');
      }, 1200);
    } catch (err) {
      setServerError(
        isApiError(err) ? err.message : 'تعذر تحديث البيانات. حاول مجدداً.'
      );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 max-w-xl mx-auto text-center py-16 animate-pulse">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)] mb-3" />
        <p className="text-sm text-[var(--muted-foreground)]">جاري تحميل بيانات الحساب...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)] tracking-tight">
              تعديل الملف الشخصي
            </h1>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              قم بتحديث معلوماتك الشخصية وصورتك في سوق صفقة
            </p>
          </div>
          <Link href="/profile">
            <Button size="sm" variant="ghost" className="gap-1.5 text-xs">
              <ArrowRight className="w-4 h-4" />
              العودة للملف
            </Button>
          </Link>
        </div>

        {/* Server Feedback */}
        {serverError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* ── Avatar Upload Section ── */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="relative group shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[var(--primary)] shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center text-2xl font-bold border-2 border-[var(--border)]">
                  {fullName?.charAt(0) || <User className="w-8 h-8" />}
                </div>
              )}

              {/* Upload trigger button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
                title="تغيير الصورة الرمزية"
              >
                {avatarUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="space-y-1 text-center sm:text-right">
              <span className="text-xs font-bold text-[var(--foreground)] block">الصورة الشخصية</span>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                يدعم JPG, PNG, WEBP حتى 5 ميجابايت كحد أقصى.
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="text-xs h-8 gap-1.5 mt-1"
              >
                <Camera className="w-3.5 h-3.5" />
                {avatarUploading ? 'جاري الرفع...' : 'رفع صورة جديدة'}
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarSelect}
              className="hidden"
            />
          </div>
          {clientErrors.avatar && (
            <p className="text-xs text-rose-500 font-medium -mt-4">{clientErrors.avatar}</p>
          )}

          {/* ── Full Name ── */}
          <div className="space-y-1.5">
            <Label htmlFor="full_name" className="text-xs font-bold text-[var(--foreground)]">
              الاسم الكامل <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="full_name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="مثال: أحمد محمد"
              error={!!clientErrors.fullName}
            />
            {clientErrors.fullName && (
              <p className="text-xs text-rose-500 font-medium">{clientErrors.fullName}</p>
            )}
          </div>

          {/* ── Phone Number ── */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-bold text-[var(--foreground)]">
              رقم الهاتف
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01012345678"
              className="dir-ltr text-right"
              error={!!clientErrors.phone}
            />
            {clientErrors.phone && (
              <p className="text-xs text-rose-500 font-medium">{clientErrors.phone}</p>
            )}
          </div>

          {/* ── Gender ── */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[var(--foreground)]">
              النوع
            </Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--foreground)]">
                <input
                  type="radio"
                  name="gender"
                  value={UserGender.MALE}
                  checked={gender === UserGender.MALE}
                  onChange={() => setGender(UserGender.MALE)}
                  className="accent-[var(--primary)]"
                />
                <span>ذكر</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--foreground)]">
                <input
                  type="radio"
                  name="gender"
                  value={UserGender.FEMALE}
                  checked={gender === UserGender.FEMALE}
                  onChange={() => setGender(UserGender.FEMALE)}
                  className="accent-[var(--primary)]"
                />
                <span>أنثى</span>
              </label>
            </div>

          </div>

          {/* ── Email (Read-Only) ── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-[var(--foreground)]">
                البريد الإلكتروني
              </Label>
              <span className="text-[10px] text-[var(--muted-foreground)]">لا يمكن تغييره لأسباب أمنية</span>
            </div>
            <Input
              type="email"
              value={profile?.email || ''}
              disabled
              className="dir-ltr text-right bg-[var(--surface)] text-[var(--muted-foreground)] cursor-not-allowed opacity-80"
            />
          </div>

          {/* ── Submit Buttons ── */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Link href="/profile">
              <Button type="button" variant="outline" size="sm" className="font-bold">
                إلغاء
              </Button>
            </Link>
            <Button
              type="submit"
              size="sm"
              isLoading={updateMutation.isPending}
              className="font-bold gap-2 min-w-[120px]"
            >
              <span>حفظ التعديلات</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
});
