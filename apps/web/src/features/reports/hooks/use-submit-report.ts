'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportKeys } from '../query-keys';
import { adminKeys } from '@/features/admin/query-keys';
import { reportsApi, type CreateReportInput } from '../api/reports.api';

export function useSubmitReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReportInput) => reportsApi.createReport(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.list() });
      queryClient.invalidateQueries({ queryKey: adminKeys.reports() });
    },
  });
}
