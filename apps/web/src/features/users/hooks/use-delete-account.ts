'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tokenStorage } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { usersApi } from '../api/users.api';

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => usersApi.deleteAccount(),
    onSuccess: () => {
      tokenStorage.clear();
      queryClient.clear();
      router.push('/');
    },
  });
}
