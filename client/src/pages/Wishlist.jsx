import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { RiHeartLine, RiShoppingBagLine, RiDeleteBinLine } from 'react-icons/ri';
import { fetchWishlist } from '../api/wishlist.api';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';
import StarRating from '../components/ui/StarRating';
import Spinner from '../components/ui/Spinner';

export default function Wishlist() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => fetchWishlist().then(r => r.data),
  });
  const { toggle } = useWishlist();
  const { addItem } = useCart();

  const items = data?.items || [];

  const handleRemove = async (productId) => {
    await toggle(productId);
    qc.invalidateQueries(['wishlist']);
  };

  const handleMoveToBag = async (item) => {
    await addItem(item.product_id, item.sizes?.[0] || 'M', item.colors?.[0] || 'Default');
    await handleRemove(item.product_id);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-96"><Spinner size="lg" /></div>;
  }

  if (!items.length) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center animate-fade-in">
        <RiHeartLine size={80} className="text-border mx-auto mb-6" />
        <h2 className="font-display text-2xl font-semibold text-dark mb-2">Your wishlist is empty!</h2>
        <p className="text-muted text-sm mb-8">Save items you love and come back to them anytime.</p>
        <Link to="/products" className="btn-primary inline-block">Discover Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-2xl font-semibold text-dark mb-6">
        My Wishlist <span className="text-base font-normal text-muted font-body">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white border border-border rounded overflow-hidden group">
            <Link to={`/product/${item.product_id}`} className="block relative">
              <div className="aspect-[3/4] overflow-hidden bg-light">
                <img
                  src={item.images?.[0] || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => e.target.src = '/placeholder.jpg'}
                />
              </div>
              <button
                onClick={e => { e.preventDefault(); handleRemove(item.product_id); }}
                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-primary hover:text-white transition-colors"
              >
                <RiDeleteBinLine size={14} />
              </button>
            </Link>

            <div className="p-3">
              <p className="text-xs font-bold text-dark uppercase tracking-wide truncate">{item.brand}</p>
              <p className="text-xs text-muted truncate mt-0.5">{item.name}</p>
              <StarRating rating={item.rating} size={11} />
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm font-bold text-dark">{formatCurrency(item.price)}</span>
                <span className="text-xs text-muted line-through">{formatCurrency(item.mrp)}</span>
              </div>
              <button
                onClick={() => handleMoveToBag(item)}
                className="w-full mt-3 py-2 text-xs font-semibold border border-dark text-dark rounded hover:bg-dark hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <RiShoppingBagLine size={13} /> MOVE TO BAG
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
