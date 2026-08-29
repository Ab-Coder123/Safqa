import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import React from 'react';
import { AuthGuard } from '../auth-guard';
import { renderWithProviders } from '@/test/test-utils';
import { tokenStorage } from '@/lib/api';
import * as useCurrentUserModule from '../../hooks/use-current-user';
import { UserRole, UserStatus } from '@safqa/types';

describe('AuthGuard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders redirect skeleton when user has no token in storage', () => {
    vi.spyOn(tokenStorage, 'hasToken').mockReturnValue(false);
    vi.spyOn(useCurrentUserModule, 'useCurrentUser').mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    } as any);

    renderWithProviders(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('جاري إعادة التوجيه لتسجيل الدخول...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders loading skeleton when fetching user session', () => {
    vi.spyOn(tokenStorage, 'hasToken').mockReturnValue(true);
    vi.spyOn(useCurrentUserModule, 'useCurrentUser').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    const { container } = renderWithProviders(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders 403 Forbidden screen when requiredRole is SUPER_ADMIN but user is regular USER', () => {
    vi.spyOn(tokenStorage, 'hasToken').mockReturnValue(true);
    vi.spyOn(useCurrentUserModule, 'useCurrentUser').mockReturnValue({
      data: {
        user: {
          id: 'user-1',
          email: 'user@safqa.com',
          full_name: 'Regular User',
          phone_number: '01000000000',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      isLoading: false,
      isError: false,
    } as any);

    renderWithProviders(
      <AuthGuard requiredRole={UserRole.SUPER_ADMIN}>
        <div>Admin Only Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('غير مصرح لك بالدخول')).toBeInTheDocument();
    expect(screen.getByText('هذه الصفحة مخصصة لمديري النظام ومشرفي المنصة فقط.')).toBeInTheDocument();
    expect(screen.queryByText('Admin Only Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated and authorized', () => {
    vi.spyOn(tokenStorage, 'hasToken').mockReturnValue(true);
    vi.spyOn(useCurrentUserModule, 'useCurrentUser').mockReturnValue({
      data: {
        user: {
          id: 'admin-1',
          email: 'admin@safqa.com',
          full_name: 'Super Admin',
          phone_number: '01000000000',
          role: UserRole.SUPER_ADMIN,
          status: UserStatus.ACTIVE,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      isLoading: false,
      isError: false,
    } as any);

    renderWithProviders(
      <AuthGuard requiredRole={UserRole.SUPER_ADMIN}>
        <div>Admin Dashboard Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Admin Dashboard Content')).toBeInTheDocument();
  });
});
