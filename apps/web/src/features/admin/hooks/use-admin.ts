'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { adminApi } from '../api/admin.api';

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.stats(),
    queryFn: () => adminApi.getStats(),
  });
}

export function useAdminReports() {
  return useQuery({
    queryKey: queryKeys.admin.reports(),
    queryFn: () => adminApi.getReports(),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.admin.users(),
    queryFn: () => adminApi.getUsers(),
  });
}

export function useResolveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminApi.resolveReport(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reports() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
    },
  });
}

export function useDismissReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.dismissReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reports() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
    },
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminApi.suspendUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
    },
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
    },
  });
}
