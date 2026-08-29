'use client';

import { useQuery } from '@tanstack/react-query';
import { notificationKeys } from '../query-keys';
import { tokenStorage } from '@/lib/api';
import { notificationsApi } from '../api/notifications.api';

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => notificationsApi.getNotifications(),
    enabled: tokenStorage.hasToken(),
  });
}
