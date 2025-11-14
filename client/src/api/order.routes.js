import axiosAuth from '../axios/axiosAuth';

export const getMyOrders = () => {
  return axiosAuth.get('/orders/my');
};

export const getAllOrders = () => {
  return axiosAuth.get('/orders');
};

export const updateOrderStatus = (orderId, status) => {
  return axiosAuth.put(`/orders/${orderId}/status`, { status });
};
