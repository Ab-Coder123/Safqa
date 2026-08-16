'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '../components/theme-provider';
import { Button, Badge, Card, CardContent } from '../components/ui';
import {
  ShieldCheck,
  Zap,
  Users,
  Tag,
  Headphones,
  UserPlus,
  Search,
  MessageSquare,
  ShoppingBag,
  ArrowLeft,
  Sun,
  Moon,
  Heart,
  Lock,
  CheckCircle2,
  Share2,
  Globe,
  Send,
} from 'lucide-react';

export default function LandingPage() {
  const { theme, setTheme } = useTheme();

  // Static preview dataset matching Product shape for the Marketplace Preview section
  const previewProducts = [
    {
      id: 'prev-1',
      title: 'تويوتا كورولا 2020 فابريكا بالكامل',
      price: 720000,
      condition: 'USED_GOOD',
      status: 'PUBLISHED',
      created_at: new Date().toISOString(),
      category: { name: 'سيارات' },
      media: [{ url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop' }],
    },
    {
      id: 'prev-2',
      title: 'ماك بوك اير M2 سعة 256 جيجا كالجيد تماماً',
      price: 285000,
      condition: 'LIKE_NEW',
      status: 'PUBLISHED',
      created_at: new Date().toISOString(),
      category: { name: 'إلكترونيات' },
      media: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop' }],
    },
    {
      id: 'prev-3',
      title: 'أريكة غرفة معيشة رمادية مودرن بحالة ممتازة',
      price: 4200,
      condition: 'USED_GOOD',
      status: 'PUBLISHED',
      created_at: new Date().toISOString(),
      category: { name: 'أثاث ومنزل' },
      media: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop' }],
    },
    {
      id: 'prev-4',
      title: 'ساعة كاسيو أصلية بالعلبة والضمان',
      price: 1250,
      condition: 'NEW',
      status: 'PUBLISHED',
      created_at: new Date().toISOString(),
      category: { name: 'ساعات وأزياء' },
      media: [{ url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop' }],
    },
    {
      id: 'prev-5',
      title: 'كرسي مكتب دراسي وطبي مريح جداً',
      price: 2800,
      condition: 'LIKE_NEW',
      status: 'PUBLISHED',
      created_at: new Date().toISOString(),
      category: { name: 'أثاث ومنزل' },
      media: [{ url: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=600&auto=format&fit=crop' }],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors selection:bg-[var(--primary)] selection:text-white font-sans">
      {/* ─── PUBLIC MARKETING HEADER ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              ص
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[var(--foreground)]">
              صفقة<span className="text-[var(--primary)]">.</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[var(--muted-foreground)]">
            <Link href="/" className="text-[var(--primary)] font-bold transition-colors">
              الرئيسية
            </Link>
            <a href="#how-it-works" className="hover:text-[var(--foreground)] transition-colors">
              كيف يعمل
            </a>
            <a href="#features" className="hover:text-[var(--foreground)] transition-colors">
              المميزات
            </a>
            <Link href="/categories" className="hover:text-[var(--foreground)] transition-colors">
              التصنيفات
            </Link>
            <a href="#safety" className="hover:text-[var(--foreground)] transition-colors">
              الأمان
            </a>
            <a href="#about" className="hover:text-[var(--foreground)] transition-colors">
              من نحن
            </a>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="تبديل المظهر"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </Button>

            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                تسجيل الدخول
              </Button>
            </Link>

            <Link href="/register">
              <Button size="sm" className="font-bold gap-1.5 shadow-md">
                ابدأ الآن
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left/RTL Main Copy Column */}
            <div className="lg:col-span-6 flex flex-col items-start text-right">
              <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--foreground)] tracking-tight leading-[1.15] mb-6">
                إشترِ. بعْ. <br />
                <span className="text-[var(--primary)]">تواصل بسهولة.</span>
              </h1>

              <p className="body-large text-[var(--muted-foreground)] mb-8 leading-relaxed max-w-xl">
                صفقة هي المنصة الحديثة التي تسهل عليك عملية الشراء والبيع والتواصل المباشر مع الأشخاص من حولك بمنتهى السهولة والأمان بدون أي عمولات.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto font-extrabold text-base px-8 gap-2 shadow-lg hover:scale-[1.02] transition-transform">
                    ابدأ الآن
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>

                <Link href="/products" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold text-base px-8 gap-2 border-[var(--border)] hover:bg-[var(--secondary)]">
                    استكشف صفقة
                  </Button>
                </Link>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-8 border-t border-[var(--border)]/60 grid grid-cols-3 gap-4 w-full text-right">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--foreground)]">
                    <ShieldCheck className="w-4 h-4 text-[var(--primary)] shrink-0" />
                    آمن ومضمون
                  </div>
                  <span className="text-[11px] text-[var(--muted-foreground)]">سلامتك هي أولويتنا</span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--foreground)]">
                    <Zap className="w-4 h-4 text-[var(--primary)] shrink-0" />
                    سهل الاستخدام
                  </div>
                  <span className="text-[11px] text-[var(--muted-foreground)]">تجربة بسيطة وسريعة</span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--foreground)]">
                    <Users className="w-4 h-4 text-[var(--primary)] shrink-0" />
                    موثوق للمجتمع
                  </div>
                  <span className="text-[11px] text-[var(--muted-foreground)]">آلاف الأعضاء السعداء</span>
                </div>
              </div>
            </div>

            {/* Right/RTL Hero Visual & Mockup Column */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              {/* Background Glow */}
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[var(--primary)]/15 blur-3xl -z-10 animate-pulse" />

              {/* Phone Mockup Frame */}
              <div className="relative w-[280px] sm:w-[320px] rounded-[40px] border-8 border-[var(--card-foreground)]/10 bg-[var(--card)] p-3 shadow-2xl overflow-hidden transform lg:rotate-[-2deg]">
                {/* Phone Notch */}
                <div className="w-32 h-4 bg-slate-900 mx-auto rounded-b-xl mb-3" />

                {/* Mock UI Content */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between px-2">
                    <span className="font-extrabold text-sm text-[var(--primary)]">صفقة</span>
                    <Search className="w-4 h-4 text-[var(--muted-foreground)]" />
                  </div>

                  <div className="p-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-emerald-700 text-white">
                    <p className="text-[10px] opacity-80">عروض بالقرب منك</p>
                    <p className="text-xs font-bold mt-0.5">اعثر على أفضل الصفقات اليوم</p>
                  </div>

                  <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-semibold text-[var(--muted-foreground)]">
                    <div className="p-1.5 rounded-lg bg-[var(--surface)]">🚗 سيارات</div>
                    <div className="p-1.5 rounded-lg bg-[var(--surface)]">📱 إلكترونيات</div>
                    <div className="p-1.5 rounded-lg bg-[var(--surface)]">🛋️ أثاث</div>
                    <div className="p-1.5 rounded-lg bg-[var(--surface)]">👕 أزياء</div>
                  </div>

                  <div className="text-[10px] font-bold text-[var(--foreground)] px-1 mt-1">إعلانات مميزة</div>

                  <div className="space-y-2">
                    <div className="flex gap-2 p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                      <div className="w-12 h-12 rounded-md bg-slate-300 shrink-0 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop" alt="sofa" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold truncate text-[var(--foreground)]">أريكة مودرن بحالة جيدة</p>
                        <p className="text-[9px] text-[var(--primary)] font-extrabold">3,250 ج.م</p>
                      </div>
                    </div>

                    <div className="flex gap-2 p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                      <div className="w-12 h-12 rounded-md bg-slate-300 shrink-0 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop" alt="phone" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold truncate text-[var(--foreground)]">آيفون 14 برو ماكس</p>
                        <p className="text-[9px] text-[var(--primary)] font-extrabold">32,000 ج.م</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Product Card Top Right */}
              <div className="hidden sm:flex absolute -top-4 -right-4 p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xl gap-3 items-center max-w-[200px] animate-fade-in">
                <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop" alt="Sofa" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--foreground)] truncate">أريكة مودرن</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">أثاث ومنزل</p>
                  <p className="text-xs font-extrabold text-[var(--primary)] mt-0.5">3,250 ج.م</p>
                </div>
              </div>

              {/* Floating Product Card Bottom Left */}
              <div className="hidden sm:flex absolute -bottom-6 -left-4 p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xl gap-3 items-center max-w-[210px] animate-fade-in">
                <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop" alt="iPhone" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--foreground)] truncate">آيفون 14 برو ماكس</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">إلكترونيات</p>
                  <p className="text-xs font-extrabold text-[var(--primary)] mt-0.5">32,000 ج.م</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-[var(--card)] border-y border-[var(--border)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" className="mb-3">
            HOW IT WORKS • كيف يعمل
          </Badge>
          <h2 className="heading-1 font-extrabold text-3xl sm:text-4xl text-[var(--foreground)] mb-3">
            البيع والشراء بأسلوب بسيط ومباشر
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-xl mx-auto mb-16">
            ابدأ رحلتك في خطوات معدودة وسريعة للانضمام لأسهل سوق في مصر
          </p>

          {/* 4 Steps Flow Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[var(--primary)] group-hover:text-white transition-all shadow-sm">
                <UserPlus className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-[var(--primary)] mb-1">الخطوة 1</span>
              <h3 className="font-bold text-lg text-[var(--foreground)] mb-2">1. أنشئ حسابك</h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                سجل حسابك مجاناً في أقل من دقيقة وانضم فوراً إلى مجتمع صفقة.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[var(--primary)] group-hover:text-white transition-all shadow-sm">
                <Search className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-[var(--primary)] mb-1">الخطوة 2</span>
              <h3 className="font-bold text-lg text-[var(--foreground)] mb-2">2. استكشف المنتجات</h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                تصفح آلاف الإعلانات الحقيقية التي تلبي احتياجاتك ورغباتك اليومية.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[var(--primary)] group-hover:text-white transition-all shadow-sm">
                <MessageSquare className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-[var(--primary)] mb-1">الخطوة 3</span>
              <h3 className="font-bold text-lg text-[var(--foreground)] mb-2">3. تواصل وتفاوض</h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                تحدث مباشرة مع البائعين أو المشترين عبر الدردشة الفورية أو الواتساب.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[var(--primary)] group-hover:text-white transition-all shadow-sm">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-[var(--primary)] mb-1">الخطوة 4</span>
              <h3 className="font-bold text-lg text-[var(--foreground)] mb-2">4. إشترِ أو بعْ</h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                أنجز الصفقة بنجاح واستمتع بتجربة بيع وشراء سلسة ومريحة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: WHY SAFQA? / BENEFITS ────────────────────────────── */}
      <section id="features" className="py-20 bg-[var(--surface)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-3 border-[var(--primary)] text-[var(--primary)]">
            WHY SAFQA? • لماذا صفقة؟
          </Badge>
          <h2 className="heading-1 font-extrabold text-3xl sm:text-4xl text-[var(--foreground)] mb-3">
            تجربة سوق أفضل وأكثر كفاءة للجميع
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-xl mx-auto mb-14">
            صممنا المنصة لتوفر لك السرعة والأمان والتواصل المباشر بدون تعقيدات
          </p>

          {/* 5 Benefit Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="hover:border-[var(--primary)] transition-all hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[var(--foreground)] mb-2">آمن وموثوق</h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                  نحافظ على أمان تجاربك عبر آليات التحقق ومراقبة المحتوى.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-[var(--primary)] transition-all hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[var(--foreground)] mb-2">سريع وسهل</h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                  نشر الإعلانات والتواصل لا يستغرق سوى دقائق بضغطة زر.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-[var(--primary)] transition-all hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[var(--foreground)] mb-2">أشخاص حقيقيون</h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                  تواصل مباشر مع أعضاء حقيقيين في منطقتك ومجتمعك المحلي.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-[var(--primary)] transition-all hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4">
                  <Tag className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[var(--foreground)] mb-2">صفقات ممتازة</h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                  اعثر على أفضل السلع والمنتجات المستعملة بأفضل الأسعار.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-[var(--primary)] transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-4">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[var(--foreground)] mb-2">دعم متواصل</h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                  فريق الإدارة جاهز ومستعد للإجابة وحل أي استفسار دائماً.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: MARKETPLACE PREVIEW ───────────────────────────────── */}
      <section className="py-20 bg-[var(--card)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" className="mb-3">
            EXPLORE SAFQA • استكشف صفقة
          </Badge>
          <h2 className="heading-1 font-extrabold text-3xl sm:text-4xl text-[var(--foreground)] mb-3">
            المنتجات الأكثر طلباً الآن
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-xl mx-auto mb-14">
            تصفح عينة من أحدث الإعلانات المعروضة على منصة صفقة
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-right mb-10">
            {previewProducts.map((p) => (
              <Card key={p.id} className="overflow-hidden hover:border-[var(--primary)] transition-all h-full flex flex-col group">
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img src={p.media[0].url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded bg-black/60 text-white backdrop-blur-sm">
                    {p.category.name}
                  </span>
                  <button className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-rose-500">
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>
                <CardContent className="p-3.5 flex-1 flex flex-col justify-between">
                  <h4 className="font-bold text-xs text-[var(--foreground)] line-clamp-2 leading-snug group-hover:text-[var(--primary)] transition-colors mb-2">
                    {p.title}
                  </h4>
                  <p className="text-sm font-black text-[var(--primary)]">
                    {p.price.toLocaleString('ar-EG')} <span className="text-[10px] font-normal">ج.م</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Link href="/products">
            <Button size="lg" className="font-bold gap-2">
              عرض جميع الإعلانات في المتجر
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── SECTION 5: TRUST & SAFETY ────────────────────────────────────── */}
      <section id="safety" className="py-20 bg-[var(--surface)] transition-colors border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Security Badge Icon Container */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center border-4 border-[var(--primary)]/20 shadow-inner">
                <ShieldCheck className="w-20 h-20 sm:w-24 sm:h-24" />
                <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-md">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Text & Bullet Checks */}
            <div className="lg:col-span-8 text-right">
              <Badge variant="outline" className="mb-3 border-emerald-600 text-emerald-600">
                TRUST & SAFETY • الأمان والخصوصية
              </Badge>
              <h2 className="heading-1 font-extrabold text-2xl sm:text-3xl text-[var(--foreground)] mb-3">
                سلامتك وأمانك هي أولويتنا الأولى
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
                نمتلك أنظمة متكاملة ومراقبين لضمان بيئة تداول موثوقة وآمنة لجميع أعضاء مجتمع صفقة.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[var(--primary)] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-[var(--foreground)]">مستخدمون موثقون بحسابات حقيقية</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[var(--primary)] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-[var(--foreground)]">محادثات فورية وآمنة داخل المنصة</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[var(--primary)] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-[var(--foreground)]">نظام بلاغات فوري للتعامل مع المخالفات</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[var(--primary)] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-[var(--foreground)]">مراقبة دورية وحماية البيانات على مدار 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: FINAL CTA BANNER ─────────────────────────────────── */}
      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[var(--primary)] via-teal-800 to-emerald-900 text-white p-8 sm:p-14 text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="max-w-xl relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-snug mb-3">
                هل أنت جاهز لبدء رحلتك مع صفقة؟
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                انضم إلى مجتمع صفقة اليوم واكتشف طريقة أسهل وأسرع لبيع وشراء كل ما تحتاجه.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-white text-[var(--primary)] hover:bg-slate-100 font-extrabold text-sm px-6">
                  إنشاء حساب جديد
                </Button>
              </Link>

              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10 font-bold text-sm px-6 gap-1.5">
                  تسجيل الدخول
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Background Accent watermark */}
            <div className="absolute -right-10 -bottom-10 opacity-10 text-white font-black text-9xl pointer-events-none select-none">
              Safqa
            </div>
          </div>
        </div>
      </section>

      {/* ─── PUBLIC MARKETING FOOTER ────────────────────────────────────── */}
      <footer id="about" className="w-full border-t border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            {/* Brand Narrative */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-xl">
                  ص
                </div>
                <span className="font-extrabold text-2xl tracking-tight">صفقة.</span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed max-w-sm">
                صفقة هي مجتمع إلكتروني مفتوح يربط بين المشترين والبائعين بسهولة وأمان. هدفنا إتاحة أفضل العروض بدون عمولات وبأسرع طريقة ممكنة.
              </p>
            </div>

            {/* Links Column 1: Company */}
            <div>
              <h4 className="font-bold text-sm mb-4 text-[var(--foreground)]">الشركة</h4>
              <ul className="space-y-2.5 text-xs text-[var(--muted-foreground)] font-medium">
                <li><a href="#about" className="hover:text-[var(--primary)] transition-colors">عن المنصة</a></li>
                <li><a href="#how-it-works" className="hover:text-[var(--primary)] transition-colors">كيف يعمل صفقة</a></li>
                <li><a href="#features" className="hover:text-[var(--primary)] transition-colors">المميزات</a></li>
                <li><Link href="/products" className="hover:text-[var(--primary)] transition-colors">تصفح المتجر</Link></li>
              </ul>
            </div>

            {/* Links Column 2: Support */}
            <div>
              <h4 className="font-bold text-sm mb-4 text-[var(--foreground)]">الدعم والأمان</h4>
              <ul className="space-y-2.5 text-xs text-[var(--muted-foreground)] font-medium">
                <li><a href="#safety" className="hover:text-[var(--primary)] transition-colors">نصائح الأمان</a></li>
                <li><Link href="/reports/new" className="hover:text-[var(--primary)] transition-colors">تقديم بلاغ</Link></li>
                <li><span className="opacity-70">شروط الاستخدام</span></li>
                <li><span className="opacity-70">سياسة الخصوصية</span></li>
              </ul>
            </div>

            {/* Links Column 3: Follow Us */}
            <div>
              <h4 className="font-bold text-sm mb-4 text-[var(--foreground)]">تابعنا</h4>
              <div className="flex items-center gap-3 text-[var(--muted-foreground)] mb-4">
                <span className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center hover:text-[var(--primary)] hover:bg-[var(--card)] transition-all border border-[var(--border)] cursor-pointer">
                  <Globe className="w-4 h-4" />
                </span>
                <span className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center hover:text-[var(--primary)] hover:bg-[var(--card)] transition-all border border-[var(--border)] cursor-pointer">
                  <Share2 className="w-4 h-4" />
                </span>
                <span className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center hover:text-[var(--primary)] hover:bg-[var(--card)] transition-all border border-[var(--border)] cursor-pointer">
                  <Send className="w-4 h-4" />
                </span>
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)]">اللغة: العربية (مصر)</p>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted-foreground)] text-center sm:text-right">
            <p>جميع الحقوق محفوظة © {new Date().getFullYear()} منصة صفقة Safqa.</p>
            <p className="text-[11px]">صُنعت بالحُب لتوفير تجربة بيع وشراء استثنائية.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
