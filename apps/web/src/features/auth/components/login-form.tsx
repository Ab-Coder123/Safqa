'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isApiError } from '@/lib/api';
import { useLogin } from '../hooks/use-login';
import { Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const loginMutation = useLogin();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'بريد إلكتروني غير صحيح';
    }
    if (!formData.password || formData.password.length < 6) {
      errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validateForm()) return;

    try {
      await loginMutation.mutateAsync(formData);
      router.replace('/');
    } catch (err: unknown) {
      setServerError(
        isApiError(err)
          ? err.message
          : 'تعذر الاتصال بالخادم. حاول مرة أخرى.',
      );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between transition-colors duration-200 dir-rtl font-cairo">
      {/* ── Outer Layout Container ── */}
      <div className="flex-1 w-full max-w-[1280px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start justify-center">

        {/* ══════════════════════════════════════════════════════════
            LEFT SIDE: Marketing & Brand Identity
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
              أهلاً بعودتك إلى <span className="text-[var(--primary)]">صفقة</span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed mb-8 max-w-md">
              سجل دخولك للوصول إلى إعلاناتك ورسائلك ومفضلتك في سوق البيع والشراء المباشر.
            </p>

            {/* 3D Visual Illustration Box */}
            <div className="relative w-full aspect-[4/3] rounded-3xl bg-gradient-to-br from-[var(--surface)] to-[var(--card)] border border-[var(--border)] p-6 mb-8 flex flex-col items-center justify-center overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 pointer-events-none" />

              {/* Official Safqa 3D Logo */}
              <div className="relative z-10 max-w-[240px] max-h-[170px] w-full flex items-center justify-center mb-2">
                <img
                  src="/images/safqa-logo-3d.png"
                  alt="Safqa Official Logo"
                  className="w-full h-auto object-contain drop-shadow-md transition-transform hover:scale-105 duration-300"
                />
              </div>

              <div className="relative z-10 text-center">
                <span className="inline-block px-3.5 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-xs mb-1">
                  سوق موثوق وآمن 🔒
                </span>
                <p className="text-xs text-[var(--muted-foreground)]">انضم لآلاف المستخدمين النشطين يومياً</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <span className="text-sm font-black" aria-hidden="true">✓</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--foreground)]">بيانات محمية</h4>
                  <p className="text-xs text-[var(--muted-foreground)]">تسجيل دخولك مشفر ومؤمن بالكامل.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <span className="text-sm font-black" aria-hidden="true">✓</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--foreground)]">وصول فوري</h4>
                  <p className="text-xs text-[var(--muted-foreground)]">تصل لحسابك وإعلاناتك في ثوانٍ.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} صفقة Safqa. جميع الحقوق محفوظة.
          </div>
        </div>


        {/* ══════════════════════════════════════════════════════════
            RIGHT SIDE: Login Form Card
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
                تسجيل الدخول
              </h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                أدخل بريدك الإلكتروني وكلمة المرور للمتابعة.
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

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-[var(--foreground)]">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="dir-ltr text-right"
                  error={!!clientErrors.email}
                  autoComplete="email"
                />
                {clientErrors.email && (
                  <p className="text-xs text-red-500 font-medium">{clientErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-[var(--foreground)]">
                    كلمة المرور <span className="text-red-500">*</span>
                  </Label>
                  <Link
                    href="#"
                    className="text-xs text-[var(--primary)] font-bold hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    error={!!clientErrors.password}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-1"
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>
                {clientErrors.password && (
                  <p className="text-xs text-red-500 font-medium">{clientErrors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                isLoading={loginMutation.isPending}
                className="w-full text-base font-bold rounded-xl mt-2 py-3"
              >
                تسجيل الدخول
              </Button>

              {/* Divider */}
              <div className="relative flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-xs text-[var(--muted-foreground)] font-medium">أو</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>

              {/* Register CTA */}
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center">
                <p className="text-xs text-[var(--muted-foreground)] mb-2">ليس لديك حساب؟</p>
                <Link href="/register">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full font-bold rounded-xl"
                  >
                    إنشاء حساب جديد مجاناً
                  </Button>
                </Link>
              </div>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
