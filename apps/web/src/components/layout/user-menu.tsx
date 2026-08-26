'use client';

import React from 'react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuItem, Avatar, Separator } from '../ui';
import { User, Package, Heart, Settings, ShieldAlert, LogOut } from 'lucide-react';

interface UserMenuProps {
  user: { id: string; full_name: string; role: string; avatar_url?: string | null };
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  return (
    <DropdownMenu
      trigger={
        <div className="cursor-pointer hover:opacity-85 transition-opacity">
          <Avatar name={user.full_name} src={user.avatar_url} size="sm" statusDot="online" />
        </div>
      }
      align="end"
    >
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <p className="text-sm font-bold text-[var(--foreground)] truncate">{user.full_name}</p>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{user.role === 'SUPER_ADMIN' ? 'مدير النظام' : 'مستخدم'}</p>
      </div>

      <Link href="/settings">
        <DropdownMenuItem>
          <User className="w-4 h-4 text-[var(--muted-foreground)]" />
          الملف الشخصي
        </DropdownMenuItem>
      </Link>

      <Link href="/my-listings">
        <DropdownMenuItem>
          <Package className="w-4 h-4 text-[var(--muted-foreground)]" />
          إعلاناتي
        </DropdownMenuItem>
      </Link>

      <Link href="/favorites">
        <DropdownMenuItem>
          <Heart className="w-4 h-4 text-[var(--muted-foreground)]" />
          المفضلة
        </DropdownMenuItem>
      </Link>

      <Link href="/settings">
        <DropdownMenuItem>
          <Settings className="w-4 h-4 text-[var(--muted-foreground)]" />
          الإعدادات
        </DropdownMenuItem>
      </Link>

      {user.role === 'SUPER_ADMIN' && (
        <Link href="/admin">
          <DropdownMenuItem className="text-[var(--primary)] font-semibold">
            <ShieldAlert className="w-4 h-4 text-[var(--primary)]" />
            لوحة الإدارة
          </DropdownMenuItem>
        </Link>
      )}

      <Separator style={{ margin: '0.25rem 0' }} />

      <DropdownMenuItem onClick={onLogout} className="text-[var(--destructive)] hover:bg-[var(--destructive-background)]">
        <LogOut className="w-4 h-4 text-[var(--destructive)]" />
        تسجيل الخروج
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
