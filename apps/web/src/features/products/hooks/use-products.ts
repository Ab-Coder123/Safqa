'use client';

import { useQuery } from '@tanstack/react-query';
import { productKeys } from '../query-keys';
import { productsApi } from '../api/products.api';
import type { ProductFilters } from '../types/products.types';

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: productKeys.list(filters as Record<string, unknown>),
    queryFn: () => productsApi.getProducts(filters),
  });
}
