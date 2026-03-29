import axiosInstance from './axiosInstance';

export const fetchOrders = () => axiosInstance.get('/orders');
export const createOrder = (data) => axiosInstance.post('/orders', data);
export const fetchOrderById = (id) => axiosInstance.get(`/orders/${id}`);
export const cancelOrder = (id) => axiosInstance.put(`/orders/${id}/cancel`);
