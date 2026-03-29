import axiosInstance from './axiosInstance';

export const fetchCart = () => axiosInstance.get('/cart');
export const addToCart = (data) => axiosInstance.post('/cart', data);
export const updateCartItem = (id, data) => axiosInstance.put(`/cart/${id}`, data);
export const removeFromCart = (id) => axiosInstance.delete(`/cart/${id}`);
export const clearCart = () => axiosInstance.delete('/cart/clear');
