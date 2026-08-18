'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { usersApi, type ChangePasswordInput } from '../api/users.api';

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ChangePasswordInput) => usersApi.changePassword(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
    },
  });
}
