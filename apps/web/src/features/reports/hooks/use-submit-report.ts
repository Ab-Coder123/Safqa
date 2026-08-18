'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { reportsApi, type CreateReportInput } from '../api/reports.api';

export function useSubmitReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReportInput) => reportsApi.createReport(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reports() });
    },
  });
}
