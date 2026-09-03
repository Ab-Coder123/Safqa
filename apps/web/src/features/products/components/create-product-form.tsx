'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Alert, useToast } from '@/components/ui';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { useCreateProduct } from '@/features/products/hooks/use-create-product';
import { useUpdateProduct } from '@/features/products/hooks/use-update-product';
import { ProductImageUploader } from './product-image-uploader';
import type { Product } from '../types/products.types';
import {
  Tag,
  Phone,
  FileText,
  Sparkles,
  Info,
  Loader2,
  Save,
} from 'lucide-react';

const CONDITIONS = [
  { value: 'NEW', label: 'جديد بالكامل', desc: 'لم يُفتح أو يُستخدم من قبل' },
  { value: 'USED', label: 'مستعمل', desc: 'مستعمل بحالة جيدة وصالح للاستخدام' },
  { value: 'REFURBISHED', label: 'مجدد معتمد', desc: 'تمت صيانته وفحصه ليعمل كالجديد' },
] as const;

export interface ProductFormProps {
  mode?: 'create' | 'edit';
  initialData?: Product;
}

export function ProductForm({ mode = 'create', initialData }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct(initialData?.id || '');

  const isEdit = mode === 'edit' && Boolean(initialData);

  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price ? String(initialData.price) : '',
    condition: (initialData?.condition as 'NEW' | 'USED' | 'REFURBISHED') || 'USED',
    category_id: initialData?.category_id || initialData?.category?.id || '',
    whatsapp_number: (initialData as any)?.whatsapp_number || initialData?.user?.phone_number || '',
  });

  const [mediaUrls, setMediaUrls] = useState<string[]>(
    initialData?.media && initialData.media.length > 0
      ? initialData.media.map((m) => m.url)
      : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop']
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price ? String(initialData.price) : '',
        condition: (initialData.condition as 'NEW' | 'USED' | 'REFURBISHED') || 'USED',
        category_id: initialData.category_id || initialData.category?.id || '',
        whatsapp_number: (initialData as any).whatsapp_number || initialData.user?.phone_number || '',
      });
      if (initialData.media && initialData.media.length > 0) {
        setMediaUrls(initialData.media.map((m) => m.url));
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const validateForm = (): string | null => {
    if (form.title.trim().length < 5) {
      return 'عنوان الإعلان يجب أن يحتوي على 5 أحرف على الأقل.';
    }
    if (form.description.trim().length < 20) {
      return 'الوصف يجب ألا يقل عن 20 حرفاً لتوضيح مواصفات السلعة.';
    }
    const numPrice = Number(form.price);
    if (!form.price || isNaN(numPrice) || numPrice <= 0) {
      return 'يرجى إدخال سعر صحيح أكبر من الصفر.';
    }
    if (!form.category_id) {
      return 'يرجى اختيار القسم المناسب للإعلان.';
    }
    const cleanPhone = form.whatsapp_number.trim();
    if (!/^(010|011|012|015)\d{8}$/.test(cleanPhone)) {
      return 'رقم الواتساب يجب أن يكون رقماً مصرياً صحيحاً مكوناً من 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015.';
    }
    if (mediaUrls.length === 0) {
      return 'يجب إضافة صورة واحدة على الأقل للمنتج.';
    }
    if (mediaUrls.length > 5) {
      return 'الحد الأقصى لعدد الصور هو 5 صور.';
    }
    return null;
  };

  const isSubmitting = createProductMutation.isPending || updateProductMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      if (typeof window !== 'undefined' && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    try {
      if (isEdit && initialData) {
        await updateProductMutation.mutateAsync({
          title: form.title.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          condition: form.condition,
          category_id: form.category_id,
          whatsapp_number: form.whatsapp_number.trim(),
          media_urls: mediaUrls,
        });

        toast({
          title: 'تم تحديث الإعلان بنجاح! ✅',
          description: 'جاري نقلك لصفحة الإعلان...',
          type: 'success',
        });

        router.push(`/products/${initialData.id}`);
      } else {
        const product = await createProductMutation.mutateAsync({
          title: form.title.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          condition: form.condition,
          category_id: form.category_id,
          whatsapp_number: form.whatsapp_number.trim(),
          media_urls: mediaUrls,
        });

        toast({
          title: 'تم نشر إعلانك بنجاح! 🎉',
          description: 'جاري نقلك لصفحة الإعلان...',
          type: 'success',
        });

        router.push(`/products/${product.id}`);
      }
    } catch (err: any) {
      const msg =
        err?.message ||
        (err?.response?.data?.message
          ? Array.isArray(err.response.data.message)
            ? err.response.data.message.join('، ')
            : err.response.data.message
          : 'حدث خطأ أثناء حفظ الإعلان. يرجى مراجعة البيانات والمحاولة مجدداً.');
      setError(msg);
      if (typeof window !== 'undefined' && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 dir-rtl">
      {/* Daily limit notice (only for create mode) */}
      {!isEdit && (
        <div className="bg-[var(--accent)]/30 border border-[var(--primary)]/20 rounded-2xl p-4 flex items-start gap-3 text-xs leading-relaxed">
          <Info className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[var(--foreground)]">حد النشر اليومي</p>
            <p className="text-[var(--muted-foreground)]">
              تسمح منصة صفقة بنشر حتى <strong>3 إعلانات يومياً</strong> لكل حساب مجاناً للحفاظ على جودة العروض ومنع الرسائل المزعجة.
            </p>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive" title={isEdit ? 'تعذر تحديث الإعلان' : 'تعذر نشر الإعلان'}>
          {error}
        </Alert>
      )}

      {/* ── Section 1: Basic Information ── */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-5">
        <h2 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2 border-b border-[var(--border)] pb-3">
          <Tag className="w-4 h-4 text-[var(--primary)]" />
          المعلومات الأساسية
        </h2>

        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="title" className="text-xs font-bold text-[var(--foreground)]">
              عنوان الإعلان *
            </label>
            <span className="text-[10px] text-[var(--muted-foreground)]">
              {form.title.length} / 150
            </span>
          </div>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={150}
            placeholder="مثال: لابتوب Dell XPS 15 بحالة ممتازة مع الشاحن الأصلي"
            required
            className="text-xs"
          />
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
            اكتب عنواناً جذاباً ودقيقاً يوضح نوع وموديل السلعة (5 أحرف على الأقل).
          </p>
        </div>

        {/* Category & Condition Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label htmlFor="category_id" className="block text-xs font-bold text-[var(--foreground)] mb-1.5">
              القسم *
            </label>
            <select
              id="category_id"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              disabled={loadingCategories}
              className="w-full h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
            >
              <option value="">اختر القسم المناسب</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-xs font-bold text-[var(--foreground)] mb-1.5">
              حالة السلعة *
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, condition: cond.value }))}
                  className={`py-2 px-2 rounded-xl text-center border text-[11px] font-bold transition-all cursor-pointer ${
                    form.condition === cond.value
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-[var(--border)]/80'
                  }`}
                >
                  {cond.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price & WhatsApp Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-xs font-bold text-[var(--foreground)] mb-1.5">
              السعر المطلوب (جنيه مصري) *
            </label>
            <div className="relative">
              <Input
                id="price"
                name="price"
                type="number"
                min="1"
                step="1"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                required
                className="text-xs pl-10"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[var(--muted-foreground)] pointer-events-none">
                ج.م
              </span>
            </div>
          </div>

          {/* WhatsApp Number */}
          <div>
            <label htmlFor="whatsapp_number" className="block text-xs font-bold text-[var(--foreground)] mb-1.5">
              رقم الواتساب للتواصل *
            </label>
            <div className="relative">
              <Input
                id="whatsapp_number"
                name="whatsapp_number"
                type="tel"
                value={form.whatsapp_number}
                onChange={handleChange}
                placeholder="01xxxxxxxxx"
                maxLength={11}
                required
                className="text-xs pl-8"
              />
              <Phone className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
              رقم هاتف مصري مفعّل عليه تطبيق واتساب (مثال: 01012345678).
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 2: Media / Images ── */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-4">
        <ProductImageUploader
          images={mediaUrls}
          onChange={setMediaUrls}
          maxImages={5}
        />
      </div>

      {/* ── Section 3: Description ── */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <label
            htmlFor="description"
            className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[var(--primary)]" />
            تفاصيل ووصف الإعلان *
          </label>
          <span className="text-[10px] text-[var(--muted-foreground)]">
            {form.description.length} / 3000
          </span>
        </div>

        <div>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            maxLength={3000}
            placeholder="اشرح مواصفات السلعة، مدة الاستخدام، الملحقات المرفقة، سبب البيع، ومكان المعاينة..."
            required
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] leading-relaxed"
          />
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
            يجب ألا يقل الوصف عن 20 حرفاً لمساعدة المشترين في اتخاذ القرار.
          </p>
        </div>
      </div>

      {/* ── Submit Button ── */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full h-12 text-sm font-bold gap-2 shadow-md"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isEdit ? 'جاري حفظ التعديلات...' : 'جاري نشر الإعلان...'}
            </>
          ) : isEdit ? (
            <>
              <Save className="w-4 h-4" />
              حفظ التعديلات
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              نشر الإعلان الآن
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// Alias for backward compatibility
export const CreateProductForm = ProductForm;
