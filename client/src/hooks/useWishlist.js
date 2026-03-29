import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { showSuccess, showError } from '../utils/toastHelper';
import { useNavigate } from 'react-router-dom';

export const useWishlist = () => {
  const store = useWishlistStore();
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const toggle = async (productId) => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const result = await store.toggle(productId);
      showSuccess(result.added ? 'Added to wishlist' : 'Removed from wishlist');
      return result;
    } catch (err) {
      showError(err?.response?.data?.error || 'Failed to update wishlist');
    }
  };

  return { ...store, toggle };
};
