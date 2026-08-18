import { apiClient } from '@/lib/api';
import type { ICategory } from '@safqa/types';

export const categoriesApi = {
  getCategories(): Promise<ICategory[]> {
    return apiClient<ICategory[]>('/categories');
  },
};
