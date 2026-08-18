import { apiClient } from '@/lib/api';
import type { CreateProductInput, PaginatedProducts, Product, ProductFilters } from '../types/products.types';

export const productsApi = {
  getProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.category_id) params.set('category_id', filters.category_id);
    if (filters.condition && filters.condition !== 'ALL') params.set('condition', filters.condition);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));

    const queryString = params.toString();
    return apiClient<PaginatedProducts>(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getProductById(id: string): Promise<Product> {
    return apiClient<Product>(`/products/${id}`);
  },

  createProduct(input: CreateProductInput): Promise<Product> {
    return apiClient<Product>('/products', {
      method: 'POST',
      body: input,
      auth: true,
    });
  },

  getMyListings(): Promise<Product[]> {
    return apiClient<Product[]>('/products/me/listings', {
      method: 'GET',
      auth: true,
    });
  },

  markAsSold(id: string): Promise<Product> {
    return apiClient<Product>(`/products/${id}/sold`, {
      method: 'PATCH',
      auth: true,
    });
  },

  deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/products/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },
};
