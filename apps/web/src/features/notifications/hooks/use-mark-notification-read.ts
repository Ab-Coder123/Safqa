'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationKeys } from '../query-keys';
import { notificationsApi } from '../api/notifications.api';

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
}
