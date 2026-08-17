'use client';

import { useQuery } from '@tanstack/react-query';
import { tokenStorage } from '@/lib/api';
import { queryKeys } from '@/lib/query';
import { authApi } from '../api/auth.api';

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authApi.me,
    enabled: !!tokenStorage.getAccessToken(),
  });
}
