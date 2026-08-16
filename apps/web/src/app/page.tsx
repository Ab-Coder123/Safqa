'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '../components/theme-provider';
import {
  ShieldCheck, Zap, Users, Tag, Headphones,
  UserPlus, Search, MessageSquare, ShoppingBag,
  ArrowLeft, Sun, Moon, Heart, Lock,
  CheckCircle2, Share2, Globe, Send,
} from 'lucide-react';

/* ──────────────────────────────────────────
   Static preview dataset — matches Product
   shape without creating new types
────────────────────────────────────────── */
const PREVIEW_PRODUCTS = [
  {
    id: 'prev-1',
    title: 'تويوتا كورولا 2020',
    price: 720000,
    category: 'سيارات',
    img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&auto=format&fit=crop',
  },
  {
    id: 'prev-2',
    title: 'ماك بوك اير M2',
    price: 28500,
    category: 'إلكترونيات',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop',
  },
  {
    id: 'prev-3',
    title: 'أريكة مودرن رمادية',
    price: 4200,
    category: 'أثاث ومنزل',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop',
  },
  {
    id: 'prev-4',
    title: 'ساعة كاسيو أصلية',
    price: 1250,
    category: 'ساعات وأزياء',
    img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&auto=format&fit=crop',
  },
  {
    id: 'prev-5',
    title: 'كرسي مكتب طبي',
    price: 2800,
    category: 'أثاث ومنزل',
    img: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=400&auto=format&fit=crop',
  },
];

const HOW_IT_WORKS = [
  { icon: <UserPlus size={28} />, step: '١', title: 'أنشئ حسابك', desc: 'سجل مجاناً في أقل من دقيقة وانضم لمجتمع صفقة.' },
  { icon: <Search size={28} />, step: '٢', title: 'استكشف المنتجات', desc: 'تصفح آلاف الإعلانات الحقيقية التي تلبي احتياجاتك.' },
  { icon: <MessageSquare size={28} />, step: '٣', title: 'تواصل وتفاوض', desc: 'تحدث مباشرة مع البائعين أو المشترين بكل سهولة.' },
  { icon: <ShoppingBag size={28} />, step: '٤', title: 'إشترِ أو بعْ', desc: 'أنجز الصفقة بنجاح واستمتع بتجربة بيع وشراء سلسة.' },
];

const FEATURES = [
  { icon: <ShieldCheck size={24} />, color: '#16a34a', bg: '#f0fdf4', title: 'آمن وموثوق', desc: 'نحافظ على أمان تجاربك عبر آليات التحقق ومراقبة المحتوى.' },
  { icon: <Zap size={24} />, color: '#d97706', bg: '#fffbeb', title: 'سريع وسهل', desc: 'نشر الإعلانات والتواصل لا يستغرق سوى دقائق بضغطة زر.' },
  { icon: <Users size={24} />, color: '#4f46e5', bg: '#eef2ff', title: 'أشخاص حقيقيون', desc: 'تواصل مباشر مع أعضاء حقيقيين في منطقتك ومجتمعك المحلي.' },
  { icon: <Tag size={24} />, color: '#dc2626', bg: '#fef2f2', title: 'صفقات ممتازة', desc: 'اعثر على أفضل السلع بأفضل الأسعار بدون عمولات.' },
  { icon: <Headphones size={24} />, color: '#0284c7', bg: '#f0f9ff', title: 'دعم متواصل', desc: 'فريق الإدارة جاهز ومستعد للإجابة على أي استفسار دائماً.' },
];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();

  const s = {
    // Layout helpers
    maxW: { maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' } as React.CSSProperties,
    flex: (gap = '0') => ({ display: 'flex', gap, alignItems: 'center' } as React.CSSProperties),
    grid: (cols: string, gap = '1.5rem') => ({ display: 'grid', gridTemplateColumns: cols, gap } as React.CSSProperties),
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--foreground)', direction: 'rtl' }}>

      {/* ══════════════════════════════════
          PUBLIC HEADER
      ══════════════════════════════════ */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border)', backgroundColor: 'var(--card)', backdropFilter: 'blur(12px)' }}>
        <div style={{ ...s.maxW, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', boxShadow: 'var(--shadow-md)' }}>
              ص
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--foreground)' }}>
              صفقة<span style={{ color: 'var(--primary)' }}>.</span>
            </span>
          </Link>

          {/* Nav Links - hidden on mobile */}
          <nav style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
            {[
              { href: '/', label: 'الرئيسية', active: true },
              { href: '#how-it-works', label: 'كيف يعمل', active: false },
              { href: '#features', label: 'المميزات', active: false },
              { href: '/categories', label: 'التصنيفات', active: false },
              { href: '#safety', label: 'الأمان', active: false },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: item.active ? 700 : 500,
                  color: item.active ? 'var(--primary)' : 'var(--muted-foreground)',
                  textDecoration: item.active ? 'underline' : 'none',
                  textUnderlineOffset: '4px',
                  transition: 'color var(--transition-fast)',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="تبديل المظهر"
              style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', transition: 'all var(--transition-fast)' }}
            >
              {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} />}
            </button>

            <Link href="/login" style={{ padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', textDecoration: 'none', border: '1px solid var(--border)', transition: 'background var(--transition-fast)' }}>
              تسجيل الدخول
            </Link>

            <Link href="/register" style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: 'var(--shadow-md)', transition: 'background var(--transition-fast)' }}>
              ابدأ الآن
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════
          HERO SECTION
      ══════════════════════════════════ */}
      <section style={{ padding: '5rem 0 4rem', backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ ...s.maxW, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          {/* Copy */}
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.15, color: 'var(--foreground)', marginBottom: '1.25rem' }}>
              إشترِ. بعْ.<br />
              <span style={{ color: 'var(--primary)' }}>تواصل بسهولة.</span>
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--muted-foreground)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '480px' }}>
              صفقة هي المنصة الحديثة التي تسهل عليك البيع والشراء والتواصل المباشر مع الأشخاص من حولك بمنتهى السهولة والأمان بدون أي عمولات.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <Link href="/register" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', borderRadius: '12px', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', fontWeight: 800, fontSize: '1rem', textDecoration: 'none', boxShadow: 'var(--shadow-md)' }}>
                ابدأ الآن
                <ArrowLeft size={18} />
              </Link>

              <Link href="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', borderRadius: '12px', border: '2px solid var(--border)', color: 'var(--foreground)', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', backgroundColor: 'var(--card)' }}>
                استكشف صفقة
              </Link>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              {[
                { icon: <ShieldCheck size={16} color="var(--primary)" />, title: 'آمن ومضمون', sub: 'سلامتك هي أولويتنا' },
                { icon: <Zap size={16} color="var(--primary)" />, title: 'سهل الاستخدام', sub: 'تجربة بسيطة وسريعة' },
                { icon: <Users size={16} color="var(--primary)" />, title: 'موثوق للمجتمع', sub: 'آلاف الأعضاء السعداء' },
              ].map((b) => (
                <div key={b.title}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.78rem', color: 'var(--foreground)', marginBottom: '0.2rem' }}>
                    {b.icon} {b.title}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>{b.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phone Mockup */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', width: '280px', height: '280px', borderRadius: '50%', background: 'var(--primary)', opacity: 0.08, filter: 'blur(60px)', zIndex: 0 }} />

            <div style={{ position: 'relative', width: '280px', borderRadius: '36px', border: '8px solid var(--border)', backgroundColor: 'var(--card)', padding: '12px', boxShadow: 'var(--shadow-lg)', zIndex: 1, transform: 'rotate(-2deg)' }}>
              {/* Notch */}
              <div style={{ width: '100px', height: '14px', backgroundColor: 'var(--foreground)', opacity: 0.8, borderRadius: '0 0 10px 10px', margin: '0 auto 12px' }} />

              {/* App header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingInline: '6px', marginBottom: '10px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)' }}>صفقة</span>
                <Search size={14} color="var(--muted-foreground)" />
              </div>

              {/* Banner */}
              <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), #065f46)', color: '#fff', marginBottom: '10px' }}>
                <p style={{ fontSize: '0.6rem', opacity: 0.8, marginBottom: '2px' }}>عروض بالقرب منك</p>
                <p style={{ fontSize: '0.72rem', fontWeight: 700 }}>اعثر على أفضل الصفقات اليوم</p>
              </div>

              {/* Categories */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '10px' }}>
                {['🚗 سيارات', '📱 إلكترو.', '🛋️ أثاث', '👕 أزياء'].map(c => (
                  <div key={c} style={{ padding: '5px 2px', borderRadius: '8px', backgroundColor: 'var(--surface)', textAlign: 'center', fontSize: '0.5rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>{c}</div>
                ))}
              </div>

              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--foreground)', paddingInline: '4px', marginBottom: '6px' }}>إعلانات مميزة</p>

              {/* Mini Product Cards */}
              {[
                { img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&auto=format&fit=crop', title: 'أريكة مودرن', price: '3,250 ج.م' },
                { img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&auto=format&fit=crop', title: 'آيفون 14 Pro Max', price: '32,000 ج.م' },
              ].map(p => (
                <div key={p.title} style={{ display: 'flex', gap: '8px', padding: '7px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', marginBottom: '6px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--muted)' }}>
                    <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '2px' }}>{p.title}</p>
                    <p style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--primary)' }}>{p.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating card top right */}
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 12px', borderRadius: '16px', backgroundColor: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', maxWidth: '180px', zIndex: 2 }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--muted)' }}>
                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&auto=format&fit=crop" alt="sofa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--foreground)' }}>أريكة مودرن</p>
                <p style={{ fontSize: '0.6rem', color: 'var(--muted-foreground)' }}>أثاث ومنزل</p>
                <p style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)' }}>3,250 ج.م</p>
              </div>
            </div>

            {/* Floating card bottom left */}
            <div style={{ position: 'absolute', bottom: '-20px', left: '-10px', display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 12px', borderRadius: '16px', backgroundColor: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', maxWidth: '195px', zIndex: 2 }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--muted)' }}>
                <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&auto=format&fit=crop" alt="phone" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--foreground)' }}>آيفون 14 Pro Max</p>
                <p style={{ fontSize: '0.6rem', color: 'var(--muted-foreground)' }}>إلكترونيات</p>
                <p style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)' }}>32,000 ج.م</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: '5rem 0', backgroundColor: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ ...s.maxW, textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>HOW IT WORKS</p>
          <h2 className="heading-1" style={{ color: 'var(--foreground)', marginBottom: '0.75rem' }}>البيع والشراء بأسلوب بسيط ومباشر</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--muted-foreground)', marginBottom: '3.5rem', maxWidth: '480px', margin: '0 auto 3.5rem' }}>
            ابدأ رحلتك في خطوات معدودة وسريعة للانضمام لأسهل سوق في مصر
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'var(--accent)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem' }}>الخطوة {item.step}</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.6rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FEATURES / WHY SAFQA
      ══════════════════════════════════ */}
      <section id="features" style={{ padding: '5rem 0', backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ ...s.maxW, textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>WHY SAFQA?</p>
          <h2 className="heading-1" style={{ color: 'var(--foreground)', marginBottom: '0.75rem' }}>تجربة سوق أفضل وأكثر كفاءة للجميع</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--muted-foreground)', marginBottom: '3.5rem', maxWidth: '480px', margin: '0 auto 3.5rem' }}>
            صممنا المنصة لتوفر لك السرعة والأمان والتواصل المباشر بدون تعقيدات
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.75rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: 'var(--shadow-sm)', transition: 'box-shadow var(--transition-fast)' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: f.bg, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          MARKETPLACE PREVIEW
      ══════════════════════════════════ */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ ...s.maxW, textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>EXPLORE SAFQA</p>
          <h2 className="heading-1" style={{ color: 'var(--foreground)', marginBottom: '0.75rem' }}>المنتجات الأكثر طلباً الآن</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--muted-foreground)', marginBottom: '3rem', maxWidth: '480px', margin: '0 auto 3rem' }}>
            تصفح عينة من أحدث الإعلانات المعروضة على منصة صفقة
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem', textAlign: 'right' }}>
            {PREVIEW_PRODUCTS.map((p) => (
              <div key={p.id} style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', transition: 'box-shadow var(--transition-fast)' }}>
                {/* Image */}
                <div style={{ position: 'relative', aspectRatio: '4/3', backgroundColor: 'var(--muted)' }}>
                  <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
                    {p.category}
                  </span>
                  <button style={{ position: 'absolute', top: '8px', left: '8px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.85)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <Heart size={13} color="#9ca3af" />
                  </button>
                </div>
                {/* Info */}
                <div style={{ padding: '0.85rem' }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.4rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.title}</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--primary)' }}>
                    {p.price.toLocaleString('ar-EG')} <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>ج.م</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', borderRadius: '12px', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', fontWeight: 700, textDecoration: 'none', boxShadow: 'var(--shadow-md)', fontSize: '0.95rem' }}>
            عرض جميع الإعلانات في المتجر
            <ArrowLeft size={16} />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════
          TRUST & SAFETY
      ══════════════════════════════════ */}
      <section id="safety" style={{ padding: '5rem 0', backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ ...s.maxW }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center', backgroundColor: 'var(--card)', borderRadius: '24px', border: '1px solid var(--border)', padding: '3rem 2.5rem', boxShadow: 'var(--shadow-md)' }}>
            {/* Icon Section */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '140px', height: '140px', borderRadius: '50%', backgroundColor: 'var(--accent)', border: '4px solid var(--primary)', opacity: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)' }}>
                <ShieldCheck size={70} color="var(--primary)" />
                <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
                  <Lock size={17} color="var(--primary-foreground)" />
                </div>
              </div>
            </div>

            {/* Text */}
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>TRUST & SAFETY</p>
              <h2 className="heading-2" style={{ color: 'var(--foreground)', marginBottom: '0.75rem' }}>سلامتك وأمانك هي أولويتنا الأولى</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                نمتلك أنظمة متكاملة ومراقبين لضمان بيئة تداول موثوقة وآمنة لجميع أعضاء مجتمع صفقة.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                {[
                  'مستخدمون موثقون بحسابات حقيقية',
                  'محادثات فورية وآمنة داخل المنصة',
                  'نظام بلاغات فوري لمعالجة المخالفات',
                  'مراقبة دورية وحماية البيانات 24/7',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FINAL CTA BANNER
      ══════════════════════════════════ */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--background)' }}>
        <div style={{ ...s.maxW }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, var(--primary), #065f46)', padding: '3rem 2.5rem', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', fontSize: '120px', fontWeight: 900, color: 'rgba(255,255,255,0.07)', pointerEvents: 'none', userSelect: 'none', lineHeight: 1 }}>
              Safqa
            </div>

            <div style={{ maxWidth: '520px', position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', marginBottom: '0.6rem', lineHeight: 1.3 }}>
                هل أنت جاهز لبدء رحلتك مع صفقة؟
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
                انضم إلى مجتمع صفقة اليوم واكتشف طريقة أسهل وأسرع لبيع وشراء كل ما تحتاجه.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', position: 'relative', zIndex: 1 }}>
              <Link href="/register" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.75rem', borderRadius: '12px', backgroundColor: '#fff', color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none', boxShadow: 'var(--shadow-md)' }}>
                إنشاء حساب جديد
              </Link>

              <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.75rem', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.6)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
                تسجيل الدخول
                <ArrowLeft size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FOOTER
      ══════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '4rem 0 2rem' }}>
        <div style={{ ...s.maxW }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
            {/* Brand */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>ص</div>
                <span style={{ fontWeight: 800, fontSize: '1.3rem' }}>صفقة.</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', lineHeight: 1.7, maxWidth: '260px' }}>
                صفقة هي مجتمع إلكتروني مفتوح يربط بين المشترين والبائعين بسهولة وأمان بدون عمولات.
              </p>
            </div>

            {/* Links: Company */}
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)', marginBottom: '1rem' }}>الشركة</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[{ href: '#', label: 'عن المنصة' }, { href: '#how-it-works', label: 'كيف يعمل صفقة' }, { href: '#features', label: 'المميزات' }, { href: '/products', label: 'تصفح المتجر' }].map(l => (
                  <li key={l.label}><a href={l.href} style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', textDecoration: 'none', fontWeight: 500 }}>{l.label}</a></li>
                ))}
              </ul>
            </div>

            {/* Links: Support */}
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)', marginBottom: '1rem' }}>الدعم</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[{ href: '#safety', label: 'نصائح الأمان' }, { href: '/reports/new', label: 'تقديم بلاغ' }, { href: '#', label: 'شروط الاستخدام' }, { href: '#', label: 'سياسة الخصوصية' }].map(l => (
                  <li key={l.label}><a href={l.href} style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', textDecoration: 'none', fontWeight: 500 }}>{l.label}</a></li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)', marginBottom: '1rem' }}>تابعنا</h4>
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
                {[<Globe size={16} key="g" />, <Share2 size={16} key="s" />, <Send size={16} key="send" />].map((icon, i) => (
                  <span key={i} style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
                    {icon}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)' }}>اللغة: العربية (مصر)</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>جميع الحقوق محفوظة © {new Date().getFullYear()} منصة صفقة Safqa.</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>صُنعت بالحُب لتوفير تجربة بيع وشراء استثنائية.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
