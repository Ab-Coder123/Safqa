'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '/categories', label: 'التصنيفات', icon: Search },
    { href: '/products/create', label: 'أضف إعلان', icon: PlusCircle, highlight: true },
    { href: '/conversations', label: 'الدردشة', icon: MessageSquare },
    { href: '/settings', label: 'حسابي', icon: User },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--card)]/95 backdrop-blur-md border-t border-[var(--border)] px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        if (item.highlight) {
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center -mt-5">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-[var(--primary)] mt-1">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-[var(--primary)] font-bold' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
