'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteKeys } from '../query-keys';
import { productKeys } from '@/features/products/query-keys';
import { favoritesApi } from '../api/favorites.api';

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => favoritesApi.toggleFavorite(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
