import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import React from 'react';
import { ProductSellerCard } from '../product-seller-card';
import { renderWithProviders } from '@/test/test-utils';

describe('ProductSellerCard Component', () => {
  const mockUser = {
    id: 'usr-100',
    full_name: 'أحمد محمود',
    email: 'ahmed@safqa.com',
    phone_number: '01012345678',
    avatar_url: 'https://images.unsplash.com/avatar.jpg',
    created_at: new Date('2024-01-15').toISOString(),
    _count: { products: 5 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders seller information, active listings count, and verified badge', () => {
    renderWithProviders(
      <ProductSellerCard
        user={mockUser}
        productTitle="PlayStation 5 Slim 1TB"
        whatsappNumber="01012345678"
      />
    );

    expect(screen.getByText('أحمد محمود')).toBeInTheDocument();
    expect(screen.getByText('بائع موثوق')).toBeInTheDocument();
    expect(screen.getByText(/5 إعلان نشط/)).toBeInTheDocument();
    expect(screen.getByText('تواصل عبر الواتساب')).toBeInTheDocument();
  });

  it('formats WhatsApp link properly with Egyptian country code and pre-filled message', () => {
    renderWithProviders(
      <ProductSellerCard
        user={mockUser}
        productTitle="PlayStation 5 Slim 1TB"
        whatsappNumber="01012345678"
      />
    );

    const whatsappLink = screen.getByRole('link', { name: /تواصل عبر الواتساب/ });
    expect(whatsappLink).toHaveAttribute('href', expect.stringContaining('https://wa.me/201012345678'));
    expect(whatsappLink).toHaveAttribute('href', expect.stringContaining(encodeURIComponent('PlayStation 5 Slim 1TB')));
  });

  it('disables WhatsApp action when product is sold', () => {
    renderWithProviders(
      <ProductSellerCard
        user={mockUser}
        productTitle="PlayStation 5 Slim 1TB"
        whatsappNumber="01012345678"
        isSold={true}
      />
    );

    expect(screen.getByText('تم بيع الإعلان')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: 'تم بيع الإعلان' });
    expect(button).toBeDisabled();
  });
});
