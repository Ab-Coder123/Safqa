import { apiClient } from '@/lib/api';

export interface SystemStats {
  total_users: number;
  total_products: number;
  pending_reports: number;
  total_categories: number;
}

export interface AdminReportItem {
  id: string;
  target_type: string;
  target_id: string;
  reason: string;
  status: string;
  created_at: string;
  reporter: { full_name: string; email: string };
}

export interface AdminUserItem {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  created_at: string;
  _count: { products: number };
}

export const adminApi = {
  getStats(): Promise<SystemStats> {
    return apiClient<SystemStats>('/admin/stats', {
      method: 'GET',
      auth: true,
    });
  },

  getReports(): Promise<AdminReportItem[]> {
    return apiClient<AdminReportItem[]>('/reports', {
      method: 'GET',
      auth: true,
    });
  },

  getUsers(): Promise<AdminUserItem[]> {
    return apiClient<AdminUserItem[]>('/admin/users', {
      method: 'GET',
      auth: true,
    });
  },

  resolveReport(id: string, reason: string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/reports/${id}/resolve`, {
      method: 'PATCH',
      body: { reason },
      auth: true,
    });
  },

  dismissReport(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/reports/${id}/dismiss`, {
      method: 'PATCH',
      auth: true,
    });
  },

  suspendUser(id: string, reason: string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/admin/users/${id}/suspend`, {
      method: 'PATCH',
      body: { reason },
      auth: true,
    });
  },

  activateUser(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/admin/users/${id}/activate`, {
      method: 'PATCH',
      auth: true,
    });
  },
};
