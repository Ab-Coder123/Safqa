'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../theme-provider';
import { Button, Avatar, Badge } from '../ui';
import { UserMenu } from './user-menu';
import { NotificationCenter } from './notification-center';
import {
  Search,
  PlusCircle,
  Sun,
  Moon,
  Laptop,
  MessageSquare,
  Bookmark,
  ShieldAlert,
} from 'lucide-react';

export function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<{ id: string; full_name: string; role: string; avatar_url?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check local authentication state
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              ص
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[var(--foreground)]">
              صفقة<span className="text-[var(--primary)]">.</span>
            </span>
          </Link>

          {/* Quick Links */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
              الرئيسية
            </Link>
            <Link href="/categories" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              التصنيفات
            </Link>
            {user?.role === 'SUPER_ADMIN' && (
              <Link href="/admin" className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 transition-opacity">
                <ShieldAlert className="w-3.5 h-3.5" />
                لوحة الإدارة
              </Link>
            )}
          </nav>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن سيارات، إلكترونيات، عقارات..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
          />
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--primary)]">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Actions & User Control */}
        <div className="flex items-center gap-3">
          {/* Post Ad Button */}
          <Link href={user ? '/products/create' : '/login'}>
            <Button size="sm" className="hidden sm:flex gap-1.5 shadow-md font-semibold">
              <PlusCircle className="w-4 h-4" />
              أضف إعلانك
            </Button>
          </Link>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="تبديل المظهر"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </Button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/favorites">
                <Button variant="ghost" size="icon" title="المفضلة">
                  <Bookmark className="w-5 h-5 text-[var(--muted-foreground)]" />
                </Button>
              </Link>

              <Link href="/conversations">
                <Button variant="ghost" size="icon" title="الرسائل">
                  <MessageSquare className="w-5 h-5 text-[var(--muted-foreground)]" />
                </Button>
              </Link>

              <NotificationCenter />

              <UserMenu user={user} onLogout={() => { localStorage.clear(); setUser(null); router.push('/login'); }} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="sm">
                  حساب جديد
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
