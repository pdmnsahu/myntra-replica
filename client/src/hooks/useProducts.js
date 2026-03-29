import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchFeaturedProducts, fetchCategories, fetchProductById, fetchBrands } from '../api/product.api';

export const useProducts = (params) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params).then(r => r.data),
    keepPreviousData: true,
  });

export const useFeaturedProducts = () =>
  useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => fetchFeaturedProducts().then(r => r.data),
  });

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories().then(r => r.data),
    staleTime: Infinity,
  });

export const useBrands = () =>
  useQuery({
    queryKey: ['brands'],
    queryFn: () => fetchBrands().then(r => r.data),
    staleTime: Infinity,
  });

export const useProduct = (id) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id).then(r => r.data),
    enabled: !!id,
  });
