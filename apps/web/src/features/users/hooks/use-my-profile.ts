'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { tokenStorage } from '@/lib/api';
import { usersApi } from '../api/users.api';

export function useMyProfile() {
  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: () => usersApi.getMyProfile(),
    enabled: tokenStorage.hasToken(),
  });
}
