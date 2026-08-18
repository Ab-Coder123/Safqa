'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { conversationsApi } from '../api/conversations.api';

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => conversationsApi.sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.messages(conversationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list() });
    },
  });
}
