'use client';

import { useQuery } from '@tanstack/react-query';
import { conversationKeys } from '../query-keys';
import { tokenStorage } from '@/lib/api';
import { conversationsApi } from '../api/conversations.api';

export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: conversationKeys.detail(conversationId),
    queryFn: () => conversationsApi.getConversation(conversationId),
    enabled: !!conversationId && tokenStorage.hasToken(),
  });
}
