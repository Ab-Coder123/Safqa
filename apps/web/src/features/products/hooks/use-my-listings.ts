'use client';

import { useQuery } from '@tanstack/react-query';
import { productKeys } from '../query-keys';
import { productsApi } from '../api/products.api';

export function useMyListings() {
  return useQuery({
    queryKey: productKeys.myListings(),
    queryFn: () => productsApi.getMyListings(),
  });
}
