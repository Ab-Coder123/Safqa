'use client';

import { useQuery } from '@tanstack/react-query';
import { userKeys } from '../query-keys';
import { tokenStorage } from '@/lib/api';
import { usersApi } from '../api/users.api';

export function useMyProfile() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => usersApi.getMyProfile(),
    enabled: tokenStorage.hasToken(),
  });
}
