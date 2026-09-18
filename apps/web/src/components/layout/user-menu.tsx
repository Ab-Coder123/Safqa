'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuItem, Separator } from '../ui';
import { User, Package, Heart, Settings, ShieldAlert, LogOut } from 'lucide-react';

interface UserMenuProps {
  user: { id: string; full_name: string; role: string; avatar_url?: string | null };
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  return (
    <DropdownMenu
      trigger={
        <div className="cursor-pointer hover:opacity-85 transition-opacity flex items-center">
          {user.avatar_url ? (
            <img
              className="w-9 h-9 rounded-full object-cover border-2 border-[var(--primary)]/30 shadow-sm"
              alt={user.full_name}
              src={user.avatar_url}
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/70 text-white flex items-center justify-center font-bold text-xs shadow-sm border-2 border-[var(--primary)]/30">
              {user.full_name}
            </div>
          )}
        </div>
      }
      align="end"
    >
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <p className="text-sm font-bold text-[var(--foreground)] truncate">{user.full_name}</p>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          {user.role === 'SUPER_ADMIN' ? 'مدير النظام' : 'مستخدم'}
        </p>
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
