'use client';

import { useQuery } from '@tanstack/react-query';
import { productKeys } from '../query-keys';
import { productsApi } from '../api/products.api';

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id,
  });
}
