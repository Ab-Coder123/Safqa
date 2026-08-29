'use client';

import { useQuery } from '@tanstack/react-query';
import { categoryKeys } from '../query-keys';
import { categoriesApi } from '../api/categories.api';

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoriesApi.getCategories(),
  });
}
