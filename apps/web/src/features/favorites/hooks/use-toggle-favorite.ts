'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { favoritesApi } from '../api/favorites.api';

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => favoritesApi.toggleFavorite(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}
