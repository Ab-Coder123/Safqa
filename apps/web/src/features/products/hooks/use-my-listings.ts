'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { productsApi } from '../api/products.api';

export function useMyListings() {
  return useQuery({
    queryKey: queryKeys.products.myListings(),
    queryFn: () => productsApi.getMyListings(),
  });
}
