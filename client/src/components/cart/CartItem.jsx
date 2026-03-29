import { RiDeleteBinLine, RiHeartLine } from 'react-icons/ri';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

export default function CartItem({ item }) {
  const { updateItem, removeItem } = useCart();
  const { toggle } = useWishlist();

  const handleMoveToWishlist = async () => {
    await toggle(item.product_id);
    await removeItem(item.id);
  };

  return (
    <div className="flex gap-4 py-5 border-b border-border last:border-0">
      <img
        src={item.images?.[0] || '/placeholder.jpg'}
        alt={item.name}
        className="w-24 h-32 object-cover rounded flex-shrink-0"
        onError={e => e.target.src = '/placeholder.jpg'}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-dark uppercase tracking-wide">{item.brand}</p>
        <p className="text-sm text-muted mt-0.5 line-clamp-2">{item.name}</p>
        <div className="flex gap-3 text-xs text-muted mt-1">
          <span>Size: <span className="font-medium text-dark">{item.size}</span></span>
          <span>Color: <span className="font-medium text-dark">{item.color}</span></span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-dark">{formatCurrency(item.price)}</span>
          <span className="text-xs text-muted line-through">{formatCurrency(item.mrp)}</span>
          <span className="text-xs text-success font-medium">{item.discount_percent}% off</span>
        </div>
        {/* Quantity */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-border rounded">
            <button
              onClick={() => updateItem(item.id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-lg text-dark hover:bg-light transition-colors"
            >−</button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateItem(item.id, item.quantity + 1)}
              disabled={item.quantity >= (item.stock || 10)}
              className="w-8 h-8 flex items-center justify-center text-lg text-dark hover:bg-light transition-colors disabled:opacity-40"
            >+</button>
          </div>
          <button
            onClick={handleMoveToWishlist}
            className="text-xs text-muted hover:text-dark flex items-center gap-1 transition-colors"
          >
            <RiHeartLine size={14} /> Wishlist
          </button>
          <button
            onClick={() => removeItem(item.id)}
            className="text-xs text-muted hover:text-primary flex items-center gap-1 transition-colors"
          >
            <RiDeleteBinLine size={14} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}
