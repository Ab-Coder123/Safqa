import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '@/test/test-utils';
import { FavoritesView } from '../favorites-view';

// ── Mocks ──────────────────────────────────────────────────────────────────
vi.mock('@/features/favorites/hooks/use-favorites', () => ({
  useFavorites: vi.fn(),
}));

vi.mock('@/features/products/components/product-card', () => ({
  ProductCard: ({ product }: { product: any }) => (
    <div data-testid="product-card">{product.title}</div>
  ),
}));

import { useFavorites } from '@/features/favorites/hooks/use-favorites';

// ── Tests ──────────────────────────────────────────────────────────────────
describe('FavoritesView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton when loading', () => {
    (useFavorites as any).mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
      isRefetching: false,
    });

    const { container } = renderWithProviders(<FavoritesView />);
    // Skeleton items rendered via animate-pulse divs
    const pulseEls = container.querySelectorAll('.animate-pulse');
    expect(pulseEls.length).toBeGreaterThan(0);
  });

  it('renders empty state when no favorites', () => {
    (useFavorites as any).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isRefetching: false,
    });

    renderWithProviders(<FavoritesView />);
    expect(screen.getByText('قائمتك المفضلة فارغة حالياً')).toBeInTheDocument();
    expect(screen.getByText('استكشف الإعلانات الآن')).toBeInTheDocument();
  });

  it('renders error state on fetch failure', () => {
    (useFavorites as any).mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
      isRefetching: false,
    });

    renderWithProviders(<FavoritesView />);
    expect(screen.getByText('تعذر تحميل قائمة المفضلة')).toBeInTheDocument();
    expect(screen.getByText('إعادة المحاولة')).toBeInTheDocument();
  });

  it('renders favorite product cards when data is present', () => {
    const mockFavorites = [
      {
        id: 'fav-1',
        title: 'iPhone 15 Pro',
        price: 50000,
        condition: 'NEW',
        status: 'PUBLISHED',
        created_at: new Date().toISOString(),
        media: [{ url: '/uploads/iphone.jpg' }],
        favorited_at: new Date().toISOString(),
      },
      {
        id: 'fav-2',
        title: 'MacBook Air M3',
        price: 45000,
        condition: 'LIKE_NEW',
        status: 'PUBLISHED',
        created_at: new Date().toISOString(),
        media: [],
        favorited_at: new Date().toISOString(),
      },
    ];

    (useFavorites as any).mockReturnValue({
      data: mockFavorites,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isRefetching: false,
    });

    renderWithProviders(<FavoritesView />);
    const cards = screen.getAllByTestId('product-card');
    expect(cards).toHaveLength(2);
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.getByText('MacBook Air M3')).toBeInTheDocument();
  });

  it('shows correct favorites count badge', () => {
    (useFavorites as any).mockReturnValue({
      data: [
        { id: 'fav-1', title: 'Item 1', price: 100, condition: 'NEW', status: 'PUBLISHED', created_at: new Date().toISOString(), media: [] },
        { id: 'fav-2', title: 'Item 2', price: 200, condition: 'USED_GOOD', status: 'PUBLISHED', created_at: new Date().toISOString(), media: [] },
        { id: 'fav-3', title: 'Item 3', price: 300, condition: 'LIKE_NEW', status: 'PUBLISHED', created_at: new Date().toISOString(), media: [] },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isRefetching: false,
    });

    renderWithProviders(<FavoritesView />);
    expect(screen.getByText(/3\s+إعلانات/)).toBeInTheDocument();
  });
});
