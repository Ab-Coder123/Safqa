import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '@/test/test-utils';
import { ProfileView } from '../profile-view';

vi.mock('../../hooks/use-my-profile', () => ({
  useMyProfile: vi.fn(),
}));

import { useMyProfile } from '../../hooks/use-my-profile';

const mockProfile = {
  id: 'user-1',
  full_name: 'أحمد محمود',
  email: 'ahmed@example.com',
  phone_number: '01012345678',
  gender: 'MALE',
  role: 'USER',
  status: 'ACTIVE',
  created_at: new Date('2024-01-15').toISOString(),
  products: [
    {
      id: 'prod-1',
      title: 'آيفون 15 برو بحالة ممتازة',
      price: 45000,
      currency: 'EGP',
      status: 'PUBLISHED',
      created_at: new Date().toISOString(),
      category: { name: 'إلكترونيات', slug: 'electronics' },
      media: [],
    },
  ],
};

describe('ProfileView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton loading state when loading', () => {
    (useMyProfile as any).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    renderWithProviders(<ProfileView />);
    expect(screen.getByTestId('profile-skeleton')).toBeInTheDocument();
  });

  it('renders error state on fetch failure', () => {
    (useMyProfile as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });

    renderWithProviders(<ProfileView />);
    expect(screen.getByText('تعذر تحميل بيانات الملف الشخصي')).toBeInTheDocument();
    expect(screen.getByText('إعادة المحاولة')).toBeInTheDocument();
  });

  it('renders user profile details when loaded', () => {
    (useMyProfile as any).mockReturnValue({
      data: { user: mockProfile },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderWithProviders(<ProfileView />);
    expect(screen.getByText('أحمد محمود')).toBeInTheDocument();
    expect(screen.getByText('ahmed@example.com')).toBeInTheDocument();
    expect(screen.getByText('01012345678')).toBeInTheDocument();
    expect(screen.getByText('تعديل الملف')).toBeInTheDocument();
  });

  it('renders products and switches tabs', () => {
    (useMyProfile as any).mockReturnValue({
      data: { user: mockProfile },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderWithProviders(<ProfileView />);

    // Default tab is products
    expect(screen.getByText('آيفون 15 برو بحالة ممتازة')).toBeInTheDocument();

    // Click on info tab
    const infoTab = screen.getByText('المعلومات الشخصية');
    fireEvent.click(infoTab);

    // Basic info should be visible
    expect(screen.getByText('بيانات الحساب الشخصية')).toBeInTheDocument();
    expect(screen.getByText('نشط ومفعل')).toBeInTheDocument();
  });
});
