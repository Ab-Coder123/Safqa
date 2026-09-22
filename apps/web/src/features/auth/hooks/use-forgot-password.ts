'use client';

import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';

export function useForgotPassword() {
  const sendOtpMutation = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      authApi.verifyOtp(email, code),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({
      email,
      code,
      new_password,
    }: {
      email: string;
      code: string;
      new_password: string;
    }) => authApi.resetPassword(email, code, new_password),
  });

  return {
    sendOtpMutation,
    verifyOtpMutation,
    resetPasswordMutation,
  };
}
