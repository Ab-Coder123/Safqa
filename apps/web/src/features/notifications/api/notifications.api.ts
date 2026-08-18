import { apiClient } from '@/lib/api';

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export const notificationsApi = {
  getNotifications(): Promise<NotificationItem[]> {
    return apiClient<NotificationItem[]>('/notifications', {
      method: 'GET',
      auth: true,
    });
  },

  markAsRead(id: string): Promise<NotificationItem> {
    return apiClient<NotificationItem>(`/notifications/${id}/read`, {
      method: 'PATCH',
      auth: true,
    });
  },

  markAllAsRead(): Promise<{ success: boolean; count: number }> {
    return apiClient<{ success: boolean; count: number }>('/notifications/read-all', {
      method: 'PATCH',
      auth: true,
    });
  },
};
