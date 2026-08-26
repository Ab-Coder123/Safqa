import { apiClient } from '@/lib/api';

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  unread_count: number;
}

export const notificationsApi = {
  getNotifications(): Promise<NotificationsResponse> {
    return apiClient<NotificationsResponse>('/notifications', {
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

  markAllAsRead(): Promise<{ message: string }> {
    return apiClient<{ message: string }>('/notifications/read-all', {
      method: 'PATCH',
      auth: true,
    });
  },
};
