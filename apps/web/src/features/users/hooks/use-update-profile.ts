'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userKeys } from '../query-keys';
import { authKeys } from '@/features/auth/query-keys';
import { usersApi } from '../api/users.api';
import type { UpdateProfileInput } from '../types/users.types';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => usersApi.updateProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}
