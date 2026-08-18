'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { tokenStorage } from '@/lib/api';
import { favoritesApi } from '../api/favorites.api';

export function useFavorites() {
  return useQuery({
    queryKey: queryKeys.favorites.list(),
    queryFn: () => favoritesApi.getFavorites(),
    enabled: tokenStorage.hasToken(),
  });
}
