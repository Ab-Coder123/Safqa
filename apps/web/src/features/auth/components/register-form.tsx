'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isApiError } from '@/lib/api';
import { useRegister } from '../hooks/use-register';
import { toRegisterInput } from '../schemas/register.schema';

export function RegisterForm() {
  const { theme, setTheme } = useTheme();
  const registerMutation = useRegister();

  // Form State aligned with RegisterDto
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
    birth_date: '1998-01-01',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // States
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  // Password validation rules
  const hasMinLength = formData.password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const passwordsMatch =
    formData.password.length > 0 && formData.password === formData.confirmPassword;

  // Validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.full_name.trim() || formData.full_name.trim().length < 3) {
      errors.full_name = 'الاسم الثلاثي يجب أن يكون 3 أحرف على الأقل';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'بريد إلكتروني غير صحيح';
    }

    const egPhoneRegex = /^(010|011|012|015)\d{8}$/;
    if (!formData.phone_number.trim() || !egPhoneRegex.test(formData.phone_number.trim())) {
      errors.phone_number = 'رقم الهاتف يجب أن يكون رقم مصري صحيح (مثال: 01012345678)';
    }

    if (!hasMinLength) {
      errors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'كلمتا المرور غير متطابقتين';
    }

    if (!termsAccepted) {
      errors.terms = 'يجب الموافقة على الشروط والأحكام وسياسة الخصوصية';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    try {
      await registerMutation.mutateAsync(toRegisterInput(formData));

      // Redirect to home page as authenticated user
      window.location.href = '/';
    } catch (err: unknown) {
      setServerError(
        isApiError(err)
          ? err.message
          : 'تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً.',
      );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between transition-colors duration-200 dir-rtl font-cairo">
      {/* ── Outer Layout Container ── */}
      <div className="flex-1 w-full max-w-[1280px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start justify-center">

        {/* ══════════════════════════════════════════════════════════
            LEFT SIDE: Marketing & Brand Identity (Desktop/Tablet)
        ══════════════════════════════════════════════════════════ */}
        <div className="w-full lg:w-5/12 flex flex-col justify-between py-4 lg:sticky lg:top-8">
          <div>
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-8 no-underline">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                <img src="/images/safqa-logo-3d.png" alt="Safqa Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-[var(--foreground)]">
                صفقة<span className="text-[var(--primary)]">.</span>
              </span>
            </Link>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-[var(--foreground)] mb-3">
              أنشئ حسابك في <span className="text-[var(--primary)]">صفقة</span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed mb-8 max-w-md">
              انضم إلى آلاف المستخدمين والتجار في أسهل وأسرع سوق مباشر للبيع والشراء بدون عمولات.
            </p>

            {/* 3D Visual Illustration Box */}
            <div className="relative w-full aspect-[4/3] rounded-3xl bg-gradient-to-br from-[var(--surface)] to-[var(--card)] border border-[var(--border)] p-6 mb-8 flex flex-col items-center justify-center overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 pointer-events-none" />

              {/* Official Safqa PNG 3D Logo Graphic */}
              <div className="relative z-10 max-w-[240px] max-h-[170px] w-full flex items-center justify-center mb-2">
                <img
                  src="/images/safqa-logo-3d.png"
                  alt="Safqa Official Logo"
                  className="w-full h-auto object-contain drop-shadow-md transition-transform hover:scale-105 duration-300"
                />
              </div>

              <div className="relative z-10 text-center">
                <span className="inline-block px-3.5 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-xs mb-1">
                  مجتمع موثوق ومباشر 🤝
                </span>
                <p className="text-xs text-[var(--muted-foreground)]">تواصل مع البائعين والمشترين بحرية وبدون وسيط</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <span className="text-sm font-black" aria-hidden="true">✓</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--foreground)]">آمن وخاص</h4>
                  <p className="text-xs text-[var(--muted-foreground)]">بياناتك مشفرة ومحمية وفق أعلى معايير الأمان.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <span className="text-sm font-black" aria-hidden="true">✓</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--foreground)]">سريع وفعال</h4>
                  <p className="text-xs text-[var(--muted-foreground)]">صُمم ليوفر وقتك ويضمن تجربة بيع وشراء سلسة.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} صفقة Safqa. جميع الحقوق محفوظة.
          </div>
        </div>


        {/* ══════════════════════════════════════════════════════════
            RIGHT SIDE: Sign Up Form Card
        ══════════════════════════════════════════════════════════ */}
        <div className="w-full lg:w-7/12 flex flex-col gap-4">

          {/* Top Bar Controls (Theme Toggle) */}
          <div className="flex justify-end items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all shadow-sm cursor-pointer"
              title="تبديل المظهر"
            >
              <span className="block h-[18px] w-[18px] text-xs font-black leading-[18px]">
                {theme === 'dark' ? 'L' : 'D'}
              </span>
            </button>
          </div>

          {/* ── Main Form Card ── */}
          <div className="w-full bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg">

            {/* Header inside Card */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mb-1">
                إنشاء حساب جديد
              </h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                أدخل بياناتك أدناه لإنشاء حسابك والانضمام لصفقة.
              </p>
            </div>

            {/* Global Server Error Banner */}
            {serverError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-start gap-2.5">
                <span className="shrink-0 mt-0.5 text-sm font-black" aria-hidden="true">!</span>
                <span>{serverError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* ── Grid: Full Name & Email ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="full_name" className="text-xs font-bold text-[var(--foreground)]">
                    الاسم بالكامل <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="full_name"
                      type="text"
                      placeholder="أحمد محمد علي"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="pr-10"
                      error={!!clientErrors.full_name}
                    />
                  </div>
                  {clientErrors.full_name && (
                    <p className="text-xs text-red-500 font-medium">{clientErrors.full_name}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-[var(--foreground)]">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pr-10 dir-ltr text-right"
                      error={!!clientErrors.email}
                    />
                  </div>
                  {clientErrors.email && (
                    <p className="text-xs text-red-500 font-medium">{clientErrors.email}</p>
                  )}
                </div>
              </div>

              {/* ── Phone Number (Egyptian Format) ── */}
              <div className="space-y-1.5">
                <Label htmlFor="phone_number" className="text-xs font-bold text-[var(--foreground)]">
                  رقم الهاتف (مصر) <span className="text-red-500">*</span>
                </Label>
                <div className="relative flex items-center">

                  {/* Flag & Prefix */}
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-[var(--muted-foreground)] border-r border-[var(--border)] pr-2.5 pointer-events-none">
                    <span>🇪🇬</span>
                    <span>+20</span>
                  </div>

                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="01012345678"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="pr-10 pl-20 font-mono text-sm"
                    error={!!clientErrors.phone_number}
                  />
                </div>
                {clientErrors.phone_number ? (
                  <p className="text-xs text-red-500 font-medium">{clientErrors.phone_number}</p>
                ) : (
                  <p className="text-[11px] text-[var(--muted-foreground)]">يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015</p>
                )}
              </div>

              {/* ── Grid: Password & Confirm Password ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-bold text-[var(--foreground)]">
                    كلمة المرور <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pr-10 pl-10"
                      error={!!clientErrors.password}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1"
                    >
                      {showPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                  {clientErrors.password && (
                    <p className="text-xs text-red-500 font-medium">{clientErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs font-bold text-[var(--foreground)]">
                    تأكيد كلمة المرور <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pr-10 pl-10"
                      error={!!clientErrors.confirmPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1"
                    >
                      {showConfirmPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                  {clientErrors.confirmPassword && (
                    <p className="text-xs text-red-500 font-medium">{clientErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Password Requirements Indicator */}
              <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <p className="text-[11px] font-bold text-[var(--muted-foreground)]">متطلبات كلمة المرور:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[var(--muted-foreground)]'}`}>
                    <span className="text-[13px] font-black" aria-hidden="true">✓</span>
                    <span>8 أحرف على الأقل</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLetter && hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[var(--muted-foreground)]'}`}>
                    <span className="text-[13px] font-black" aria-hidden="true">✓</span>
                    <span>حروف وأرقام</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[var(--muted-foreground)]'}`}>
                    <span className="text-[13px] font-black" aria-hidden="true">✓</span>
                    <span>تطابق كلمتي المرور</span>
                  </div>
                </div>
              </div>

              {/* ── Grid: Gender & Birth Date (Required by RegisterDto) ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gender */}
                <div className="space-y-1.5">
                  <Label htmlFor="gender" className="text-xs font-bold text-[var(--foreground)]">
                    النوع <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'MALE' | 'FEMALE' })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] transition-colors outline-none focus:border-[var(--ring)]"
                  >
                    <option value="MALE">ذكر</option>
                    <option value="FEMALE">أنثى</option>
                  </select>
                </div>

                {/* Birth Date */}
                <div className="space-y-1.5">
                  <Label htmlFor="birth_date" className="text-xs font-bold text-[var(--foreground)]">
                    تاريخ الميلاد <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                      className="pr-10"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[var(--muted-foreground)] select-none">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)] accent-[var(--primary)]"
                  />
                  <span>
                    أوافق على{' '}
                    <Link href="#" className="text-[var(--primary)] font-bold underline underline-offset-2">
                      شروط الخدمة
                    </Link>{' '}
                    و{' '}
                    <Link href="#" className="text-[var(--primary)] font-bold underline underline-offset-2">
                      سياسة الخصوصية
                    </Link>
                  </span>
                </label>
                {clientErrors.terms && (
                  <p className="text-xs text-red-500 font-medium mt-1">{clientErrors.terms}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                isLoading={registerMutation.isPending}
                className="w-full text-base font-bold rounded-xl mt-2 py-3"
              >
                إنشاء الحساب
              </Button>


              {/* Already have an account */}
              <div className="pt-4 text-center text-xs text-[var(--muted-foreground)]">
                لديك حساب بالفعل؟{' '}
                <Link href="/login" className="text-[var(--primary)] font-extrabold hover:underline">
                  تسجيل الدخول
                </Link>
              </div>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
