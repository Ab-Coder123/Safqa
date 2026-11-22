import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, screen, act } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { ThemeProvider } from '@/components/theme-provider';
import ProductsPage from '@/app/products/page';
import { ProductCard } from '@/features/products/components/product-card';
import { Header } from '@/components/layout/header';
import * as useProductsHook from '@/features/products/hooks/use-products';
import * as useCategoriesHook from '@/features/categories/hooks/use-categories';
import * as useCurrentUserHook from '@/features/auth/hooks/use-current-user';
import * as useNotificationsHook from '@/features/notifications/hooks/use-notifications';

describe('Phase 11 — Frontend E2E User Flows & Performance Verification', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    vi.spyOn(useCategoriesHook, 'useCategories').mockReturnValue({
      data: [{ id: 'cat-1', name: 'إلكترونيات', slug: 'electronics' }],
      isLoading: false,
    } as any);
    vi.spyOn(useCurrentUserHook, 'useCurrentUser').mockReturnValue({
      data: undefined,
      isLoading: false,
    } as any);
    vi.spyOn(useNotificationsHook, 'useNotifications').mockReturnValue({
      data: { notifications: [], unread_count: 0 },
    } as any);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('ProductCard renders lazy-loaded images and resolves relative /uploads paths via NEXT_PUBLIC_API_URL', () => {
    renderWithProviders(
      <ProductCard
        product={{
          id: 'prod-1',
          title: 'لابتوب ديل مستعمل نظيف',
          price: 15000,
          condition: 'USED_GOOD',
          status: 'PUBLISHED',
          created_at: new Date().toISOString(),
          category: { name: 'إلكترونيات' },
          media: [{ url: '/uploads/laptop.webp' }],
        }}
      />,
    );

    const img = screen.getByAltText('لابتوب ديل مستعمل نظيف') as HTMLImageElement;
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('decoding')).toBe('async');
    expect(img.getAttribute('src')).toBe('http://localhost:3001/uploads/laptop.webp');
  });

  it('ProductsPage debounces live search input (400ms) instead of firing a query per keystroke', async () => {
    vi.useFakeTimers();

    const useProductsSpy = vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
      data: { data: [], total: 0, page: 1, limit: 12, totalPages: 1 },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(
      <ThemeProvider>
        <ProductsPage />
      </ThemeProvider>,
    );

    const searchInput = screen.getByPlaceholderText(/ابحث بالاسم أو المواصفات/i);

    fireEvent.change(searchInput, { target: { value: 'i' } });
    fireEvent.change(searchInput, { target: { value: 'iP' } });
    fireEvent.change(searchInput, { target: { value: 'iPhone 15' } });

    // Before 400ms elapses, no query should include 'iPhone 15'
    expect(useProductsSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ q: 'iPhone 15' }),
    );

    await act(async () => {
      vi.advanceTimersByTime(450);
    });

    // After 400ms debounce, query fires with full debounced term
    expect(useProductsSpy).toHaveBeenCalledWith(
      expect.objectContaining({ q: 'iPhone 15' }),
    );
  });

  it('Header renders safely for guest visitors without loading admin bundles', () => {
    renderWithProviders(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    );

    expect(screen.getByText('تصفح الإعلانات')).toBeInTheDocument();
    expect(screen.getByText('دخول')).toBeInTheDocument();
    expect(screen.getByText('حساب جديد')).toBeInTheDocument();
    expect(screen.queryByText('لوحة الإدارة')).not.toBeInTheDocument();
  });
});
