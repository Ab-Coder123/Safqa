import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ProductImageUploader } from '../product-image-uploader';
import { renderWithProviders } from '@/test/test-utils';

describe('ProductImageUploader Component', () => {
  const mockImages = [
    'https://images.unsplash.com/photo-1.jpg',
    'https://images.unsplash.com/photo-2.jpg',
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders uploaded images and counter correctly', () => {
    const onChange = vi.fn();
    renderWithProviders(
      <ProductImageUploader images={mockImages} onChange={onChange} maxImages={5} />
    );

    expect(screen.getByText('2 / 5')).toBeInTheDocument();
    expect(screen.getByText('الرئيسية')).toBeInTheDocument();
    const imgs = screen.getAllByRole('img');
    expect(imgs).toHaveLength(2);
  });

  it('removes image when delete button is clicked', () => {
    const onChange = vi.fn();
    renderWithProviders(
      <ProductImageUploader images={mockImages} onChange={onChange} maxImages={5} />
    );

    const deleteButtons = screen.getAllByTitle('حذف الصورة');
    fireEvent.click(deleteButtons[0]);

    expect(onChange).toHaveBeenCalledWith(['https://images.unsplash.com/photo-2.jpg']);
  });

  it('allows adding image via URL', () => {
    const onChange = vi.fn();
    renderWithProviders(
      <ProductImageUploader images={mockImages} onChange={onChange} maxImages={5} />
    );

    const toggleUrlBtn = screen.getByText(/إضافة رابط صورة خارجي/);
    fireEvent.click(toggleUrlBtn);

    const input = screen.getByPlaceholderText('https://example.com/photo.jpg');
    fireEvent.change(input, {
      target: { value: 'https://images.unsplash.com/photo-3.jpg' },
    });

    const addBtn = screen.getByRole('button', { name: 'إضافة' });
    fireEvent.click(addBtn);

    expect(onChange).toHaveBeenCalledWith([
      'https://images.unsplash.com/photo-1.jpg',
      'https://images.unsplash.com/photo-2.jpg',
      'https://images.unsplash.com/photo-3.jpg',
    ]);
  });
});
