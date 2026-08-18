'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { productsApi } from '../api/products.api';

export function useMarkProductSold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.markAsSold(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.myListings() });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}
