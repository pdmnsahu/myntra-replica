import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiHeartLine, RiHeartFill, RiShoppingBagLine } from 'react-icons/ri';
import StarRating from '../ui/StarRating';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const isNew = (createdAt) => {
  const d = new Date(createdAt);
  return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
};

export default function ProductCard({ product }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [addingCart, setAddingCart] = useState(false);
  const { toggle, isWishlisted } = useWishlist();
  const { addItem } = useCart();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const wishlisted = isWishlisted(product.id);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) { navigate('/login'); return; }
    // If only one size, add directly, else go to product page
    if (product.sizes?.length === 1) {
      setAddingCart(true);
      await addItem(product.id, product.sizes[0], product.colors?.[0] || 'Default');
      setAddingCart(false);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggle(product.id);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block bg-white rounded-sm overflow-hidden card-hover">
      {/* Image */}
      <div
        className="relative overflow-hidden bg-light aspect-[4/5]"
        onMouseEnter={() => product.images?.length > 1 && setImgIdx(1)}
        onMouseLeave={() => setImgIdx(0)}
      >
        <img
          src={product.images?.[imgIdx] || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={e => { e.target.src = '/placeholder.jpg'; }}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew(product.created_at) && <Badge variant="dark">NEW</Badge>}
          {product.discount_percent >= 40 && (
            <Badge variant="primary">{product.discount_percent}% OFF</Badge>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          {wishlisted
            ? <RiHeartFill size={16} className="text-primary" />
            : <RiHeartLine size={16} className="text-dark" />}
        </button>

        {/* Quick add */}
        <button
          onClick={handleQuickAdd}
          disabled={addingCart}
          className="absolute bottom-0 left-0 right-0 bg-dark text-white text-xs font-medium py-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex items-center justify-center gap-2"
        >
          <RiShoppingBagLine size={14} />
          {addingCart ? 'Adding...' : 'ADD TO BAG'}
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs font-semibold text-dark uppercase tracking-wide truncate">{product.brand}</p>
        <p className="text-sm text-muted truncate mt-0.5">{product.name}</p>
        <StarRating rating={product.rating} count={product.review_count} size={12} />
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-bold text-dark">{formatCurrency(product.price)}</span>
          <span className="text-xs text-muted line-through">{formatCurrency(product.mrp)}</span>
          <span className="text-xs font-semibold text-success">({product.discount_percent}% off)</span>
        </div>
      </div>
    </Link>
  );
}
