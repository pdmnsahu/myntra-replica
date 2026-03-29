import { create } from 'zustand';
import * as wishlistApi from '../api/wishlist.api';

export const useWishlistStore = create((set, get) => ({
  ids: [],

  fetchWishlistIds: async () => {
    try {
      const res = await wishlistApi.fetchWishlistIds();
      set({ ids: res.data.ids });
    } catch {}
  },

  toggle: async (productId) => {
    const res = await wishlistApi.toggleWishlist(productId);
    const { ids } = get();
    if (res.data.added) {
      set({ ids: [...ids, productId] });
    } else {
      set({ ids: ids.filter(id => id !== productId) });
    }
    return res.data;
  },

  isWishlisted: (productId) => get().ids.includes(productId),

  clearLocal: () => set({ ids: [] }),
}));
