'use client';

import React, { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon_url?: string;
  children?: Category[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/categories')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => {
        setError('فشل تحميل الأقسام');
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>جاري التحميل...</div>;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>{error}</div>;

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '0.5rem' }}>تصفح الأقسام</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>اختر القسم الذي يناسبك للبحث داخله</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
              {cat.icon_url || '📦'}
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#334155' }}>{cat.name}</h2>
            {cat.children && cat.children.length > 0 && (
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                {cat.children.length} قسم فرعي
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
