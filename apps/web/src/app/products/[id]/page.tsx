'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  whatsapp_number: string;
  status: string;
  created_at: string;
  category: { id: string; name: string; slug: string };
  user: { id: string; full_name: string; avatar_url?: string; created_at: string };
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3001/products/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.statusCode) setError(data.message || 'الإعلان غير موجود');
        else setProduct(data);
        setLoading(false);
      })
      .catch(() => { setError('فشل تحميل الإعلان'); setLoading(false); });
  }, [params.id]);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>جاري التحميل...</div>;
  if (error || !product) return <div style={{ padding: '4rem', textAlign: 'center', color: '#ef4444' }}>{error || 'لم يتم العثور على الإعلان'}</div>;

  const conditionLabel: Record<string, string> = { NEW: 'جديد', USED: 'مستعمل', REFURBISHED: 'مجدد' };
  const isSold = product.status === 'SOLD';
  const isArchived = product.status === 'ARCHIVED';

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
        <Link href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>الرئيسية</Link>
        {' > '}
        <Link href={`/categories`} style={{ color: '#2563eb', textDecoration: 'none' }}>{product.category?.name}</Link>
        {' > '}
        <span>{product.title}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        {/* LEFT — Image & Title */}
        <div>
          <div style={{ borderRadius: '12px', background: 'linear-gradient(135deg,#e0e7ff,#f0f9ff)', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', marginBottom: '1.5rem', position: 'relative' }}>
            📦
            {(isSold || isArchived) && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: isSold ? '#f59e0b' : '#ef4444', color: '#fff', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                {isSold ? 'تم البيع' : 'محذوف'}
              </div>
            )}
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>{product.title}</h1>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ background: '#f0f9ff', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>
              {conditionLabel[product.condition] || product.condition}
            </span>
            <span style={{ background: '#f3f4f6', color: '#374151', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
              {product.category?.name}
            </span>
          </div>

          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>وصف الإعلان</h2>
          <p style={{ color: '#4b5563', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{product.description}</p>
        </div>

        {/* RIGHT — Price Card */}
        <div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.1)', position: 'sticky', top: '1rem' }}>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: '#16a34a', marginBottom: '0.25rem' }}>
              {product.price.toLocaleString('ar-EG')} جنيه
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              نُشر في {new Date(product.created_at).toLocaleDateString('ar-EG')}
            </p>

            {!isSold && !isArchived ? (
              <a
                href={`https://wa.me/2${product.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', background: '#16a34a', color: '#fff', textAlign: 'center', padding: '0.9rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem', marginBottom: '0.75rem' }}
              >
                📱 تواصل عبر واتساب
              </a>
            ) : (
              <div style={{ background: '#f3f4f6', color: '#9ca3af', textAlign: 'center', padding: '0.9rem', borderRadius: '8px', fontWeight: '600' }}>
                {isSold ? 'تم بيع هذا المنتج' : 'الإعلان غير متاح'}
              </div>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '1.25rem 0' }} />

            {/* Seller card */}
            <p style={{ fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>البائع</p>
            <Link href={`/users/${product.user?.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                {product.user?.avatar_url ? <img src={product.user.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '👤'}
              </div>
              <div>
                <p style={{ fontWeight: '600', color: '#111827', margin: 0 }}>{product.user?.full_name}</p>
                <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: 0 }}>
                  عضو منذ {new Date(product.user?.created_at).toLocaleDateString('ar-EG')}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
