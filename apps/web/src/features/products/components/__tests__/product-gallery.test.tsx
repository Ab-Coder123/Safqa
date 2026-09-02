import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ProductGallery } from '../product-gallery';
import { renderWithProviders } from '@/test/test-utils';

describe('ProductGallery Component', () => {
  const mockMedia = [
    { id: 'm-1', url: 'https://images.unsplash.com/photo-1.jpg', order: 0 },
    { id: 'm-2', url: 'https://images.unsplash.com/photo-2.jpg', order: 1 },
    { id: 'm-3', url: 'https://images.unsplash.com/photo-3.jpg', order: 2 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders main image and thumbnail buttons correctly', () => {
    renderWithProviders(
      <ProductGallery media={mockMedia} title="MacBook Pro M3 Max" />
    );

    const mainImg = screen.getByAltText(/MacBook Pro M3 Max - صورة 1/);
    expect(mainImg).toBeInTheDocument();
    expect(mainImg).toHaveAttribute('src', 'https://images.unsplash.com/photo-1.jpg');

    const thumbnails = screen.getAllByAltText(/Thumbnail/);
    expect(thumbnails).toHaveLength(3);
  });

  it('switches main image when clicking on a thumbnail', () => {
    renderWithProviders(
      <ProductGallery media={mockMedia} title="MacBook Pro M3 Max" />
    );

    const secondThumbnail = screen.getByAltText('Thumbnail 2');
    fireEvent.click(secondThumbnail);

    const updatedMainImg = screen.getByAltText(/MacBook Pro M3 Max - صورة 2/);
    expect(updatedMainImg).toHaveAttribute('src', 'https://images.unsplash.com/photo-2.jpg');
  });

  it('displays status badge when product is marked as SOLD', () => {
    renderWithProviders(
      <ProductGallery media={mockMedia} title="MacBook Pro M3 Max" status="SOLD" />
    );

    expect(screen.getByText('تم البيع')).toBeInTheDocument();
  });
});
