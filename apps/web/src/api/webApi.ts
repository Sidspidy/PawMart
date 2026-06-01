import { api } from './index';
import { adaptDbProduct, Product } from '../data/mockProducts';

export interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  petCategory: 'dogs' | 'cats' | 'fish' | 'birds' | 'small_pets';
  isActive: boolean;
  productCount: number;
}

/**
 * Fetch all active categories
 */
export const getCategories = async (petCategory?: string): Promise<CategoryData[]> => {
  try {
    const params: Record<string, string> = {};
    if (petCategory) params.petCategory = petCategory;
    
    const response = await api.get('/categories', { params });
    if (response.data?.success) {
      return response.data.data || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

/**
 * Fetch products list with dynamic query params
 */
export const getProducts = async (filters: {
  petCategory?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  q?: string;
  sort?: string;
  limit?: number;
  page?: number;
} = {}): Promise<{ products: Product[]; total: number; totalPages: number }> => {
  try {
    const params: Record<string, any> = {};
    if (filters.petCategory && filters.petCategory !== 'all') params.petCategory = filters.petCategory;
    if (filters.category && filters.category !== 'all') params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.isFeatured) params.isFeatured = filters.isFeatured;
    if (filters.q) params.q = filters.q;
    if (filters.sort) params.sort = filters.sort;
    if (filters.limit) params.limit = filters.limit;
    if (filters.page) params.page = filters.page;

    const response = await api.get('/products', { params });
    if (response.data?.success) {
      const dbProducts = response.data.data || [];
      const adapted = dbProducts.map((p: any) => adaptDbProduct(p));
      const pagination = response.data.pagination || {};
      return {
        products: adapted,
        total: pagination.total || adapted.length,
        totalPages: pagination.totalPages || 1
      };
    }
    return { products: [], total: 0, totalPages: 1 };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0, totalPages: 1 };
  }
};

/**
 * Fetch a single product details by slug
 */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const response = await api.get(`/products/${slug}`);
    if (response.data?.success && response.data.data) {
      return adaptDbProduct(response.data.data);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product by slug (${slug}):`, error);
    return null;
  }
};
