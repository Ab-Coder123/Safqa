import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '@/test/test-utils';
import { ConversationsInbox } from '../conversations-inbox';

// ── Mocks ──────────────────────────────────────────────────────────────────
vi.mock('@/features/conversations/hooks/use-conversations', () => ({
  useConversations: vi.fn(),
}));

import { useConversations } from '@/features/conversations/hooks/use-conversations';

const mockConversations = [
  {
    id: 'conv-1',
    product_id: 'prod-1',
    other_user: { id: 'u-1', full_name: 'أحمد محمود', avatar_url: null },
    product: { id: 'prod-1', title: 'آيفون 15 برو', price: 50000, status: 'PUBLISHED', media: [] },
    last_message: { id: 'm-1', content: 'هل السعر قابل للتفاوض؟', created_at: new Date().toISOString(), is_read: false, sender_id: 'u-1' },
    unread_count: 2,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'conv-2',
    product_id: 'prod-2',
    other_user: { id: 'u-2', full_name: 'سارة خالد', avatar_url: null },
    product: { id: 'prod-2', title: 'ماك بوك برو M2', price: 65000, status: 'PUBLISHED', media: [] },
    last_message: { id: 'm-2', content: 'تمام، نتقابل غداً بإذن الله', created_at: new Date().toISOString(), is_read: true, sender_id: 'u-2' },
    unread_count: 0,
    updated_at: new Date().toISOString(),
  },
];

describe('ConversationsInbox Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton when loading', () => {
    (useConversations as any).mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    });

    const { container } = renderWithProviders(<ConversationsInbox />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders empty state when no conversations exist', () => {
    (useConversations as any).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<ConversationsInbox />);
    expect(screen.getByText('لا توجد محادثات جارية بعد')).toBeInTheDocument();
    expect(screen.getByText('تصفح الإعلانات وتواصل مع البائعين')).toBeInTheDocument();
  });

  it('renders conversation cards with user names, product title, and messages', () => {
    (useConversations as any).mockReturnValue({
      data: mockConversations,
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<ConversationsInbox />);
    expect(screen.getByText('أحمد محمود')).toBeInTheDocument();
    expect(screen.getByText('آيفون 15 برو')).toBeInTheDocument();
    expect(screen.getByText('هل السعر قابل للتفاوض؟')).toBeInTheDocument();

    expect(screen.getByText('سارة خالد')).toBeInTheDocument();
    expect(screen.getByText('ماك بوك برو M2')).toBeInTheDocument();
    expect(screen.getByText('تمام، نتقابل غداً بإذن الله')).toBeInTheDocument();
  });

  it('shows unread badges correctly', () => {
    (useConversations as any).mockReturnValue({
      data: mockConversations,
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<ConversationsInbox />);
    expect(screen.getByText(/2 غير مقروء/)).toBeInTheDocument();
  });

  it('filters conversation list when searching', () => {
    (useConversations as any).mockReturnValue({
      data: mockConversations,
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<ConversationsInbox />);
    const searchInput = screen.getByPlaceholderText(/ابحث بالاسم أو اسم المنتج/);

    fireEvent.change(searchInput, { target: { value: 'سارة' } });

    expect(screen.getByText('سارة خالد')).toBeInTheDocument();
    expect(screen.queryByText('أحمد محمود')).not.toBeInTheDocument();
  });
});
