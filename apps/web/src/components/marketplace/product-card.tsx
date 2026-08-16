'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import { Card, CardContent, Badge, useToast } from '../ui';
import { Heart, MapPin, Tag } from 'lucide-react';

export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    condition: string;
    status: string;
    created_at: string;
    user_id?: string;
    category?: { name: string; slug?: string };
    media?: { url: string }[];
  };
  initialFavorited?: boolean;
}

const CONDITION_LABELS: Record<string, string> = {
  NEW: 'جديد',
  LIKE_NEW: 'شبه جديد',
  USED_GOOD: 'مستعمل - بحالة جيدة',
  USED_FAIR: 'مستعمل - بحالة مقبولة',
};

const DEFAULT_IMAGE = 'https://placehold.co/600x400/0f766e/ffffff?text=صفقة';

function ProductCardComponent({ product, initialFavorited = false }: ProductCardProps) {
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast({ title: 'يرجى تسجيل الدخول لحفظ الإعلان في المفضلة', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/favorites/${product.id}/toggle`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setIsFavorited(data.is_favorited);
        toast({ title: data.message, type: 'success' });
      } else {
        toast({ title: data.message || 'فشل تعديل المفضلة', type: 'error' });
      }
    } catch {
      toast({ title: 'حدث خطأ في الاتصال بالخادم', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const mainImage = product.media && product.media.length > 0 ? product.media[0].url : DEFAULT_IMAGE;

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <Card className="overflow-hidden hover:border-[var(--primary)]/50 transition-all duration-200 h-full flex flex-col">
        {/* Media Preview */}
        <div className="relative aspect-[4/3] w-full bg-[var(--muted)] overflow-hidden">
          <img
            src={mainImage}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Condition Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="shadow-sm backdrop-blur-md bg-[var(--card)]/80 text-[11px]">
              {CONDITION_LABELS[product.condition] || product.condition}
            </Badge>
          </div>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={toggleFavorite}
            disabled={loading}
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[var(--card)]/80 backdrop-blur-md flex items-center justify-center text-[var(--muted-foreground)] hover:text-rose-500 hover:bg-[var(--card)] transition-all shadow-sm cursor-pointer disabled:opacity-50"
            title={isFavorited ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Info Content */}
        <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3">
          <div>
            {product.category && (
              <p className="text-[11px] font-semibold text-[var(--primary)] mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {product.category.name}
              </p>
            )}
            <h3 className="font-bold text-sm text-[var(--foreground)] line-clamp-2 leading-snug group-hover:text-[var(--primary)] transition-colors">
              {product.title}
            </h3>
          </div>

          <div className="pt-2 border-t border-[var(--border)]/50 flex items-center justify-between">
            <p className="text-base font-extrabold text-[var(--primary)]">
              {product.price.toLocaleString('ar-EG')} <span className="text-xs font-normal">ج.م</span>
            </p>

            <span className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              مصر
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export const ProductCard = memo(ProductCardComponent);
