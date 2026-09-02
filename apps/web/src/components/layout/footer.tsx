import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t bohrder-[var(--border)] bg-[var(--card)] text-[var(--foreground)] mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-lg">
                ص
              </div>
              <span className="font-extrabold text-xl tracking-tight">صفقة.</span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              منصة صفقة هي أسهل وأسرع سوق إلكتروني مفتوح للبيع والشراء في مصر والوطن العربي. أنشئ إعلانك مجاناً وتواصل مباشرة مع المشترين.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm mb-3">روابط سريعة</h4>
            <ul className="space-y-2 text-xs text-[var(--muted-foreground)]">
              <li><Link href="/" className="hover:text-[var(--primary)] transition-colors">الرئيسية</Link></li>
              <li><Link href="/categories" className="hover:text-[var(--primary)] transition-colors">التصنيفات</Link></li>
              <li><Link href="/products/create" className="hover:text-[var(--primary)] transition-colors">أضف إعلانك</Link></li>
              <li><Link href="/favorites" className="hover:text-[var(--primary)] transition-colors">المفضلة</Link></li>
            </ul>
          </div>

          {/* User Links */}
          <div>
            <h4 className="font-bold text-sm mb-3">حسابك</h4>
            <ul className="space-y-2 text-xs text-[var(--muted-foreground)]">
              <li><Link href="/login" className="hover:text-[var(--primary)] transition-colors">تسجيل الدخول</Link></li>
              <li><Link href="/register" className="hover:text-[var(--primary)] transition-colors">حساب جديد</Link></li>
              <li><Link href="/my-listings" className="hover:text-[var(--primary)] transition-colors">إعلاناتي</Link></li>
              <li><Link href="/settings" className="hover:text-[var(--primary)] transition-colors">الإعدادات</Link></li>
            </ul>
          </div>

          {/* Help & Safety */}
          <div>
            <h4 className="font-bold text-sm mb-3">الأمان والدعم</h4>
            <ul className="space-y-2 text-xs text-[var(--muted-foreground)]">
              <li><Link href="/reports/new" className="hover:text-[var(--primary)] transition-colors">تقديم بلاغ</Link></li>
              <li><span className="opacity-70">شروط الاستخدام</span></li>
              <li><span className="opacity-70">سياسة الخصوصية</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-8 pt-6 text-center text-xs text-[var(--muted-foreground)]">
          جميع الحقوق محفوظة © {new Date().getFullYear()} منصة صفقة Safqa.
        </div>
      </div>
    </footer>
  );
}
