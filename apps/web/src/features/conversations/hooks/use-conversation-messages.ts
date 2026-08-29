'use client';

import { useQuery } from '@tanstack/react-query';
import { conversationKeys } from '../query-keys';
import { tokenStorage } from '@/lib/api';
import { conversationsApi } from '../api/conversations.api';

export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn: () => conversationsApi.getMessages(conversationId),
    enabled: tokenStorage.hasToken() && !!conversationId,
    refetchInterval: 5000,
  });
}
