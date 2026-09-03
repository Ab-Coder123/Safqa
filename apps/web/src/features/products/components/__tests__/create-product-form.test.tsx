import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { CreateProductForm } from '../create-product-form';
import { renderWithProviders } from '@/test/test-utils';
import * as categoriesHook from '@/features/categories/hooks/use-categories';
import * as createProductHook from '@/features/products/hooks/use-create-product';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
  }),
}));

describe('CreateProductForm Component', () => {
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(categoriesHook, 'useCategories').mockReturnValue({
      data: [
        { id: 'cat-1', name: 'إلكترونيات', slug: 'electronics' },
        { id: 'cat-2', name: 'سيارات', slug: 'cars' },
      ],
      isLoading: false,
    } as any);

    vi.spyOn(createProductHook, 'useCreateProduct').mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);
  });

  it('renders all form fields, categories, conditions, and daily limit banner', () => {
    renderWithProviders(<CreateProductForm />);

    expect(screen.getByText('المعلومات الأساسية')).toBeInTheDocument();
    expect(screen.getByLabelText(/عنوان الإعلان/)).toBeInTheDocument();
    expect(screen.getByLabelText(/القسم/)).toBeInTheDocument();
    expect(screen.getByText('إلكترونيات')).toBeInTheDocument();
    expect(screen.getByText('جديد بالكامل')).toBeInTheDocument();
    expect(screen.getByText('مستعمل')).toBeInTheDocument();
    expect(screen.getByLabelText(/السعر المطلوب/)).toBeInTheDocument();
    expect(screen.getByLabelText(/رقم الواتساب/)).toBeInTheDocument();
    expect(screen.getByLabelText(/تفاصيل ووصف الإعلان/)).toBeInTheDocument();
    expect(screen.getByText(/حد النشر اليومي/)).toBeInTheDocument();
  });

  it('validates Egyptian WhatsApp phone number and shows error alert', async () => {
    renderWithProviders(<CreateProductForm />);

    const titleInput = screen.getByLabelText(/عنوان الإعلان/);
    const categorySelect = screen.getByLabelText(/القسم/);
    const priceInput = screen.getByLabelText(/السعر المطلوب/);
    const phoneInput = screen.getByLabelText(/رقم الواتساب/);
    const descInput = screen.getByLabelText(/تفاصيل ووصف الإعلان/);

    fireEvent.change(titleInput, { target: { value: 'لابتوب أبل ماك بوك برو M3' } });
    fireEvent.change(categorySelect, { target: { value: 'cat-1' } });
    fireEvent.change(priceInput, { target: { value: '65000' } });
    fireEvent.change(phoneInput, { target: { value: '12345678' } }); // Invalid phone
    fireEvent.change(descInput, {
      target: { value: 'هذا الوصف يحتوي على أكثر من عشرين حرفاً للتأكد من نجاح التحقق.' },
    });

    const submitBtn = screen.getByRole('button', { name: /نشر الإعلان الآن/ });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/رقم الواتساب يجب أن يكون رقماً مصرياً صحيحاً/)
      ).toBeInTheDocument();
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('submits valid form data and redirects to created product page', async () => {
    mockMutateAsync.mockResolvedValue({ id: 'prod-new-99' });

    renderWithProviders(<CreateProductForm />);

    const titleInput = screen.getByLabelText(/عنوان الإعلان/);
    const categorySelect = screen.getByLabelText(/القسم/);
    const priceInput = screen.getByLabelText(/السعر المطلوب/);
    const phoneInput = screen.getByLabelText(/رقم الواتساب/);
    const descInput = screen.getByLabelText(/تفاصيل ووصف الإعلان/);

    fireEvent.change(titleInput, { target: { value: 'لابتوب أبل ماك بوك برو M3' } });
    fireEvent.change(categorySelect, { target: { value: 'cat-1' } });
    fireEvent.change(priceInput, { target: { value: '65000' } });
    fireEvent.change(phoneInput, { target: { value: '01012345678' } });
    fireEvent.change(descInput, {
      target: { value: 'هذا الوصف يحتوي على أكثر من عشرين حرفاً للتأكد من نجاح التحقق.' },
    });

    const submitBtn = screen.getByRole('button', { name: /نشر الإعلان الآن/ });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        title: 'لابتوب أبل ماك بوك برو M3',
        description: 'هذا الوصف يحتوي على أكثر من عشرين حرفاً للتأكد من نجاح التحقق.',
        price: 65000,
        condition: 'USED',
        category_id: 'cat-1',
        whatsapp_number: '01012345678',
        media_urls: expect.any(Array),
      });
      expect(mockPush).toHaveBeenCalledWith('/products/prod-new-99');
    });
  });

  it('populates fields in edit mode and submits updates via useUpdateProduct', async () => {
    const mockUpdateAsync = vi.fn().mockResolvedValue({ id: 'prod-edit-1' });
    const updateProductHook = await import('@/features/products/hooks/use-update-product');
    vi.spyOn(updateProductHook, 'useUpdateProduct').mockReturnValue({
      mutateAsync: mockUpdateAsync,
      isPending: false,
    } as any);

    const initialData = {
      id: 'prod-edit-1',
      title: 'iPhone 15 Pro Max',
      description: 'Used for two months, in brand new condition with box.',
      price: 55000,
      condition: 'NEW',
      status: 'PUBLISHED',
      category_id: 'cat-1',
      created_at: new Date().toISOString(),
      whatsapp_number: '01123456789',
      media: [{ id: 'm1', url: 'https://example.com/iphone.jpg', order: 0 }],
    };

    renderWithProviders(<CreateProductForm mode="edit" initialData={initialData as any} />);

    expect(screen.getByDisplayValue('iPhone 15 Pro Max')).toBeInTheDocument();
    expect(screen.getByDisplayValue('55000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /حفظ التعديلات/ })).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/عنوان الإعلان/);
    fireEvent.change(titleInput, { target: { value: 'iPhone 15 Pro Max 256GB Titanium' } });

    const submitBtn = screen.getByRole('button', { name: /حفظ التعديلات/ });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUpdateAsync).toHaveBeenCalledWith({
        title: 'iPhone 15 Pro Max 256GB Titanium',
        description: 'Used for two months, in brand new condition with box.',
        price: 55000,
        condition: 'NEW',
        category_id: 'cat-1',
        whatsapp_number: '01123456789',
        media_urls: ['https://example.com/iphone.jpg'],
      });
      expect(mockPush).toHaveBeenCalledWith('/products/prod-edit-1');
    });
  });
});
