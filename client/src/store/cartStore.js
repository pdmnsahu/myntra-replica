import { create } from 'zustand';
import * as cartApi from '../api/cart.api';

export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await cartApi.fetchCart();
      set({ items: res.data.items });
    } catch {}
    finally { set({ loading: false }); }
  },

  addToCart: async (productId, size, color, quantity = 1) => {
    await cartApi.addToCart({ productId, size, color, quantity });
    await get().fetchCart();
  },

  updateItem: async (id, quantity) => {
    await cartApi.updateCartItem(id, { quantity });
    await get().fetchCart();
  },

  removeItem: async (id) => {
    await cartApi.removeFromCart(id);
    await get().fetchCart();
  },

  clearCart: async () => {
    await cartApi.clearCart();
    set({ items: [] });
  },

  clearLocal: () => set({ items: [] }),

  get count() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  get total() {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}));
