'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productKeys } from '../query-keys';
import { productsApi } from '../api/products.api';

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.myListings() });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
