'use client';

import React from 'react';
import { Button, Badge } from '@/components/ui';
import { Search, Filter, X, Tag, DollarSign, RotateCcw } from 'lucide-react';
import { useCategories } from '@/features/categories/hooks/use-categories';

export interface ProductFiltersState {
  q: string;
  category_id: string;
  condition: string;
  min_price: string;
  max_price: string;
}

interface ProductFiltersProps {
  filters: ProductFiltersState;
  onFilterChange: (filters: Partial<ProductFiltersState>) => void;
  onReset: () => void;
  totalCount?: number;
  currentCount?: number;
}

const CONDITIONS = [
  { key: 'ALL', label: 'الكل' },
  { key: 'NEW', label: 'جديد' },
  { key: 'LIKE_NEW', label: 'شبه جديد' },
  { key: 'USED_GOOD', label: 'مستعمل بحالة جيدة' },
  { key: 'USED_FAIR', label: 'مستعمل بحالة مقبولة' },
];

export function ProductFilters({
  filters,
  onFilterChange,
  onReset,
  totalCount,
  currentCount,
}: ProductFiltersProps) {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const hasActiveFilters =
    filters.q !== '' ||
    filters.category_id !== '' ||
    filters.condition !== 'ALL' ||
    filters.min_price !== '' ||
    filters.max_price !== '';

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4 mb-6">
      {/* Search Input Row */}
      <div className="relative">
        <input
          type="text"
          value={filters.q}
          onChange={(e) => onFilterChange({ q: e.target.value })}
          placeholder="ابحث بالاسم أو المواصفات (مثال: iPhone 15, لابتوب Dell)..."
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-3 pr-11 pl-10 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all"
        />
        <Search className="w-5 h-5 text-[var(--muted-foreground)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        {filters.q && (
          <button
            type="button"
            onClick={() => onFilterChange({ q: '' })}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-full hover:bg-[var(--muted)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div>
        <label className="text-xs font-bold text-[var(--muted-foreground)] flex items-center gap-1.5 mb-2.5">
          <Tag className="w-3.5 h-3.5 text-[var(--primary)]" />
          القسم / التصنيف
        </label>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={filters.category_id === '' ? 'primary' : 'outline'}
            onClick={() => onFilterChange({ category_id: '' })}
            className="text-xs rounded-lg h-8"
          >
            جميع الأقسام
          </Button>

          {categoriesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-[var(--muted)] rounded-lg animate-pulse" />
            ))
          ) : (
            categories.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={filters.category_id === cat.id ? 'primary' : 'outline'}
                onClick={() => onFilterChange({ category_id: cat.id })}
                className="text-xs rounded-lg h-8"
              >
                {cat.name}
              </Button>
            ))
          )}
        </div>
      </div>

      {/* Condition Filters & Price Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--border)]/60">
        {/* Condition Filter */}
        <div>
          <label className="text-xs font-bold text-[var(--muted-foreground)] flex items-center gap-1.5 mb-2">
            <Filter className="w-3.5 h-3.5 text-[var(--primary)]" />
            حالة المنتج
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CONDITIONS.map((c) => (
              <Button
                key={c.key}
                size="sm"
                variant={filters.condition === c.key ? 'primary' : 'outline'}
                onClick={() => onFilterChange({ condition: c.key })}
                className="text-xs rounded-lg h-7 px-2.5"
              >
                {c.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="text-xs font-bold text-[var(--muted-foreground)] flex items-center gap-1.5 mb-2">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            نطاق السعر (ج.م)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="من"
              value={filters.min_price}
              onChange={(e) => onFilterChange({ min_price: e.target.value })}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
            <span className="text-xs text-[var(--muted-foreground)]">-</span>
            <input
              type="number"
              placeholder="إلى"
              value={filters.max_price}
              onChange={(e) => onFilterChange({ max_price: e.target.value })}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>
        </div>
      </div>

      {/* Footer bar with Counter and Reset Action */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]/60 text-xs">
        <span className="text-[var(--muted-foreground)]">
          {totalCount !== undefined && (
            <>
              عرض <strong className="text-[var(--foreground)]">{currentCount ?? 0}</strong> من أصل{' '}
              <strong className="text-[var(--primary)]">{totalCount}</strong> إعلان
            </>
          )}
        </span>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs h-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            إعادة ضبط الفلاتر
          </Button>
        )}
      </div>
    </div>
  );
}
