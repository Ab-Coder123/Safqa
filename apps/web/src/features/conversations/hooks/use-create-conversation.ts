'use client';

import { useMutation } from '@tanstack/react-query';
import { conversationsApi } from '../api/conversations.api';

export function useCreateConversation() {
    return useMutation({
        mutationFn: ({ productId }: { productId: string }) =>
            conversationsApi.createConversation({ productId }),
    });
}
