import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import React from 'react';
import { ProductCard } from '../product-card';
import { renderWithProviders } from '@/test/test-utils';

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 'prod-123',
    title: 'iPhone 15 Pro Max 256GB Natural Titanium',
    price: 55000,
    condition: 'LIKE_NEW',
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    category: {
      name: 'موبايلات وتابلت',
      slug: 'mobiles-tablets',
    },
    media: [
      { url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product title, price, category, and condition correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText('iPhone 15 Pro Max 256GB Natural Titanium')).toBeInTheDocument();
    expect(screen.getByText('موبايلات وتابلت')).toBeInTheDocument();
    expect(screen.getByText('شبه جديد')).toBeInTheDocument();
    expect(screen.getByText(/55|٥٥/)).toBeInTheDocument();
    expect(screen.getByText('ج.م')).toBeInTheDocument();
  });

  it('renders link to product details page', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/prod-123');
  });

  it('renders fallback placeholder image when no media is provided', () => {
    const productWithoutMedia = {
      ...mockProduct,
      media: [],
    };

    renderWithProviders(<ProductCard product={productWithoutMedia} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', expect.stringContaining('placehold.co'));
  });
});
