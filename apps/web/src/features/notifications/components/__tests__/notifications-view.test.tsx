import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '@/test/test-utils';
import { NotificationsView } from '../notifications-view';

// ── Mocks ──────────────────────────────────────────────────────────────────
vi.mock('@/features/notifications/hooks/use-notifications', () => ({
  useNotifications: vi.fn(),
}));
vi.mock('@/features/notifications/hooks/use-mark-notification-read', () => ({
  useMarkNotificationRead: vi.fn(),
}));
vi.mock('@/features/notifications/hooks/use-mark-all-notifications-read', () => ({
  useMarkAllNotificationsRead: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { useNotifications } from '@/features/notifications/hooks/use-notifications';
import { useMarkNotificationRead } from '@/features/notifications/hooks/use-mark-notification-read';
import { useMarkAllNotificationsRead } from '@/features/notifications/hooks/use-mark-all-notifications-read';

const mockMutate = vi.fn();
const defaultMutation = { mutate: mockMutate, isPending: false };

const mockNotifications = [
  {
    id: 'n-1',
    user_id: 'u-1',
    type: 'COMMENT',
    title: 'رسالة جديدة من أحمد',
    body: 'هل السعر قابل للتفاوض؟',
    is_read: false,
    action_url: '/conversations/conv-1',
    created_at: new Date().toISOString(),
  },
  {
    id: 'n-2',
    user_id: 'u-1',
    type: 'MODERATION',
    title: 'تنبيه إشراف',
    body: 'تم مراجعة إعلانك من قِبل الإدارة',
    is_read: true,
    action_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'n-3',
    user_id: 'u-1',
    type: 'SYSTEM',
    title: 'تحديث النظام',
    body: 'تم تحديث سياسات منصة صفقة',
    is_read: false,
    action_url: null,
    created_at: new Date().toISOString(),
  },
];

describe('NotificationsView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useMarkNotificationRead as any).mockReturnValue(defaultMutation);
    (useMarkAllNotificationsRead as any).mockReturnValue(defaultMutation);
  });

  it('renders loading skeleton when loading', () => {
    (useNotifications as any).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
      isRefetching: false,
    });

    const { container } = renderWithProviders(<NotificationsView />);
    const pulseEls = container.querySelectorAll('.animate-pulse');
    expect(pulseEls.length).toBeGreaterThan(0);
  });

  it('renders empty state when no notifications exist', () => {
    (useNotifications as any).mockReturnValue({
      data: { notifications: [], unread_count: 0 },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isRefetching: false,
    });

    renderWithProviders(<NotificationsView />);
    expect(screen.getByText('لا توجد إشعارات')).toBeInTheDocument();
  });

  it('renders error state on fetch failure', () => {
    (useNotifications as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
      isRefetching: false,
    });

    renderWithProviders(<NotificationsView />);
    expect(screen.getByText('تعذر تحميل الإشعارات')).toBeInTheDocument();
    expect(screen.getByText('إعادة المحاولة')).toBeInTheDocument();
  });

  it('renders all notification cards with correct titles', () => {
    (useNotifications as any).mockReturnValue({
      data: { notifications: mockNotifications, unread_count: 2 },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isRefetching: false,
    });

    renderWithProviders(<NotificationsView />);
    expect(screen.getByText('رسالة جديدة من أحمد')).toBeInTheDocument();
    expect(screen.getByText('تنبيه إشراف')).toBeInTheDocument();
    expect(screen.getByText('تحديث النظام')).toBeInTheDocument();
  });

  it('filters to unread only when clicking unread tab', () => {
    (useNotifications as any).mockReturnValue({
      data: { notifications: mockNotifications, unread_count: 2 },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isRefetching: false,
    });

    renderWithProviders(<NotificationsView />);

    // Click unread tab
    const unreadTab = screen.getByText(/غير المقروء/);
    fireEvent.click(unreadTab);

    // Only unread notifications should show
    expect(screen.getByText('رسالة جديدة من أحمد')).toBeInTheDocument();
    expect(screen.getByText('تحديث النظام')).toBeInTheDocument();
    // Read notification should be hidden
    expect(screen.queryByText('تنبيه إشراف')).not.toBeInTheDocument();
  });

  it('shows "mark all as read" button only when there are unread notifications', () => {
    (useNotifications as any).mockReturnValue({
      data: { notifications: mockNotifications, unread_count: 2 },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isRefetching: false,
    });

    renderWithProviders(<NotificationsView />);
    expect(screen.getByText('تحديد الكل كمقروء')).toBeInTheDocument();
  });

  it('does NOT show "mark all" button when unread_count is 0', () => {
    (useNotifications as any).mockReturnValue({
      data: {
        notifications: [{ ...mockNotifications[1] }], // only the read one
        unread_count: 0,
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isRefetching: false,
    });

    renderWithProviders(<NotificationsView />);
    expect(screen.queryByText('تحديد الكل كمقروء')).not.toBeInTheDocument();
  });
});
