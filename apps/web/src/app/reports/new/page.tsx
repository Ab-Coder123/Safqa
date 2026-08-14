'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Inner component that uses useSearchParams — must be wrapped in Suspense
function NewReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetType = searchParams.get('type') || 'PRODUCT';
  const targetId = searchParams.get('id') || '';

  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('يجب تسجيل الدخول لتقديم بلاغ');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'فشل إرسال البلاغ');
      } else {
        setSuccess('تم إرسال البلاغ بنجاح. سيقوم فريق الإدارة بمراجعته.');
        setTimeout(() => router.back(), 2000);
      }
    } catch {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
        🚩 تقديم بلاغ مخالفة
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        ساعدنا في الحفاظ على أمان المنصة بالإبلاغ عن الإعلانات أو الحسابات المخالفة
      </p>

      {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#15803d', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
            نوع البلاغ
          </label>
          <input
            disabled
            value={targetType === 'PRODUCT' ? 'إعلان مخالف' : 'حساب مستخدم مخالف'}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '1rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
            سبب البلاغ بالتفصيل *
          </label>
          <textarea
            required
            minLength={5}
            maxLength={500}
            rows={5}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="اشرح سبب البلاغ (مثل: إعلان واحتيال، منتج ممنوع، معلومات غير صحيحة)..."
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !targetId}
          style={{
            background: loading || !targetId ? '#fca5a5' : '#ef4444',
            color: '#fff',
            padding: '0.9rem',
            borderRadius: '8px',
            border: 'none',
            cursor: loading || !targetId ? 'not-allowed' : 'pointer',
            fontWeight: '700',
            fontSize: '1rem',
          }}
        >
          {loading ? 'جاري الإرسال...' : 'إرسال البلاغ'}
        </button>
      </form>
    </main>
  );
}

// Outer page wraps content in Suspense (Next.js 14 requirement for useSearchParams)
export default function NewReportPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: '#6b7280' }}>
        جاري التحميل...
      </div>
    }>
      <NewReportContent />
    </Suspense>
  );
}
