'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../../../components/theme-provider';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Users,
  Sun,
  Moon,
  LockKeyhole,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

export default function RegisterPage() {
  const { theme, setTheme } = useTheme();

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
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          phone_number: formData.phone_number.trim(),
          gender: formData.gender,
          birth_date: new Date(formData.birth_date).toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join('، ')
            : data.message || 'حدث خطأ أثناء إنشاء الحساب'
        );
      }

      // Store Authentication Tokens upon successful registration
      if (data.tokens) {
        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
      }

      // Redirect to home page as authenticated user
      window.location.href = '/';
    } catch (err: any) {
      setServerError(err.message || 'تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
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
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-black text-xl shadow-md">
                ص
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
              
              {/* Decorative Avatar / Illustration Graphic */}
              <div className="relative z-10 w-24 h-24 rounded-full bg-[var(--accent)] border-4 border-[var(--primary)] flex items-center justify-center shadow-lg mb-4">
                <Users size={48} className="text-[var(--primary)]" />
              </div>

              <div className="relative z-10 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-xs mb-1">
                  مجتمع موثوق ومباشر 🤝
                </span>
                <p className="text-xs text-[var(--muted-foreground)]">تواصل مع البائعين والمشترين بحرية وبدون وسيط</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--foreground)]">آمن وخاص</h4>
                  <p className="text-xs text-[var(--muted-foreground)]">بياناتك مشفرة ومحمية وفق أعلى معايير الأمان.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <Zap size={20} />
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
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
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
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
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
                    <User size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
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
                    <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
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
                  <Phone size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
                  
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
                    <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
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
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                    <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
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
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                    <CheckCircle2 size={13} />
                    <span>8 أحرف على الأقل</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLetter && hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[var(--muted-foreground)]'}`}>
                    <CheckCircle2 size={13} />
                    <span>حروف وأرقام</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[var(--muted-foreground)]'}`}>
                    <CheckCircle2 size={13} />
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
                    <Calendar size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
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
                isLoading={loading}
                className="w-full text-base font-bold rounded-xl mt-2 py-3"
              >
                إنشاء الحساب
              </Button>

              {/* Social Sign Up (Visual Reference Only) */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border)]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[var(--card)] px-3 text-[var(--muted-foreground)] font-medium">
                    أو التسجيل عبر
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => alert('التسجيل بواسطة Google متاح قريباً')}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-bold text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('التسجيل بواسطة Apple متاح قريباً')}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-bold text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.93c.67-.82 1.13-1.96.99-3.1-.98.04-2.18.66-2.88 1.47-.63.73-1.18 1.9-1.03 3.02 1.1.09 2.24-.55 2.92-1.39z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>

              {/* Already have an account */}
              <div className="pt-4 text-center text-xs text-[var(--muted-foreground)]">
                لديك حساب بالفعل؟{' '}
                <Link href="/login" className="text-[var(--primary)] font-extrabold hover:underline">
                  تسجيل الدخول
                </Link>
              </div>

            </form>
          </div>

          {/* Security Information Panel */}
          <div className="w-full p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <LockKeyhole size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[var(--foreground)]">أمانك هو أولويتنا الأولى</h4>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                نستخدم أحدث معايير التشفير للحفاظ على سلامة وخصوصية بياناتك دائماً.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
