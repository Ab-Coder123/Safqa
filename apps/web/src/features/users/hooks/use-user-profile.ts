'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { usersApi } from '../api/users.api';

export function useUserProfile(id: string) {
  return useQuery({
    queryKey: queryKeys.users.profile(id),
    queryFn: () => usersApi.getUserProfile(id),
    enabled: !!id,
  });
}
