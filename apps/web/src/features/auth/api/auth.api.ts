import { apiClient } from '@/lib/api';
import type {
  AuthResponse,
  CurrentUserResponse,
  LoginInput,
  RegisterInput,
  RefreshResponse,
} from '../types/auth.types';

export const authApi = {
  register(input: RegisterInput) {
    return apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: input,
    });
  },

  login(input: LoginInput) {
    return apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: input,
    });
  },

  me() {
    return apiClient<CurrentUserResponse>('/auth/me', {
      method: 'GET',
      auth: true,
    });

  },

  refresh(refreshToken: string) {
    return apiClient<RefreshResponse>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    });
  },

  forgotPassword(email: string) {
    return apiClient<{ message: string; debug_code?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  },

  verifyOtp(email: string, code: string) {
    return apiClient<{ message: string; verified: boolean }>('/auth/verify-otp', {
      method: 'POST',
      body: { email, code },
    });
  },

  resetPassword(email: string, code: string, new_password: string) {
    return apiClient<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: { email, code, new_password },
    });
  },
};


