import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ProductFilters, type ProductFiltersState } from '../product-filters';
import { renderWithProviders } from '@/test/test-utils';
import * as useCategoriesModule from '@/features/categories/hooks/use-categories';

describe('ProductFilters Component', () => {
  const initialFilters: ProductFiltersState = {
    q: '',
    category_id: '',
    condition: 'ALL',
    min_price: '',
    max_price: '',
  };

  const mockCategories = [
    { id: 'cat-1', name: 'سيارات وقطع غيار', slug: 'cars' },
    { id: 'cat-2', name: 'إلكترونيات', slug: 'electronics' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useCategoriesModule, 'useCategories').mockReturnValue({
      data: mockCategories,
      isLoading: false,
      isError: false,
    } as any);
  });

  it('renders search input, categories, condition buttons, and price inputs', () => {
    const handleFilterChange = vi.fn();
    const handleReset = vi.fn();

    renderWithProviders(
      <ProductFilters
        filters={initialFilters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        totalCount={25}
        currentCount={12}
      />
    );

    expect(screen.getByPlaceholderText(/ابحث بالاسم أو المواصفات/)).toBeInTheDocument();
    expect(screen.getByText('سيارات وقطع غيار')).toBeInTheDocument();
    expect(screen.getByText('إلكترونيات')).toBeInTheDocument();
    expect(screen.getByText('جميع الأقسام')).toBeInTheDocument();
    expect(screen.getByText('جديد')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('من')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('إلى')).toBeInTheDocument();
    expect(screen.getByText(/25/)).toBeInTheDocument();
  });

  it('triggers onFilterChange when typing in search input', () => {
    const handleFilterChange = vi.fn();

    renderWithProviders(
      <ProductFilters
        filters={initialFilters}
        onFilterChange={handleFilterChange}
        onReset={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/ابحث بالاسم أو المواصفات/);
    fireEvent.change(input, { target: { value: 'لابتوب' } });

    expect(handleFilterChange).toHaveBeenCalledWith({ q: 'لابتوب' });
  });

  it('triggers onFilterChange when clicking category button', () => {
    const handleFilterChange = vi.fn();

    renderWithProviders(
      <ProductFilters
        filters={initialFilters}
        onFilterChange={handleFilterChange}
        onReset={vi.fn()}
      />
    );

    const electronicsBtn = screen.getByText('إلكترونيات');
    fireEvent.click(electronicsBtn);

    expect(handleFilterChange).toHaveBeenCalledWith({ category_id: 'cat-2' });
  });

  it('shows reset button when filters are active and calls onReset on click', () => {
    const handleReset = vi.fn();

    renderWithProviders(
      <ProductFilters
        filters={{
          ...initialFilters,
          q: 'تليفون',
        }}
        onFilterChange={vi.fn()}
        onReset={handleReset}
      />
    );

    const resetBtn = screen.getByText('إعادة ضبط الفلاتر');
    expect(resetBtn).toBeInTheDocument();

    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
