'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button, Input, Skeleton, useToast } from '@/components/ui';
import { useMyListings } from '../hooks/use-my-listings';
import { useMarkProductSold } from '../hooks/use-mark-product-sold';
import { useDeleteProduct } from '../hooks/use-delete-product';
import type { Product } from '../types/products.types';
import {
  Package,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Tag,
  Calendar,
  Layers,
  ShoppingBag,
  Archive,
  RefreshCw,
} from 'lucide-react';

type StatusFilter = 'ALL' | 'PUBLISHED' | 'SOLD' | 'ARCHIVED';

const STATUS_BADGES: Record<string, { label: string; classNames: string }> = {
  PUBLISHED: {
    label: 'معروض للبيع',
    classNames: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  SOLD: {
    label: 'تم البيع',
    classNames: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  ARCHIVED: {
    label: 'مؤرشف',
    classNames: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
  },
};

export function SellerWorkspace() {
  const { toast } = useToast();
  const { data: products = [], isLoading, isError, refetch } = useMyListings();
  const markSoldMutation = useMarkProductSold();
  const deleteMutation = useDeleteProduct();

  const [activeTab, setActiveTab] = useState<StatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // ── Metrics Calculation ──
  const counts = useMemo(() => {
    return {
      all: products.length,
      published: products.filter((p) => p.status === 'PUBLISHED').length,
      sold: products.filter((p) => p.status === 'SOLD').length,
      archived: products.filter((p) => p.status === 'ARCHIVED').length,
    };
  }, [products]);

  // ── Filtered Products ──
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesTab =
        activeTab === 'ALL' || product.status === activeTab;
      const matchesSearch =
        !searchQuery.trim() ||
        product.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [products, activeTab, searchQuery]);

  // ── Handlers ──
  const handleMarkAsSold = async (product: Product) => {
    try {
      await markSoldMutation.mutateAsync(product.id);
      toast({
        title: 'تم تحديث الإعلان! 🤝',
        description: `تم تحديد "${product.title}" كـ تم البيع بنجاح.`,
        type: 'success',
      });
    } catch (err: any) {
      toast({
        title: 'تعذر التحديث',
        description: err?.message || 'حدث خطأ أثناء تحديث حالة الإعلان.',
        type: 'error',
      });
    }
  };

  const handleConfirmArchive = async () => {
    if (!productToDelete) return;
    try {
      await deleteMutation.mutateAsync(productToDelete.id);
      toast({
        title: 'تم أرشفة الإعلان 📦',
        description: `تمت أرشفة "${productToDelete.title}" وإخفاؤه من السوق.`,
        type: 'info',
      });
      setProductToDelete(null);
    } catch (err: any) {
      toast({
        title: 'تعذر أرشفة الإعلان',
        description: err?.message || 'حدث خطأ أثناء أرشفة الإعلان.',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-8 dir-rtl">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
              إعلاناتي المعروضة
            </h1>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            مساحة البائع: متابعة وإدارة حالة وتفاصيل جميع إعلاناتك في منصة صفقة.
          </p>
        </div>

        <Link href="/products/create">
          <Button variant="primary" className="gap-2 font-bold shadow-sm h-11 px-5 text-xs">
            <Plus className="w-4 h-4" />
            نشر إعلان جديد
          </Button>
        </Link>
      </div>

      {/* ── Metrics Cards Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total */}
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm ring-1 ring-[var(--primary)]'
              : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--border)]/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--muted-foreground)]">إجمالي الإعلانات</span>
            <Layers className="w-4 h-4 text-[var(--primary)]" />
          </div>
          <p className="text-2xl font-black text-[var(--foreground)]">{counts.all}</p>
        </button>

        {/* Published */}
        <button
          type="button"
          onClick={() => setActiveTab('PUBLISHED')}
          className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
            activeTab === 'PUBLISHED'
              ? 'border-emerald-500 bg-emerald-500/5 shadow-sm ring-1 ring-emerald-500'
              : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--border)]/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--muted-foreground)]">معروضة حالياً</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{counts.published}</p>
        </button>

        {/* Sold */}
        <button
          type="button"
          onClick={() => setActiveTab('SOLD')}
          className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
            activeTab === 'SOLD'
              ? 'border-blue-500 bg-blue-500/5 shadow-sm ring-1 ring-blue-500'
              : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--border)]/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--muted-foreground)]">تم البيع</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-600">{counts.sold}</p>
        </button>

        {/* Archived */}
        <button
          type="button"
          onClick={() => setActiveTab('ARCHIVED')}
          className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
            activeTab === 'ARCHIVED'
              ? 'border-zinc-500 bg-zinc-500/5 shadow-sm ring-1 ring-zinc-500'
              : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--border)]/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--muted-foreground)]">مؤرشفة</span>
            <Archive className="w-4 h-4 text-zinc-500" />
          </div>
          <p className="text-2xl font-black text-zinc-500">{counts.archived}</p>
        </button>
      </div>

      {/* ── Filters & Search Toolbar ── */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'الكل', count: counts.all },
            { id: 'PUBLISHED', label: 'المعروضة', count: counts.published },
            { id: 'SOLD', label: 'المباعة', count: counts.sold },
            { id: 'ARCHIVED', label: 'المؤرشفة', count: counts.archived },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as StatusFilter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs border border-[var(--border)]'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في إعلاناتك..."
            className="text-xs pl-8 pr-3 h-9"
          />
          <Search className="w-3.5 h-3.5 text-[var(--muted-foreground)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* ── Listings State / Content ── */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-48 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Skeleton className="h-9 w-20 rounded-xl" />
                <Skeleton className="h-9 w-20 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 space-y-4">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-base font-bold text-[var(--foreground)]">تعذر تحميل الإعلانات</h2>
          <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
            حدث خطأ أثناء جلب قائمة الإعلانات من الخادم. يرجى التحقق من الاتصال والمحاولة مرة أخرى.
          </p>
          <Button variant="outline" onClick={() => refetch()} className="gap-2 text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            إعادة المحاولة
          </Button>
        </div>
      ) : products.length === 0 ? (
        /* Global Empty State */
        <div className="text-center py-16 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mx-auto mb-2">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-[var(--foreground)]">لم تقم بنشر أي إعلانات بعد</h2>
          <p className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto leading-relaxed">
            ابدأ بعرض منتجاتك وسلعك المستعملة أو الجديدة لآلاف المشترين في منصة صفقة مجاناً وبكل سهولة.
          </p>
          <div className="pt-2">
            <Link href="/products/create">
              <Button variant="primary" className="gap-2 text-xs font-bold px-6 shadow-sm">
                <Plus className="w-4 h-4" />
                نشر أول إعلان لك الآن
              </Button>
            </Link>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Filtered Empty State */
        <div className="text-center py-12 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 space-y-3">
          <Search className="w-8 h-8 text-[var(--muted-foreground)]/50 mx-auto" />
          <h3 className="text-sm font-bold text-[var(--foreground)]">لا توجد إعلانات مطابقة</h3>
          <p className="text-xs text-[var(--muted-foreground)]">
            لم نجد أي إعلانات تطابق الفلتر أو كلمة البحث المحددة.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveTab('ALL');
              setSearchQuery('');
            }}
            className="text-xs mt-2"
          >
            عرض جميع الإعلانات
          </Button>
        </div>
      ) : (
        /* Products List */
        <div className="space-y-3.5">
          {filteredProducts.map((product) => {
            const mediaUrl =
              product.media && product.media.length > 0
                ? (product.media[0] as any).url || (product.media[0] as any).file_url
                : null;
            const statusConfig = STATUS_BADGES[product.status] || STATUS_BADGES.PUBLISHED;
            const createdDate = new Date(product.created_at).toLocaleDateString('ar-EG', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={product.id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm hover:border-[var(--primary)]/30 transition-all"
              >
                {/* ── Product Info ── */}
                <div className="flex items-start sm:items-center gap-4 w-full lg:w-auto">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[var(--muted)] overflow-hidden shrink-0 flex items-center justify-center border border-[var(--border)]">
                    {mediaUrl ? (
                      <img
                        src={mediaUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-[var(--muted-foreground)]/50" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${statusConfig.classNames}`}
                      >
                        {statusConfig.label}
                      </span>
                      {product.category && (
                        <span className="text-[10px] font-medium text-[var(--muted-foreground)] flex items-center gap-1 bg-[var(--surface)] px-2 py-0.5 rounded-md border border-[var(--border)]">
                          <Tag className="w-3 h-3 text-[var(--primary)]" />
                          {product.category.name}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-[var(--foreground)] line-clamp-1">
                      {product.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs">
                      <p className="font-black text-sm text-[var(--primary)]">
                        {product.price.toLocaleString('ar-EG')}{' '}
                        <span className="text-[10px] font-normal text-[var(--foreground)]">ج.م</span>
                      </p>
                      <span className="text-[var(--border)]">•</span>
                      <span className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {createdDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Action Buttons ── */}
                <div className="flex items-center gap-2 self-end lg:self-center w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-[var(--border)]/60">
                  {/* View Details */}
                  <Link href={`/products/${product.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs h-9 px-3"
                      title="معاينة الإعلان كما يظهر للجميع"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                      <span>معاينة</span>
                    </Button>
                  </Link>

                  {/* Edit */}
                  {product.status !== 'ARCHIVED' && (
                    <Link href={`/products/${product.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs h-9 px-3 border-[var(--primary)]/30 text-[var(--primary)] hover:bg-[var(--primary)]/10"
                        title="تعديل بيانات الإعلان"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </Button>
                    </Link>
                  )}

                  {/* Mark as Sold */}
                  {product.status === 'PUBLISHED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsSold(product)}
                      disabled={markSoldMutation.isPending}
                      className="gap-1.5 text-xs h-9 px-3 border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
                      title="تحديد الإعلان كـ مباع"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>تم البيع</span>
                    </Button>
                  )}

                  {/* Archive / Delete */}
                  {product.status !== 'ARCHIVED' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setProductToDelete(product)}
                      disabled={deleteMutation.isPending}
                      className="gap-1.5 text-xs h-9 px-3 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                      title="أرشفة وحذف الإعلان"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>أرشفة</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Confirmation Modal for Archiving (Delete) ── */}
      {productToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs dir-rtl"
        >
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 max-w-md w-full shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">
                  أرشفة الإعلان؟
                </h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  سيتم إخفاء هذا الإعلان من نتائج البحث والسوق.
                </p>
              </div>
            </div>

            <div className="bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)] text-xs text-[var(--foreground)]">
              <span className="text-[var(--muted-foreground)] block text-[10px] mb-0.5">الإعلان المراد أرشفته:</span>
              <p className="font-bold line-clamp-1">{productToDelete.title}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProductToDelete(null)}
                disabled={deleteMutation.isPending}
                className="text-xs h-9 px-4"
              >
                إلغاء
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmArchive}
                disabled={deleteMutation.isPending}
                className="text-xs h-9 px-4 gap-1.5 font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {deleteMutation.isPending ? 'جاري الأرشفة...' : 'تأكيد الأرشفة'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
