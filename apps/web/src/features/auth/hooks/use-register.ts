'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tokenStorage } from '@/lib/api';
import { authKeys } from '../query-keys';
import { authApi } from '../api/auth.api';
import type { RegisterInput } from '../types/auth.types';

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: (data) => {
      tokenStorage.setTokens(data.tokens);
      queryClient.setQueryData(authKeys.me(), { user: data.user });
    },
  });
}
