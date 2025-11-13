import axiosAuth from "../axios/axiosAuth";

export const getCart = async () => {
  const res = await axiosAuth.get('/cart');
  return res.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await axiosAuth.post('/cart', { productId, quantity });
  return res.data;
};

export const updateCartItem = async (id, quantity) => {
  const res = await axiosAuth.put(`/cart/${id}`, { quantity });
  return res.data;
};

export const deleteCartItem = async (id) => {
  const res = await axiosAuth.delete(`/cart/${id}`);
  return res.data;
};
