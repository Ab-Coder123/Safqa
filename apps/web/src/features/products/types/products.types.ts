export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  condition: string;
  status: string;
  category_id?: string;
  user_id?: string;
  created_at: string;
  updated_at?: string;
  category?: { id?: string; name: string; slug?: string };
  media?: { id?: string; url: string; order?: number }[];
  user?: { id: string; full_name: string; email?: string; phone_number?: string; avatar_url?: string };
  is_favorited?: boolean;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  q?: string;
  category_id?: string;
  condition?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
}

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  category_id: string;
  condition: 'NEW' | 'LIKE_NEW' | 'USED_GOOD' | 'USED_FAIR';
  media_urls?: string[];
}
