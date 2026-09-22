'use client';

import React, { useState, useRef, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isApiError } from '@/lib/api';
import { useForgotPassword } from '../hooks/use-forgot-password';
import { KeyRound, Mail, ArrowRight, CheckCircle2, ShieldCheck, X, Eye, EyeOff } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSuccess: (email: string) => void;
}

type Step = 1 | 2 | 3;

export const ForgotPasswordModal = memo(function ForgotPasswordModal({
  isOpen,
  onClose,
  initialEmail = '',
  onSuccess,
}: ForgotPasswordModalProps) {
  const { sendOtpMutation, verifyOtpMutation, resetPasswordMutation } = useForgotPassword();

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState(initialEmail);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [debugCodeNotice, setDebugCodeNotice] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const digitRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setDebugCodeNotice('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    try {
      const res = await sendOtpMutation.mutateAsync(trimmedEmail);
      if (res.debug_code) {
        setDebugCodeNotice(`رمز التجربة التطويري: ${res.debug_code}`);
      }
      setStep(2);
    } catch (err) {
      setErrorMsg(isApiError(err) ? err.message : 'حدث خطأ أثناء إرسال الرمز');
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste of 6 digits
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      if (digits.length > 0) {
        const newOtp = [...otpDigits];
        digits.forEach((d, i) => {
          if (i < 6) newOtp[i] = d;
        });
        setOtpDigits(newOtp);
        const focusIdx = Math.min(digits.length, 5);
        digitRefs[focusIdx].current?.focus();
      }
      return;
    }

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      digitRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const code = otpDigits.join('');

    if (code.length < 6) {
      setErrorMsg('يرجى إدخال رمز التحقق المكون من 6 أرقام كاملاً');
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({ email: email.trim(), code });
      setStep(3);
    } catch (err) {
      setErrorMsg(isApiError(err) ? err.message : 'رمز التحقق غير صحيح أو انتهت صلاحيته');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('كلمتا المرور غير متطابقتين');
      return;
    }

    const code = otpDigits.join('');
    try {
      await resetPasswordMutation.mutateAsync({
        email: email.trim(),
        code,
        new_password: newPassword,
      });
      setSuccessMsg('تم تغيير كلمة المرور بنجاح!');
      setTimeout(() => {
        onSuccess(email.trim());
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg(isApiError(err) ? err.message : 'تعذر تغيير كلمة المرور');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 dir-rtl animate-fadeIn">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-xl hover:bg-[var(--accent)] transition-colors"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
            {step === 1 && <Mail className="w-5 h-5" />}
            {step === 2 && <ShieldCheck className="w-5 h-5 text-amber-500" />}
            {step === 3 && <KeyRound className="w-5 h-5 text-emerald-500" />}
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[var(--foreground)]">
              {step === 1 && 'نسيت كلمة المرور؟'}
              {step === 2 && 'تأكيد رمز التحقق'}
              {step === 3 && 'تعيين كلمة المرور الجديدة'}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              {step === 1 && 'أدخل بريدك الإلكتروني لإرسال رمز التأكيد'}
              {step === 2 && `أدخل الرمز المكون من 6 أرقام المرسل إلى ${email}`}
              {step === 3 && 'أدخل كلمة المرور الجديدة لحسابك'}
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`} />
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Debug Code Notice (for dev testing) */}
        {debugCodeNotice && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold text-center">
            {debugCodeNotice}
          </div>
        )}

        {/* Success Banner */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {successMsg}
          </div>
        )}

        {/* ── STEP 1: Enter Email ── */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="reset-email" className="text-xs font-bold text-[var(--foreground)]">
                البريد الإلكتروني
              </Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="dir-ltr text-right"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              isLoading={sendOtpMutation.isPending}
              className="w-full font-bold rounded-xl gap-2 mt-2"
            >
              <span>إرسال رمز التحقق</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </Button>
          </form>
        )}

        {/* ── STEP 2: Enter 6-Digit OTP ── */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="flex justify-center gap-2 dir-ltr">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={digitRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-11 h-12 text-center text-lg font-extrabold rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-1/3 font-bold rounded-xl"
              >
                تغيير البريد
              </Button>
              <Button
                type="submit"
                isLoading={verifyOtpMutation.isPending}
                className="w-2/3 font-bold rounded-xl gap-2"
              >
                <span>تأكيد الرمز</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </Button>
            </div>
          </form>
        )}

        {/* ── STEP 3: Reset Password ── */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-password" className="text-xs font-bold text-[var(--foreground)]">
                كلمة المرور الجديدة
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password" className="text-xs font-bold text-[var(--foreground)]">
                تأكيد كلمة المرور الجديدة
              </Label>
              <Input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              isLoading={resetPasswordMutation.isPending}
              className="w-full font-bold rounded-xl gap-2 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تغيير كلمة المرور وتأكيد الحساب</span>
            </Button>
          </form>
        )}
      </div>
    </div>
  );
});
