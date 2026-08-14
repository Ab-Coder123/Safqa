'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'NEW',
    category_id: '',
    whatsapp_number: '',
  });

  useEffect(() => {
    fetch('http://localhost:3001/categories')
      .then(r => r.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('يجب تسجيل الدخول أولاً');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = Array.isArray(data.message) ? data.message.join('. ') : data.message;
        setError(msg || 'فشل نشر الإعلان');
      } else {
        router.push(`/products/${data.product.id}`);
      }
    } catch {
      setError('خطأ في الاتصال. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '620px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
        📋 نشر إعلان جديد
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>يمكنك نشر حتى 3 إعلانات يومياً</p>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Title */}
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
            عنوان الإعلان *
          </label>
          <input
            name="title"
            required
            minLength={5}
            maxLength={150}
            value={form.title}
            onChange={handleChange}
            placeholder="مثال: لابتوب Dell Core i7 للبيع"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '1rem' }}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
            الوصف *
          </label>
          <textarea
            name="description"
            required
            minLength={20}
            value={form.description}
            onChange={handleChange}
            placeholder="اكتب تفاصيل كافية عن المنتج..."
            rows={5}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '1rem', resize: 'vertical' }}
          />
        </div>

        {/* Price & Condition side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
              السعر (جنيه) *
            </label>
            <input
              name="price"
              type="number"
              required
              min={1}
              value={form.price}
              onChange={handleChange}
              placeholder="0"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '1rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
              الحالة *
            </label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '1rem', background: '#fff' }}
            >
              <option value="NEW">جديد</option>
              <option value="USED">مستعمل</option>
              <option value="REFURBISHED">مجدد</option>
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
            القسم *
          </label>
          <select
            name="category_id"
            required
            value={form.category_id}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '1rem', background: '#fff' }}
          >
            <option value="">اختر القسم</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* WhatsApp */}
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
            رقم واتساب *
          </label>
          <input
            name="whatsapp_number"
            required
            value={form.whatsapp_number}
            onChange={handleChange}
            placeholder="01XXXXXXXXX"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '1rem' }}
          />
          <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            رقم مصري يبدأ بـ 010 / 011 / 012 / 015
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ background: loading ? '#93c5fd' : '#2563eb', color: '#fff', padding: '0.9rem', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '1.05rem' }}
        >
          {loading ? 'جاري النشر...' : '🚀 نشر الإعلان'}
        </button>
      </form>
    </main>
  );
}
