import { useCartStore } from '../store/cartStore';
import { showSuccess, showError } from '../utils/toastHelper';

export const useCart = () => {
  const store = useCartStore();

  const addItem = async (productId, size, color, quantity = 1) => {
    try {
      await store.addToCart(productId, size, color, quantity);
      showSuccess('Added to bag!');
    } catch (err) {
      showError(err?.response?.data?.error || 'Failed to add to bag');
    }
  };

  const updateItem = async (id, quantity) => {
    try {
      await store.updateItem(id, quantity);
    } catch {
      showError('Failed to update cart');
    }
  };

  const removeItem = async (id) => {
    try {
      await store.removeItem(id);
      showSuccess('Removed from bag');
    } catch {
      showError('Failed to remove item');
    }
  };

  const cartCount = store.items.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = store.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartMrp = store.items.reduce((s, i) => s + i.mrp * i.quantity, 0);

  return { ...store, addItem, updateItem, removeItem, cartCount, cartTotal, cartMrp };
};
