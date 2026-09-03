'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productKeys } from '../query-keys';
import { productsApi } from '../api/products.api';
import type { CreateProductInput } from '../types/products.types';

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Partial<CreateProductInput>) => productsApi.updateProduct(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.myListings() });
    },
  });
}
