import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { SellerWorkspace } from '../seller-workspace';
import { renderWithProviders } from '@/test/test-utils';
import * as myListingsHook from '@/features/products/hooks/use-my-listings';
import * as markSoldHook from '@/features/products/hooks/use-mark-product-sold';
import * as deleteProductHook from '@/features/products/hooks/use-delete-product';
import type { Product } from '@/features/products/types/products.types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'iPhone 15 Pro Max',
    description: '256GB Natural Titanium in mint condition.',
    price: 52000,
    condition: 'NEW',
    status: 'PUBLISHED',
    category_id: 'cat-1',
    user_id: 'user-1',
    created_at: new Date('2026-08-01').toISOString(),
    category: { id: 'cat-1', name: 'إلكترونيات', slug: 'electronics' },
    media: [{ id: 'm1', url: 'https://example.com/iphone.jpg', order: 0 }],
  },
  {
    id: 'prod-2',
    title: 'MacBook Pro M2 16 inch',
    description: 'Space Gray 32GB RAM.',
    price: 75000,
    condition: 'USED',
    status: 'SOLD',
    category_id: 'cat-1',
    user_id: 'user-1',
    created_at: new Date('2026-07-20').toISOString(),
    category: { id: 'cat-1', name: 'إلكترونيات', slug: 'electronics' },
    media: [],
  },
  {
    id: 'prod-3',
    title: 'PlayStation 5 Console',
    description: 'Digital edition with two controllers.',
    price: 24000,
    condition: 'USED',
    status: 'ARCHIVED',
    category_id: 'cat-2',
    user_id: 'user-1',
    created_at: new Date('2026-06-15').toISOString(),
    category: { id: 'cat-2', name: 'ألعاب فيديو', slug: 'gaming' },
    media: [],
  },
];

describe('SellerWorkspace Component', () => {
  const mockMarkSoldMutateAsync = vi.fn();
  const mockDeleteMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(myListingsHook, 'useMyListings').mockReturnValue({
      data: MOCK_PRODUCTS,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    vi.spyOn(markSoldHook, 'useMarkProductSold').mockReturnValue({
      mutateAsync: mockMarkSoldMutateAsync,
      isPending: false,
    } as any);

    vi.spyOn(deleteProductHook, 'useDeleteProduct').mockReturnValue({
      mutateAsync: mockDeleteMutateAsync,
      isPending: false,
    } as any);
  });

  it('renders overview metrics cards with accurate counts', () => {
    renderWithProviders(<SellerWorkspace />);

    expect(screen.getByText('إعلاناتي المعروضة')).toBeInTheDocument();
    expect(screen.getByText('إجمالي الإعلانات')).toBeInTheDocument();
    expect(screen.getAllByText('3').length).toBeGreaterThan(0); // Total
    expect(screen.getByText('معروضة حالياً')).toBeInTheDocument();
    expect(screen.getAllByText('تم البيع').length).toBeGreaterThan(0);
    expect(screen.getAllByText('مؤرشفة').length).toBeGreaterThan(0);

    // Renders all items initially
    expect(screen.getByText('iPhone 15 Pro Max')).toBeInTheDocument();
    expect(screen.getByText('MacBook Pro M2 16 inch')).toBeInTheDocument();
    expect(screen.getByText('PlayStation 5 Console')).toBeInTheDocument();
  });

  it('filters items by status tabs', () => {
    renderWithProviders(<SellerWorkspace />);

    // Click 'المباعة' tab
    const soldTab = screen.getByRole('button', { name: /المباعة/ });
    fireEvent.click(soldTab);

    expect(screen.getByText('MacBook Pro M2 16 inch')).toBeInTheDocument();
    expect(screen.queryByText('iPhone 15 Pro Max')).not.toBeInTheDocument();
    expect(screen.queryByText('PlayStation 5 Console')).not.toBeInTheDocument();
  });

  it('filters items by search input', () => {
    renderWithProviders(<SellerWorkspace />);

    const searchInput = screen.getByPlaceholderText(/بحث في إعلاناتك/);
    fireEvent.change(searchInput, { target: { value: 'PlayStation' } });

    expect(screen.getByText('PlayStation 5 Console')).toBeInTheDocument();
    expect(screen.queryByText('iPhone 15 Pro Max')).not.toBeInTheDocument();
    expect(screen.queryByText('MacBook Pro M2 16 inch')).not.toBeInTheDocument();
  });

  it('handles "Mark as Sold" action trigger', async () => {
    mockMarkSoldMutateAsync.mockResolvedValue({});
    renderWithProviders(<SellerWorkspace />);

    const markSoldBtn = screen.getByTitle('تحديد الإعلان كـ مباع');
    fireEvent.click(markSoldBtn);

    await waitFor(() => {
      expect(mockMarkSoldMutateAsync).toHaveBeenCalledWith('prod-1');
    });
  });

  it('opens confirmation modal and confirms product archival (delete)', async () => {
    mockDeleteMutateAsync.mockResolvedValue({});
    renderWithProviders(<SellerWorkspace />);

    const archiveBtns = screen.getAllByTitle('أرشفة وحذف الإعلان');
    fireEvent.click(archiveBtns[0]); // click first archive button (on prod-1)

    // Modal should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('أرشفة الإعلان؟')).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /تأكيد الأرشفة/ });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockDeleteMutateAsync).toHaveBeenCalledWith('prod-1');
    });
  });

  it('renders global empty state when user has no listings', () => {
    vi.spyOn(myListingsHook, 'useMyListings').mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<SellerWorkspace />);

    expect(screen.getByText('لم تقم بنشر أي إعلانات بعد')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /نشر أول إعلان لك الآن/ })).toBeInTheDocument();
  });
});
