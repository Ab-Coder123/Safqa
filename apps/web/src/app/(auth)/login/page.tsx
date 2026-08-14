'use client';

import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'فشل تسجيل الدخول');
      }

      // Store Tokens
      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      alert('تم تسجيل الدخول بنجاح! 🎉');
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '1rem' }}>
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ textAlign: 'center', fontSize: '1.8rem', color: '#1e293b', marginBottom: '1.5rem' }}>تسجيل الدخول | صفقة</h1>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', padding: '0.75rem', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}
            >
              {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      </div>
    </>

  );
}
