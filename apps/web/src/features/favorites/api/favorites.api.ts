import { apiClient } from '@/lib/api';
import type { Product } from '../../products/types/products.types';

export type FavoriteProduct = Product & {
  favorited_at?: string;
  product?: Product;
};

export interface ToggleFavoriteResponse {
  is_favorited: boolean;
  message: string;
}

export const favoritesApi = {
  getFavorites(): Promise<FavoriteProduct[]> {
    return apiClient<FavoriteProduct[]>('/favorites', {
      method: 'GET',
      auth: true,
    });
  },

  toggleFavorite(productId: string): Promise<ToggleFavoriteResponse> {
    return apiClient<ToggleFavoriteResponse>(`/favorites/toggle/${productId}`, {
      method: 'POST',
      auth: true,
    });
  },
};
