import { apiClient } from '@/lib/api';
import type {
  AuthResponse,
  CurrentUserResponse,
  LoginInput,
  RegisterInput,
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
};
