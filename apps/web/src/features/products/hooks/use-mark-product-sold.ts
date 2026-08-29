'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productKeys } from '../query-keys';
import { productsApi } from '../api/products.api';

export function useMarkProductSold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.markAsSold(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.myListings() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
