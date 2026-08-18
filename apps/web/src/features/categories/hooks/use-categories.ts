'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { categoriesApi } from '../api/categories.api';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => categoriesApi.getCategories(),
  });
}
