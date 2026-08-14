'use client';

import React, { useEffect, useState } from 'react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  gender: string;
  birth_date: string;
  avatar_url?: string;
  role: string;
  status: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Change password state
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_new_password: '' });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { setError('يجب تسجيل الدخول أولاً'); setLoading(false); return; }

    fetch('http://localhost:3001/users/me/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setProfile(data); setLoading(false); })
      .catch(() => { setError('فشل تحميل الإعدادات'); setLoading(false); });
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    const token = localStorage.getItem('accessToken');
    const res = await fetch('http://localhost:3001/users/me/change-password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(pwForm),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.message || 'فشل تغيير كلمة المرور'); }
    else { setMessage(data.message); setPwForm({ current_password: '', new_password: '', confirm_new_password: '' }); }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    const token = localStorage.getItem('accessToken');
    const res = await fetch('http://localhost:3001/users/me', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.clear();
      alert(data.message);
      window.location.href = '/';
    } else {
      setError(data.message || 'فشل حذف الحساب');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>جاري التحميل...</div>;

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '0.5rem' }}>إعدادات الحساب</h1>

      {message && <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#15803d', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>{message}</div>}
      {error && <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>{error}</div>}

      {/* Profile Summary */}
      {profile && (
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', marginBottom: '1rem' }}>معلوماتي</h2>
          <p style={{ margin: '0.4rem 0', color: '#475569' }}><strong>الاسم: </strong>{profile.full_name}</p>
          <p style={{ margin: '0.4rem 0', color: '#475569' }}><strong>البريد: </strong>{profile.email}</p>
          <p style={{ margin: '0.4rem 0', color: '#475569' }}><strong>الهاتف: </strong>{profile.phone_number}</p>
        </div>
      )}

      {/* Change Password */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', marginBottom: '1rem' }}>تغيير كلمة المرور</h2>
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(['current_password', 'new_password', 'confirm_new_password'] as const).map((field) => (
            <input
              key={field}
              type="password"
              required
              placeholder={field === 'current_password' ? 'كلمة المرور الحالية' : field === 'new_password' ? 'كلمة المرور الجديدة' : 'تأكيد كلمة المرور الجديدة'}
              value={pwForm[field]}
              onChange={(e) => setPwForm({ ...pwForm, [field]: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          ))}
          <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
            تغيير كلمة المرور
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #fecaca' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#991b1b', marginBottom: '0.75rem' }}>منطقة الخطر</h2>
        <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>سيتم أرشفة جميع إعلاناتك وحذف حسابك بشكل نهائي.</p>
        <button onClick={handleDeleteAccount} style={{ backgroundColor: '#ef4444', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
          حذف الحساب
        </button>
      </div>
    </main>
  );
}
