'use client';

import { useQuery } from '@tanstack/react-query';
import { favoriteKeys } from '../query-keys';
import { tokenStorage } from '@/lib/api';
import { favoritesApi } from '../api/favorites.api';

export function useFavorites() {
  return useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: () => favoritesApi.getFavorites(),
    enabled: tokenStorage.hasToken(),
  });
}
