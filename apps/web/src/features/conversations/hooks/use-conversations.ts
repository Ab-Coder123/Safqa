'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { tokenStorage } from '@/lib/api';
import { conversationsApi } from '../api/conversations.api';

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations.list(),
    queryFn: () => conversationsApi.getConversations(),
    enabled: tokenStorage.hasToken(),
  });
}
