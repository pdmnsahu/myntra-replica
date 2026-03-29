import axiosInstance from './axiosInstance';

export const fetchWishlist = () => axiosInstance.get('/wishlist');
export const fetchWishlistIds = () => axiosInstance.get('/wishlist/ids');
export const toggleWishlist = (productId) => axiosInstance.post('/wishlist', { productId });
