'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationKeys } from '../query-keys';
import { conversationsApi } from '../api/conversations.api';

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => conversationsApi.sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.messages(conversationId) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
    },
  });
}
