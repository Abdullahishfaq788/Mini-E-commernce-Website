import api from './api';

export const getCartApi = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCartApi = async (productId, quantity = 1) => {
  const response = await api.post('/cart', { productId, quantity });
  return response.data;
};

export const updateCartItemApi = async (id, quantity) => {
  const response = await api.put(`/cart/${id}`, { quantity });
  return response.data;
};

export const removeFromCartApi = async (id) => {
  const response = await api.delete(`/cart/${id}`);
  return response.data;
};
