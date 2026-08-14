'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  price: number;
  status: 'PUBLISHED' | 'SOLD' | 'ARCHIVED';
  condition: string;
  created_at: string;
  category: { name: string };
}

export default function MyListingsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchMyListings = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('يجب تسجيل الدخول لرؤية إعلاناتك');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/products/me/listings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('فشل جلب الإعلانات');
      const data = await res.json();
      setProducts(data);
    } catch {
      setError('حدث خطأ أثناء تحميل الإعلانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleMarkAsSold = async (id: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:3001/products/${id}/sold`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'فشل تحديث الحالة');
      setActionMessage('تم تحديث حالة الإعلان إلى "تم البيع"');
      fetchMyListings();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('هل أنت متأكد من أرشفة (حذف) هذا الإعلان؟')) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:3001/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'فشل أرشفة الإعلان');
      setActionMessage('تم أرشفة الإعلان بنجاح');
      fetchMyListings();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>جاري التحميل...</div>;

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827', margin: 0 }}>📦 إعلاناتي</h1>
          <p style={{ color: '#6b7280', margin: '0.25rem 0 0' }}>إدارة جميع إعلاناتك المعروضة والمباعة</p>
        </div>
        <Link
          href="/products/create"
          style={{ background: '#2563eb', color: '#fff', padding: '0.75rem 1.25rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}
        >
          + إضافة إعلان جديد
        </Link>
      </div>

      {actionMessage && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#15803d', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {actionMessage}
        </div>
      )}

      {error ? (
        <div style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>{error}</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '3rem', margin: '0 0 1rem' }}>🛒</p>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '1.5rem' }}>لم تقم بنشر أي إعلانات بعد</p>
          <Link href="/products/create" style={{ color: '#2563eb', fontWeight: '600' }}>ابدأ بنشر أول إعلان لك الآن →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {products.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827', margin: 0 }}>{item.title}</h3>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: item.status === 'PUBLISHED' ? '#dcfce7' : item.status === 'SOLD' ? '#fef3c7' : '#fee2e2',
                      color: item.status === 'PUBLISHED' ? '#15803d' : item.status === 'SOLD' ? '#b45309' : '#b91c1c',
                    }}
                  >
                    {item.status === 'PUBLISHED' ? 'معروض' : item.status === 'SOLD' ? 'تم البيع' : 'مؤرشف'}
                  </span>
                </div>
                <p style={{ color: '#16a34a', fontWeight: '700', margin: '0 0 0.25rem' }}>
                  {item.price.toLocaleString('ar-EG')} جنيه
                </p>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                  القسم: {item.category?.name} | {new Date(item.created_at).toLocaleDateString('ar-EG')}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  href={`/products/${item.id}`}
                  style={{ padding: '0.5rem 0.85rem', borderRadius: '6px', border: '1px solid #d1d5db', textDecoration: 'none', color: '#374151', fontSize: '0.85rem' }}
                >
                  معاينة
                </Link>
                {item.status === 'PUBLISHED' && (
                  <button
                    onClick={() => handleMarkAsSold(item.id)}
                    style={{ padding: '0.5rem 0.85rem', borderRadius: '6px', background: '#f59e0b', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                  >
                    تم البيع
                  </button>
                )}
                {item.status !== 'ARCHIVED' && (
                  <button
                    onClick={() => handleArchive(item.id)}
                    style={{ padding: '0.5rem 0.85rem', borderRadius: '6px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                  >
                    حذف
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
