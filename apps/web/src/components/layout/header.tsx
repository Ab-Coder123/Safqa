'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../theme-provider';
import { Button } from '../ui';
import { UserMenu } from './user-menu';
import { NotificationCenter } from './notification-center';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useLogout } from '@/features/auth/hooks/use-logout';
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
  const { data: userData } = useCurrentUser();
  const logout = useLogout();
  const [searchQuery, setSearchQuery] = useState('');

  const user = userData?.user ?? null;

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
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
              <img src="/images/safqa-logo-3d.png" alt="Safqa" className="w-full h-full object-contain" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[var(--foreground)]">
              صفقة<span className="text-[var(--primary)]">.</span>
            </span>
          </Link>

          {/* Quick Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/products" className="px-3 py-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors rounded-lg hover:bg-[var(--accent)]">
              تصفح الإعلانات
            </Link>
            <Link href="/categories" className="px-3 py-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors rounded-lg hover:bg-[var(--accent)]">
              الأقسام
            </Link>
          </nav>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md mx-4 relative">
          <input
            type="text"
            placeholder="ابحث عن سيارات، عقارات، هواتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--primary)]">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Post Ad Button */}
          <Link href="/products/create">
            <Button size="sm" className="gap-1.5 shadow-sm font-bold">
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">أضف إعلانك</span>
            </Button>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')}
            className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
            title="تبديل المظهر"
          >
            {theme === 'light' ? <Sun className="w-4 h-4" /> : theme === 'dark' ? <Moon className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
          </button>

          {user ? (
            <>
              {/* Authenticated Icons */}
              <Link href="/favorites" className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors" title="المفضلة">
                <Bookmark className="w-4 h-4" />
              </Link>

              <Link href="/conversations" className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors" title="الرسائل">
                <MessageSquare className="w-4 h-4" />
              </Link>

              <NotificationCenter />

              {/* User Dropdown */}
              <UserMenu user={user} onLogout={logout} />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">دخول</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="sm">حساب جديد</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
