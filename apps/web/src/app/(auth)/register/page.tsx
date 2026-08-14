'use client';

import React, { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone_number: '',
    gender: 'MALE',
    birth_date: '1995-01-01',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'فشل إنشاء الحساب');
      }

      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      alert('تم إنشاء الحساب بنجاح! 🎉');
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '450px', backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center', fontSize: '1.8rem', color: '#1e293b', marginBottom: '1.5rem' }}>إنشاء حساب جديد | صفقة</h1>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#334155' }}>الاسم الثلاثي</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="محمد أحمد علي"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#334155' }}>البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@mail.com"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#334155' }}>رقم الهاتف (مصر)</label>
            <input
              type="text"
              required
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              placeholder="01012345678"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#334155' }}>كلمة المرور</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#334155' }}>النوع</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }}
              >
                <option value="MALE">ذكر</option>
                <option value="FEMALE">أنثى</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#334155' }}>تاريخ الميلاد</label>
              <input
                type="date"
                required
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', backgroundColor: '#16a34a', color: '#ffffff', padding: '0.75rem', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}
          >
            {loading ? 'جاري إنشـاء الحساب...' : 'إنشاء الحساب'}
          </button>
        </form>
      </div>
    </div>
  );
}
