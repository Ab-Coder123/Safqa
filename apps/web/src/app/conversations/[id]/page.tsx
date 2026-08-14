'use client';

import React, { useEffect, useState, useRef } from 'react';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender: {
    id: string;
    full_name: string;
  };
}

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('يجب تسجيل الدخول لمشاهدة الرسائل');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/conversations/${params.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'فشل تحميل الرسائل');
      }
      const data = await res.json();
      setMessages(data);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get current user id from own profile endpoint
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetch('http://localhost:3001/users/me/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((user) => setCurrentUserId(user.id))
        .catch(() => {});
    }

    fetchMessages();
    // Auto-poll messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    setSending(true);
    const token = localStorage.getItem('accessToken');

    try {
      const res = await fetch(`http://localhost:3001/conversations/${params.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: inputText.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || 'فشل إرسال الرسالة');
      } else {
        setInputText('');
        fetchMessages();
      }
    } catch {
      alert('خطأ في الاتصال');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>جاري التحميل...</div>;

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
        💬 غرفة المحادثة
      </h1>

      {error ? (
        <div style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>{error}</div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {/* Message History Area */}
          <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#f9fafb' }}>
            {messages.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', margin: 'auto' }}>لا توجد رسائل سابقة. ابدأ المحادثة الآن!</p>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      background: isMe ? '#2563eb' : '#fff',
                      color: isMe ? '#fff' : '#111827',
                      padding: '0.75rem 1rem',
                      borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                    }}
                  >
                    {!isMe && (
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.2rem', fontWeight: '600' }}>
                        {msg.sender?.full_name}
                      </span>
                    )}
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                    <span style={{ fontSize: '0.7rem', color: isMe ? 'rgba(255,255,255,0.7)' : '#9ca3af', display: 'block', textAlign: 'left', marginTop: '0.25rem' }}>
                      {new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Send Input Bar */}
          <form onSubmit={handleSendMessage} style={{ padding: '0.85rem', background: '#fff', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              maxLength={2000}
              style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem' }}
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                background: sending || !inputText.trim() ? '#93c5fd' : '#2563eb',
                color: '#fff',
                border: 'none',
                cursor: sending || !inputText.trim() ? 'not-allowed' : 'pointer',
                fontWeight: '600',
              }}
            >
              {sending ? 'إرسال...' : 'إرسال 🚀'}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
