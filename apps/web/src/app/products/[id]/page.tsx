'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useProduct } from '@/features/products/hooks/use-product';
import { useToggleFavorite } from '@/features/favorites/hooks/use-toggle-favorite';
import {
  ProductGallery,
  ProductSellerCard,
  ProductDetailSkeleton,
} from '@/features/products/components';
import { ReportModal } from '@/features/reports/components/report-modal';
import { Button, useToast } from '@/components/ui';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import {
  Heart,
  Share2,
  AlertCircle,
  ShieldAlert,
  ChevronLeft,
  Calendar,
  Tag,
  ArrowRight,
  ShieldCheck,
  Edit3,
} from 'lucide-react';
import { tokenStorage } from '@/lib/api';
import { UserRole } from '@safqa/types';

const CONDITION_MAP: Record<string, { label: string; color: string }> = {
  NEW: { label: 'جديد بالكامل', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
  REFURBISHED: { label: 'مجدد معتمد', color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' },
  LIKE_NEW: { label: 'شبه جديد (كالجديد)', color: 'bg-teal-500/10 text-teal-700 dark:text-teal-400' },
  USED: { label: 'مستعمل', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  USED_GOOD: { label: 'مستعمل بحالة جيدة', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  USED_FAIR: { label: 'مستعمل بحالة مقبولة', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const { data: currentUser } = useCurrentUser();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { data: product, isLoading: loading, isError, error, refetch } = useProduct(params.id);
  const toggleFavoriteMutation = useToggleFavorite();

  const handleFavoriteClick = async () => {
    if (!tokenStorage.hasToken()) {
      toast({
        title: 'تسجيل الدخول مطلوب',
        description: 'يرجى تسجيل الدخول لتتمكن من حفظ الإعلانات في قائمتك المفضلة.',
        type: 'error',
      });
      return;
    }

    if (!product) return;

    try {
      await toggleFavoriteMutation.mutateAsync(product.id);
      toast({
        title: product.is_favorited ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة للمفضلة',
        description: product.title,
        type: 'success',
      });
    } catch (err: any) {
      toast({
        title: 'تعذر تحديث المفضلة',
        description: err?.message || 'حدث خطأ غير متوقع.',
        type: 'error',
      });
    }
  };

  const handleShare = () => {
    if (navigator.share && product) {
      navigator
        .share({
          title: product.title,
          text: `شاهد هذا الإعلان على صفقة: ${product.title}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'تم نسخ رابط الإعلان',
        description: 'يمكنك الآن مشاركة الرابط مع أصدقائك.',
        type: 'success',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)] dir-rtl">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductDetailSkeleton />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)] dir-rtl">
        <Header />
        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-16 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--foreground)]">الإعلان غير متاح</h2>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            {(error as any)?.message || 'ربما تم حذف هذا الإعلان، أو تم بيعه، أو أن الرابط غير صحيح.'}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link href="/products">
              <Button variant="primary" className="gap-2">
                <ArrowRight className="w-4 h-4" />
                تصفح سوق الإعلانات
              </Button>
            </Link>
            <Button variant="outline" onClick={() => refetch()}>
              إعادة المحاولة
            </Button>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  const conditionInfo = CONDITION_MAP[product.condition] || {
    label: product.condition,
    color: 'bg-[var(--muted)] text-[var(--muted-foreground)]',
  };

  const publishDate = new Date(product.created_at).toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const isSold = product.status === 'SOLD';
  const isArchived = product.status === 'ARCHIVED';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] dir-rtl">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ── Breadcrumbs ── */}
        <nav className="mb-6 text-xs text-[var(--muted-foreground)] flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-[var(--primary)] transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-[var(--muted-foreground)]/60" />
          <Link href="/products" className="hover:text-[var(--primary)] transition-colors">
            السوق
          </Link>
          {product.category && (
            <>
              <ChevronLeft className="w-3.5 h-3.5 text-[var(--muted-foreground)]/60" />
              <Link
                href={`/products?category_id=${product.category.id}`}
                className="hover:text-[var(--primary)] transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronLeft className="w-3.5 h-3.5 text-[var(--muted-foreground)]/60" />
          <span className="text-[var(--foreground)] font-semibold truncate max-w-[200px] sm:max-w-xs">
            {product.title}
          </span>
        </nav>

        {/* ── 2-Column Split Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ── LEFT (MAIN): Gallery, Specs & Description ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <ProductGallery media={product.media} title={product.title} status={product.status} />

            {/* Title & Meta */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${conditionInfo.color}`}>
                  {conditionInfo.label}
                </span>

                {product.category && (
                  <span className="bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[var(--primary)]" />
                    {product.category.name}
                  </span>
                )}

                <span className="text-[11px] text-[var(--muted-foreground)] mr-auto flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  نُشر في {publishDate}
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold text-[var(--foreground)] leading-snug">
                {product.title}
              </h1>

              {/* Price on Mobile / In-card summary */}
              <div className="pt-2 border-t border-[var(--border)]/60 lg:hidden flex items-center justify-between">
                <div>
                  <span className="text-xs text-[var(--muted-foreground)]">السعر المطلوب:</span>
                  <p className="text-2xl font-black text-[var(--primary)]">
                    {product.price.toLocaleString('ar-EG')}{' '}
                    <span className="text-xs font-normal text-[var(--foreground)]">ج.م</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Description Block */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                <span>📝</span>
                تفاصيل ووصف الإعلان
              </h2>
              <div className="text-sm text-[var(--foreground)]/90 leading-relaxed whitespace-pre-wrap font-normal">
                {product.description || 'لم يقم البائع بإضافة وصف تفصيلي لهذا الإعلان.'}
              </div>
            </div>

            {/* Safe Trading Banner */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-start gap-3.5 text-xs text-[var(--foreground)] leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-emerald-800 dark:text-emerald-400">
                  نصائح صفقة للشراء الآمن
                </p>
                <p className="text-[var(--muted-foreground)]">
                  قابل البائع في أماكن عامة وافحص السلعة جيداً قبل الشراء. لا تقم بتحويل أي مبالغ
                  مالية مسبقاً قبل استلام السلعة والتأكد من مطابقتها للمواصفات.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT (SIDEBAR): Price, Actions & Seller Card ── */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Price & Quick Actions Card */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-5">
              <div>
                <span className="text-xs font-semibold text-[var(--muted-foreground)]">
                  السعر المطلوب
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-[var(--primary)] tracking-tight">
                    {product.price.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-sm font-bold text-[var(--foreground)]">جنيه مصري</span>
                </div>
              </div>

              {/* Action Toolbar (Favorite / Share / Report) */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--border)]/60">
                <Button
                  variant={product.is_favorited ? 'primary' : 'outline'}
                  size="sm"
                  onClick={handleFavoriteClick}
                  disabled={toggleFavoriteMutation.isPending}
                  className="gap-1.5 text-xs h-9 px-2"
                  title={product.is_favorited ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      product.is_favorited ? 'fill-current text-white' : 'text-rose-500'
                    }`}
                  />
                  <span>{product.is_favorited ? 'محفوظ' : 'حفظ'}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-1.5 text-xs h-9 px-2"
                  title="مشاركة الإعلان"
                >
                  <Share2 className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                  <span>مشاركة</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReportModalOpen(true)}
                  className="gap-1.5 text-xs h-9 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                  title="إبلاغ عن إعلان مخالف"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>إبلاغ</span>
                </Button>
              </div>

              {/* Owner / Admin Edit Action */}
              {currentUser?.user && (currentUser.user.id === product.user_id || currentUser.user.id === product.user?.id || currentUser.user.role === UserRole.SUPER_ADMIN) && (
                <div className="pt-2 border-t border-[var(--border)]/60">
                  <Link href={`/products/${product.id}/edit`} className="block w-full">
                    <Button variant="outline" size="sm" className="w-full gap-2 text-xs h-9 font-bold border-[var(--primary)]/30 text-[var(--primary)] hover:bg-[var(--primary)]/10">
                      <Edit3 className="w-3.5 h-3.5" />
                      تعديل بيانات الإعلان
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Seller Contact Card */}
            <ProductSellerCard
              user={product.user}
              productId={product.id}
              productTitle={product.title}
              whatsappNumber={(product as any).whatsapp_number}
              isSold={isSold || isArchived}
            />
          </div>
        </div>

        {/* ── Report Modal ── */}
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          targetId={product.id}
          targetTitle={product.title}
        />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
