'use client';

import { useQuery } from '@tanstack/react-query';
import { conversationKeys } from '../query-keys';
import { tokenStorage } from '@/lib/api';
import { conversationsApi } from '../api/conversations.api';

export function useConversations() {
  return useQuery({
    queryKey: conversationKeys.list(),
    queryFn: () => conversationsApi.getConversations(),
    enabled: tokenStorage.hasToken(),
  });
}
