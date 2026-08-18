import { apiClient } from '@/lib/api';
import type { Product } from '../../products/types/products.types';

export interface FavoriteItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: Product;
}

export interface ToggleFavoriteResponse {
  is_favorited: boolean;
  message: string;
}

export const favoritesApi = {
  getFavorites(): Promise<FavoriteItem[]> {
    return apiClient<FavoriteItem[]>('/favorites', {
      method: 'GET',
      auth: true,
    });
  },

  toggleFavorite(productId: string): Promise<ToggleFavoriteResponse> {
    return apiClient<ToggleFavoriteResponse>(`/favorites/${productId}/toggle`, {
      method: 'POST',
      auth: true,
    });
  },
};
