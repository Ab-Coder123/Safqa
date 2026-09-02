'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, useToast } from '@/components/ui';
import { Phone, MessageCircle, ShieldCheck, UserCheck, Copy, Check } from 'lucide-react';

interface ProductSellerCardProps {
  user?: {
    id: string;
    full_name: string;
    email?: string;
    phone_number?: string;
    avatar_url?: string;
    created_at?: string;
    _count?: { products: number };
  };
  productTitle: string;
  whatsappNumber?: string;
  isSold?: boolean;
}

export function ProductSellerCard({
  user,
  productTitle,
  whatsappNumber,
  isSold = false,
}: ProductSellerCardProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const phone = whatsappNumber || user.phone_number || '';
  // Clean phone number for WhatsApp URL (Egyptian numbers: 01xxxxxxxxx -> 201xxxxxxxxx)
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('01')) {
    cleanPhone = '20' + cleanPhone.substring(1);
  } else if (!cleanPhone.startsWith('20') && cleanPhone.length === 11) {
    cleanPhone = '20' + cleanPhone;
  }

  const encodedMessage = encodeURIComponent(
    `السلام عليكم، بخصوص إعلانك على صفقة:\n"${productTitle}"\nهل المنتج ما زال متاحاً؟`
  );

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  const handleCopyPhone = () => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopied(true);
    toast({
      title: 'تم نسخ رقم الهاتف',
      description: phone,
      type: 'success',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('ar-EG', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[var(--muted-foreground)] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
          معلومات البائع
        </h3>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
          <UserCheck className="w-3 h-3" />
          بائع موثوق
        </span>
      </div>

      {/* Seller Snippet */}
      <Link
        href={`/users/${user.id}`}
        className="flex items-center gap-3.5 p-2 -mx-2 rounded-xl hover:bg-[var(--muted)]/50 transition-colors group"
      >
        <div className="relative w-12 h-12 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center overflow-hidden flex-shrink-0">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-[var(--primary)]">
              {user.full_name.charAt(0)}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
            {user.full_name}
          </h4>
          {memberSince && (
            <p className="text-[11px] text-[var(--muted-foreground)]">عضو منذ {memberSince}</p>
          )}
          {user._count?.products !== undefined && (
            <p className="text-[11px] font-semibold text-[var(--primary)] mt-0.5">
              {user._count.products} إعلان نشط
            </p>
          )}
        </div>
      </Link>

      {/* Action Triggers */}
      <div className="space-y-2 pt-2 border-t border-[var(--border)]/60">
        {/* Direct WhatsApp Button */}
        <a
          href={isSold ? undefined : whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full block ${isSold ? 'pointer-events-none opacity-50' : ''}`}
        >
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 gap-2 shadow-sm"
            disabled={isSold || !phone}
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            {isSold ? 'تم بيع الإعلان' : 'تواصل عبر الواتساب'}
          </Button>
        </a>

        {/* Copy Phone Button */}
        {phone && (
          <Button
            variant="outline"
            onClick={handleCopyPhone}
            className="w-full h-10 text-xs font-semibold gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Phone className="w-4 h-4 text-[var(--muted-foreground)]" />}
            <span>{copied ? 'تم النسخ بنجاح' : `اتصال: ${phone}`}</span>
            <Copy className="w-3 h-3 text-[var(--muted-foreground)] mr-auto" />
          </Button>
        )}
      </div>
    </div>
  );
}
