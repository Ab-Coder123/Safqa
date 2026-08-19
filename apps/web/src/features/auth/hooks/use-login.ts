import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { tokenStorage } from '@/lib/api';
import type { LoginInput } from '../types/auth.types';

export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (data) => {
      tokenStorage.setTokens(data.tokens);
    },
  });
}
