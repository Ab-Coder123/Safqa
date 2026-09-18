'use client';

import React, { useState, useRef } from 'react';
import { Camera, Lock, Shield, Trash2, Eye, EyeOff, CheckCircle, Edit2, X, Save, Phone, Mail, Calendar, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui';
import { useMyProfile } from '../hooks/use-my-profile';
import { useUpdateProfile } from '../hooks/use-update-profile';
import { useChangePassword } from '../hooks/use-change-password';
import { useDeleteAccount } from '../hooks/use-delete-account';
import { usersApi } from '../api/users.api';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatArabicDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));
}

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: '', color: 'bg-[var(--border)]', width: 'w-0' };
  if (pw.length < 6) return { label: 'ضعيفة جداً', color: 'bg-rose-500', width: 'w-1/4' };
  if (pw.length < 8) return { label: 'ضعيفة', color: 'bg-orange-400', width: 'w-2/4' };
  if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) return { label: 'متوسطة', color: 'bg-amber-400', width: 'w-3/4' };
  return { label: 'قوية', color: 'bg-emerald-500', width: 'w-full' };
}

// ─── Avatar Card ─────────────────────────────────────────────────────────────

function AvatarCard({ profile, onAvatarChange }: { profile: any; onAvatarChange: (url: string) => void }) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const resolveUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${apiBase}${url}`;
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'ملف غير مدعوم', description: 'يرجى اختيار صورة بصيغة JPG أو PNG أو WEBP', type: 'error' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'حجم الصورة كبير', description: 'الحد الأقصى هو 5 ميجابايت', type: 'error' });
      return;
    }
    setUploading(true);
    try {
      const res = await usersApi.uploadAvatar(file);
      onAvatarChange(res.url);
      toast({ title: 'تم تحديث الصورة ✅', type: 'success' });
    } catch (err: any) {
      toast({ title: 'تعذر رفع الصورة', description: err?.message, type: 'error' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const roleBadge = profile?.role === 'SUPER_ADMIN'
    ? { label: 'مدير النظام', color: 'bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800' }
    : { label: 'مستخدم', color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };

  return (
    <div className="bg-gradient-to-br from-[var(--primary)]/5 to-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-[var(--primary)]/20 shadow-lg bg-[var(--muted)]">
            {resolveUrl(profile?.avatar_url) ? (
              <img
                src={resolveUrl(profile?.avatar_url)!}
                alt={profile?.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/70">
                <span className="text-white text-2xl font-extrabold">{initials}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-2 -left-2 w-8 h-8 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--primary)]/90 transition-colors cursor-pointer disabled:opacity-60"
            title="تغيير الصورة الشخصية"
          >
            {uploading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarUpload} />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-right">
          <h2 className="text-xl font-extrabold text-[var(--foreground)] mb-1">{profile?.full_name || '—'}</h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-3 flex items-center gap-1.5 justify-center sm:justify-end">
            <Mail className="w-3.5 h-3.5" />
            {profile?.email || '—'}
          </p>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${roleBadge.color}`}>
              <Shield className="w-3 h-3" />
              {roleBadge.label}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800">
              <CheckCircle className="w-3 h-3" />
              حساب نشط
            </span>
          </div>
          {profile?.created_at && (
            <p className="text-[11px] text-[var(--muted-foreground)] mt-2 flex items-center gap-1 justify-center sm:justify-end">
              <LogIn className="w-3 h-3" />
              انضم في {formatArabicDate(profile.created_at)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Personal Info Card ───────────────────────────────────────────────────────

function PersonalInfoCard({ profile }: { profile: any }) {
  const { toast } = useToast();
  const updateMutation = useUpdateProfile();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    phone_number: '',
    gender: '' as 'MALE' | 'FEMALE' | '',
  });

  const openEdit = () => {
    setForm({
      full_name: profile?.full_name || '',
      phone_number: profile?.phone_number || '',
      gender: profile?.gender || '',
    });
    setEditMode(true);
  };

  const handleSave = () => {
    if (form.full_name.trim().length < 3) {
      toast({ title: 'الاسم قصير جداً', description: 'يجب أن يكون الاسم 3 أحرف على الأقل', type: 'error' });
      return;
    }
    if (form.phone_number && !/^(010|011|012|015)\d{8}$/.test(form.phone_number)) {
      toast({ title: 'رقم هاتف غير صحيح', description: 'يجب أن يكون رقماً مصرياً صحيحاً (010, 011, 012, 015)', type: 'error' });
      return;
    }

    const payload: any = {};
    if (form.full_name !== profile?.full_name) payload.full_name = form.full_name;
    if (form.phone_number !== profile?.phone_number) payload.phone_number = form.phone_number;
    if (form.gender && form.gender !== profile?.gender) payload.gender = form.gender;

    if (Object.keys(payload).length === 0) {
      setEditMode(false);
      return;
    }

    updateMutation.mutate(payload, {
      onSuccess: () => {
        toast({ title: 'تم تحديث بياناتك ✅', type: 'success' });
        setEditMode(false);
      },
      onError: (err: any) => {
        toast({ title: 'تعذر التحديث', description: err?.message, type: 'error' });
      },
    });
  };

  const genderLabel = (g: string) => g === 'MALE' ? 'ذكر' : g === 'FEMALE' ? 'أنثى' : '—';

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
            <User className="w-4 h-4 text-[var(--primary)]" />
          </div>
          <h2 className="text-base font-bold text-[var(--foreground)]">البيانات الشخصية</h2>
        </div>
        {!editMode ? (
          <button
            onClick={openEdit}
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            تعديل
          </button>
        ) : (
          <button
            onClick={() => setEditMode(false)}
            className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            إلغاء
          </button>
        )}
      </div>

      {!editMode ? (
        /* ── VIEW MODE ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <InfoField icon={<User className="w-3.5 h-3.5" />} label="الاسم الكامل" value={profile?.full_name} />
          {/* Email (locked) */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-[var(--muted-foreground)] flex items-center gap-1">
              <Mail className="w-3 h-3" />
              البريد الإلكتروني
              <span className="inline-flex items-center gap-0.5 text-[10px] bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5 rounded-md">
                <Lock className="w-2.5 h-2.5" />
                محمي
              </span>
            </span>
            <p className="font-semibold text-sm text-[var(--foreground)]">{profile?.email || '—'}</p>
          </div>
          {/* Phone */}
          <InfoField icon={<Phone className="w-3.5 h-3.5" />} label="رقم الهاتف" value={profile?.phone_number} />
          {/* Gender */}
          <InfoField icon={<User className="w-3.5 h-3.5" />} label="النوع" value={genderLabel(profile?.gender || '')} />
          {/* Birth date */}
          <InfoField icon={<Calendar className="w-3.5 h-3.5" />} label="تاريخ الميلاد" value={formatArabicDate(profile?.birth_date)} />
        </div>
      ) : (
        /* ── EDIT MODE ── */
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--foreground)] block mb-1.5">الاسم الكامل</label>
            <Input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="أدخل اسمك الكامل"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--foreground)] block mb-1.5">رقم الهاتف</label>
            <Input
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              placeholder="01012345678"
              dir="ltr"
            />
          </div>
          {/* Email (read-only) */}
          <div>
            <label className="text-xs font-semibold text-[var(--muted-foreground)] flex items-center gap-1 mb-1.5">
              <Lock className="w-3 h-3" />
              البريد الإلكتروني (لا يمكن تغييره)
            </label>
            <div className="px-3 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--muted-foreground)] select-all" dir="ltr">
              {profile?.email}
            </div>
          </div>
          {/* Gender */}
          <div>
            <label className="text-xs font-semibold text-[var(--foreground)] block mb-2">النوع</label>
            <div className="flex gap-3">
              {[{ val: 'MALE', label: 'ذكر' }, { val: 'FEMALE', label: 'أنثى' }].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setForm({ ...form, gender: val as 'MALE' | 'FEMALE' })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all cursor-pointer ${
                    form.gender === val
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                      : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            variant="primary"
            className="w-full"
          >
            {updateMutation.isPending ? (
              <span className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                جاري الحفظ...
              </span>
            ) : (
              <span className="flex items-center gap-2 justify-center">
                <Save className="w-4 h-4" />
                حفظ التغييرات
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function InfoField({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  return (
    <div className="space-y-1">
      <span className="text-[11px] font-semibold text-[var(--muted-foreground)] flex items-center gap-1">
        {icon}
        {label}
      </span>
      <p className="font-semibold text-sm text-[var(--foreground)]">{value || '—'}</p>
    </div>
  );
}

// ─── Password Card ────────────────────────────────────────────────────────────

function PasswordCard() {
  const { toast } = useToast();
  const changePasswordMutation = useChangePassword();
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_new_password: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });

  const strength = getPasswordStrength(form.new_password);
  const match = form.new_password && form.confirm_new_password
    ? form.new_password === form.confirm_new_password
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.new_password.length < 8) {
      toast({ title: 'كلمة المرور قصيرة', description: 'يجب أن تكون 8 أحرف على الأقل', type: 'error' });
      return;
    }
    if (form.new_password !== form.confirm_new_password) {
      toast({ title: 'كلمتا المرور غير متطابقتين', type: 'error' });
      return;
    }
    changePasswordMutation.mutate(
      { current_password: form.current_password, new_password: form.new_password },
      {
        onSuccess: (data) => {
          toast({ title: data.message || 'تم تغيير كلمة المرور ✅', type: 'success' });
          setForm({ current_password: '', new_password: '', confirm_new_password: '' });
        },
        onError: (err: any) => {
          toast({ title: 'فشل التغيير', description: err?.message || 'كلمة المرور الحالية غير صحيحة', type: 'error' });
        },
      }
    );
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
          <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-base font-bold text-[var(--foreground)]">تغيير كلمة المرور</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="text-xs font-semibold text-[var(--foreground)] block mb-1.5">كلمة المرور الحالية</label>
          <div className="relative">
            <Input
              type={show.current ? 'text' : 'password'}
              required
              value={form.current_password}
              onChange={(e) => setForm({ ...form, current_password: e.target.value })}
              placeholder="أدخل كلمة المرور الحالية"
              className="pl-10"
            />
            <button
              type="button"
              onClick={() => setShow({ ...show, current: !show.current })}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
            >
              {show.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="text-xs font-semibold text-[var(--foreground)] block mb-1.5">كلمة المرور الجديدة</label>
          <div className="relative">
            <Input
              type={show.new ? 'text' : 'password'}
              required
              minLength={8}
              value={form.new_password}
              onChange={(e) => setForm({ ...form, new_password: e.target.value })}
              placeholder="8 أحرف على الأقل"
              className="pl-10"
            />
            <button
              type="button"
              onClick={() => setShow({ ...show, new: !show.new })}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
            >
              {show.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Strength bar */}
          {form.new_password.length > 0 && (
            <div className="mt-2">
              <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)] mt-1">قوة كلمة المرور: <span className="font-semibold">{strength.label}</span></p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-xs font-semibold text-[var(--foreground)] block mb-1.5">تأكيد كلمة المرور الجديدة</label>
          <div className="relative">
            <Input
              type={show.confirm ? 'text' : 'password'}
              required
              minLength={8}
              value={form.confirm_new_password}
              onChange={(e) => setForm({ ...form, confirm_new_password: e.target.value })}
              placeholder="أعد إدخال كلمة المرور الجديدة"
              className={`pl-10 ${match === false ? 'border-rose-500' : match === true ? 'border-emerald-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShow({ ...show, confirm: !show.confirm })}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
            >
              {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {match === false && (
            <p className="text-[11px] text-rose-500 mt-1">⚠️ كلمتا المرور غير متطابقتين</p>
          )}
          {match === true && (
            <p className="text-[11px] text-emerald-500 mt-1">✅ كلمتا المرور متطابقتان</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={changePasswordMutation.isPending || match === false}
          variant="primary"
          className="w-full"
        >
          {changePasswordMutation.isPending ? (
            <span className="flex items-center gap-2 justify-center">
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              جاري الحفظ...
            </span>
          ) : (
            <span className="flex items-center gap-2 justify-center">
              <Shield className="w-4 h-4" />
              تحديث كلمة المرور
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}

// ─── Danger Zone Card ─────────────────────────────────────────────────────────

function DangerZoneCard() {
  const { toast } = useToast();
  const deleteAccountMutation = useDeleteAccount();
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = () => {
    deleteAccountMutation.mutate(undefined as any, {
      onError: (err: any) => {
        toast({ title: 'فشل الحذف', description: err?.message, type: 'error' });
      },
    });
  };

  return (
    <>
      <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center">
            <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-base font-bold text-rose-600 dark:text-rose-400">منطقة الخطر</h2>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mb-4 leading-relaxed">
          حذف حسابك سيؤدي إلى تعطيله نهائياً وإخفاء جميع إعلاناتك من المنصة. لا يمكن التراجع عن هذا الإجراء.
        </p>
        <Button
          variant="destructive"
          onClick={() => setShowModal(true)}
          disabled={deleteAccountMutation.isPending}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {deleteAccountMutation.isPending ? 'جاري الحذف...' : 'حذف حسابي نهائياً'}
        </Button>
      </div>

      {/* Confirm Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-lg font-extrabold text-center text-[var(--foreground)] mb-2">تأكيد حذف الحساب</h3>
            <p className="text-sm text-[var(--muted-foreground)] text-center mb-4 leading-relaxed">
              هل أنت متأكد تماماً؟ سيتم تعطيل حسابك وأرشفة جميع إعلاناتك. هذا الإجراء <strong>لا يمكن التراجع عنه</strong>.
            </p>
            <div className="mb-4">
              <label className="text-xs font-semibold block mb-1.5 text-[var(--foreground)]">
                اكتب كلمة <span className="text-rose-500">احذف</span> للتأكيد
              </label>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="احذف"
                className="text-center"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => { setShowModal(false); setConfirmText(''); }}
                className="flex-1"
              >
                إلغاء
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={confirmText !== 'احذف' || deleteAccountMutation.isPending}
                className="flex-1"
              >
                {deleteAccountMutation.isPending ? 'جاري...' : 'تأكيد الحذف'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function SettingsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-36 bg-[var(--muted)] rounded-2xl" />
      <div className="h-64 bg-[var(--muted)] rounded-2xl" />
      <div className="h-72 bg-[var(--muted)] rounded-2xl" />
      <div className="h-28 bg-[var(--muted)] rounded-2xl" />
    </div>
  );
}

// ─── Main Workspace ───────────────────────────────────────────────────────────

export function SettingsWorkspace() {
  const { data: profileData, isLoading } = useMyProfile();
  const updateMutation = useUpdateProfile();
  const { toast } = useToast();
  const profile = (profileData as any)?.user ?? profileData;

  const handleAvatarChange = (url: string) => {
    updateMutation.mutate({ avatar_url: url }, {
      onError: (err: any) => {
        toast({ title: 'تعذر حفظ الصورة', description: err?.message, type: 'error' });
      },
    });
  };

  if (isLoading) return <SettingsSkeleton />;

  return (
    <div className="space-y-5">
      <AvatarCard profile={profile} onAvatarChange={handleAvatarChange} />
      <PersonalInfoCard profile={profile} />
      <PasswordCard />
      <DangerZoneCard />
    </div>
  );
}
