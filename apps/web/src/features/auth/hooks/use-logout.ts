'use client';

import { useQueryClient } from '@tanstack/react-query';
import { tokenStorage } from '@/lib/api';

/**
 * useLogout Hook
 *
 * 1. Clears stored JWT access and refresh tokens from storage.
 * 2. Clears TanStack Query memory cache (removes all authenticated data).
 * 3. Hard-redirects to /login to ensure all React component state resets.
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    tokenStorage.clear();
    queryClient.clear();
    window.location.href = '/login';
  };
}
