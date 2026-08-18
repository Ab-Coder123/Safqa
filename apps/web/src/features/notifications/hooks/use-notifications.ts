'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { tokenStorage } from '@/lib/api';
import { notificationsApi } from '../api/notifications.api';

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: () => notificationsApi.getNotifications(),
    enabled: tokenStorage.hasToken(),
  });
}
