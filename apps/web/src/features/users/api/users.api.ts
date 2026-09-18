import { apiClient } from '@/lib/api';
import type { UpdateProfileInput, UserProfileResponse } from '../types/users.types';

export type { UserProfileResponse };

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

  updateProfile(input: UpdateProfileInput): Promise<UserProfileResponse> {
    return apiClient<UserProfileResponse>('/users/me/profile', {
      method: 'PATCH',
      body: input,
      auth: true,
    });
  },

  uploadAvatar(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient<{ url: string; filename: string }>('/media/upload', {
      method: 'POST',
      body: formData,
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
