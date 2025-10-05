import useSWR from 'swr';
import { productService } from '../services/productService';
import { ProductFilters } from '../types';

export const useProducts = (filters?: ProductFilters) => {
  const { data, error, mutate } = useSWR(
    ['/api/products', filters],
    () => productService.getProducts(filters),
    {
      onSuccess: (data) => {
        console.log('✅ Products loaded:', data);
      },
      onError: (err) => {
        console.error('❌ Error loading products:', err);
      },
    }
  );

  console.log('🔍 useProducts - data:', data, 'error:', error, 'filters:', filters);

  return {
    products: data?.products || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const useProduct = (productId: string | null) => {
  const { data, error } = useSWR(
    productId ? `/api/products/${productId}` : null,
    () => productId ? productService.getProductById(productId) : null
  );

  return {
    product: data?.product,
    isLoading: !error && !data,
    isError: error,
  };
};
