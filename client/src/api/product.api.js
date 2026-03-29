import axiosInstance from './axiosInstance';

export const fetchProducts = (params) => axiosInstance.get('/products', { params });
export const fetchFeaturedProducts = () => axiosInstance.get('/products/featured');
export const fetchCategories = () => axiosInstance.get('/products/categories');
export const fetchBrands = () => axiosInstance.get('/products/brands');
export const fetchProductById = (id) => axiosInstance.get(`/products/${id}`);
export const submitReview = (id, data) => axiosInstance.post(`/products/${id}/review`, data);
