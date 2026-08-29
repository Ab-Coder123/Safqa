'use client';

import { useQuery } from '@tanstack/react-query';
import { userKeys } from '../query-keys';
import { usersApi } from '../api/users.api';

export function useUserProfile(id: string) {
  return useQuery({
    queryKey: userKeys.profile(id),
    queryFn: () => usersApi.getUserProfile(id),
    enabled: !!id,
  });
}
