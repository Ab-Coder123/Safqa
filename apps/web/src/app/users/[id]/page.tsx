'use client';

import React, { useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  products?: any[];
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3001/users/${params.id}/profile`)
      .then((r) => r.json())
      .then((data) => {
        if (data.statusCode) {
          setError(data.message || 'المستخدم غير موجود');
        } else {
          setProfile(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('فشل تحميل الملف الشخصي');
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>جاري التحميل...</div>;
  if (error || !profile)
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>{error || 'لم يتم العثور على المستخدم'}</div>;

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      {/* Profile Header */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : '👤'}
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>{profile.full_name}</h1>
          <p style={{ color: '#94a3b8', margin: '0.25rem 0 0' }}>
            عضو منذ {new Date(profile.created_at).toLocaleDateString('ar-EG')}
          </p>
        </div>
      </div>

      {/* Listings */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#334155', marginBottom: '1rem' }}>
        إعلانات المستخدم ({profile.products?.length || 0})
      </h2>
      {!profile.products?.length ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>لا توجد إعلانات منشورة حالياً</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {profile.products.map((p: any) => (
            <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', margin: '0 0 0.5rem' }}>{p.title}</h3>
              <p style={{ color: '#16a34a', fontWeight: '700', margin: 0 }}>{p.price} {p.currency}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem' }}>{p.category?.name}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
