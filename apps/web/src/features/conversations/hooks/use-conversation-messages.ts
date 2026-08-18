'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { tokenStorage } from '@/lib/api';
import { conversationsApi } from '../api/conversations.api';

export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: queryKeys.conversations.messages(conversationId),
    queryFn: () => conversationsApi.getMessages(conversationId),
    enabled: tokenStorage.hasToken() && !!conversationId,
    refetchInterval: 5000,
  });
}
