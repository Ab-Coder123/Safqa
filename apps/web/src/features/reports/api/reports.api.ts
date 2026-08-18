import { apiClient } from '@/lib/api';

export interface CreateReportInput {
  target_type: 'PRODUCT' | 'USER' | 'MESSAGE';
  target_id: string;
  reason: string;
}

export interface ReportItem {
  id: string;
  reporter_id: string;
  target_type: string;
  target_id: string;
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  created_at: string;
  reporter?: { full_name: string; email: string };
}

export const reportsApi = {
  createReport(input: CreateReportInput): Promise<ReportItem> {
    return apiClient<ReportItem>('/reports', {
      method: 'POST',
      body: input,
      auth: true,
    });
  },
};
