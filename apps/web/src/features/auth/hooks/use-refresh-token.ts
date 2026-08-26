'use client';

import { useMutation } from '@tanstack/react-query';
import { tokenStorage } from '@/lib/api';
import { authApi } from '../api/auth.api';

/**
 * useRefreshToken
 *
 * Wraps POST /auth/refresh.
 * On success → stores new tokens via tokenStorage.setTokens().
 * Used internally by the api-client 401 interceptor — rarely called directly by UI.
 */
export function useRefreshToken() {
  return useMutation({
    mutationFn: (refreshToken: string) => authApi.refresh(refreshToken),
    onSuccess: (data) => {
      tokenStorage.setTokens(data.tokens);
    },
  });
}
