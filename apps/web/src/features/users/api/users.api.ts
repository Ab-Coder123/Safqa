import { apiClient } from '@/lib/api';
import type { IUser } from '@safqa/types';
import type { Product } from '../../products/types/products.types';

export interface UserProfileResponse {
  user: IUser & {
    products?: Product[];
    _count?: {
      products: number;
    };
  };
}

export interface ChangePasswordInput {
  oldPassword?: string;
  newPassword?: string;
  current_password?: string;
  new_password?: string;
}

export const usersApi = {
  getUserProfile(id: string): Promise<UserProfileResponse> {
    return apiClient<UserProfileResponse>(`/users/${id}/profile`);
  },

  getMyProfile(): Promise<UserProfileResponse> {
    return apiClient<UserProfileResponse>('/users/me/profile', {
      method: 'GET',
      auth: true,
    });
  },

  changePassword(input: ChangePasswordInput): Promise<{ message: string }> {
    return apiClient<{ message: string }>('/users/me/change-password', {
      method: 'PATCH',
      body: input,
      auth: true,
    });
  },

  deleteAccount(): Promise<{ message: string }> {
    return apiClient<{ message: string }>('/users/me', {
      method: 'DELETE',
      auth: true,
    });
  },
};
