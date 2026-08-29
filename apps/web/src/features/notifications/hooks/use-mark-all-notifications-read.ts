'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationKeys } from '../query-keys';
import { notificationsApi } from '../api/notifications.api';

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
}
