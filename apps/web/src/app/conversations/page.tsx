'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ConversationItem {
  id: string;
  product_id: string;
  other_user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    is_read: boolean;
  };
  updated_at: string;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('يجب تسجيل الدخول لمشاهدة المحادثات');
      setLoading(false);
      return;
    }

    fetch('http://localhost:3001/conversations', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setConversations(data);
        setLoading(false);
      })
      .catch(() => {
        setError('حدث خطأ أثناء تحميل المحادثات');
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>جاري التحميل...</div>;

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
        💬 المحادثات
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>صندوق الرسائل والمفاوضات المباشرة</p>

      {error ? (
        <div style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>{error}</div>
      ) : conversations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '3rem', margin: '0 0 1rem' }}>💬</p>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '1.5rem' }}>لا توجد محادثات جارية</p>
          <Link href="/" style={{ color: '#2563eb', fontWeight: '600' }}>تصفح الإعلانات وتواصل مع البائعين ←</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/conversations/${conv.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  transition: 'box-shadow 0.2s',
                  cursor: 'pointer',
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                  {conv.other_user?.avatar_url ? (
                    <img src={conv.other_user.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    '👤'
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                      {conv.other_user?.full_name}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                      {new Date(conv.updated_at).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conv.last_message ? conv.last_message.content : 'بدأت المحادثة'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
