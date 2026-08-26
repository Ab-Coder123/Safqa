'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { useCreateProduct } from '@/features/products/hooks/use-create-product';
import { tokenStorage } from '@/lib/api';

import { AuthGuard } from '@/features/auth/components/auth-guard';

function CreateProductForm() {
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const createProductMutation = useCreateProduct();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'NEW' as 'NEW' | 'LIKE_NEW' | 'USED_GOOD' | 'USED_FAIR',
    category_id: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    createProductMutation.mutate(
      {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        condition: form.condition,
        category_id: form.category_id,
      },
      {
        onSuccess: (product) => {
          router.push(`/products/${product.id}`);
        },
        onError: (err: any) => {
          setError(err.message || 'فشل نشر الإعلان');
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-extrabold text-[var(--foreground)] mb-1">
          📋 نشر إعلان جديد
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">يمكنك نشر حتى 3 إعلانات يومياً</p>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="title">عنوان الإعلان *</Label>
            <Input
              id="title"
              name="title"
              required
              minLength={3}
              maxLength={150}
              value={form.title}
              onChange={handleChange}
              placeholder="مثال: لابتوب Dell Core i7 للبيع"
            />
          </div>

          <div>
            <Label htmlFor="description">الوصف *</Label>
            <textarea
              id="description"
              name="description"
              required
              minLength={10}
              value={form.description}
              onChange={handleChange}
              placeholder="اكتب تفاصيل كافية عن المنتج..."
              rows={4}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-sm focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">السعر (جنيه) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                required
                min={1}
                value={form.price}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="condition">الحالة *</Label>
              <select
                id="condition"
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className="w-full h-10 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="NEW">جديد</option>
                <option value="LIKE_NEW">شبه جديد</option>
                <option value="USED_GOOD">مستعمل - بحالة جيدة</option>
                <option value="USED_FAIR">مستعمل - بحالة مقبولة</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="category_id">القسم *</Label>
            <select
              id="category_id"
              name="category_id"
              required
              value={form.category_id}
              onChange={handleChange}
              className="w-full h-10 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="">اختر القسم</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            disabled={createProductMutation.isPending}
            className="w-full"
          >
            {createProductMutation.isPending ? 'جاري النشر...' : '🚀 نشر الإعلان'}
          </Button>
        </form>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function CreateProductPage() {
  return (
    <AuthGuard>
      <CreateProductForm />
    </AuthGuard>
  );
}
