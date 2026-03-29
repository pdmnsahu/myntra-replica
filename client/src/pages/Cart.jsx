import { Link } from 'react-router-dom';
import { RiShoppingBagLine } from 'react-icons/ri';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { useCartStore } from '../store/cartStore';
import Spinner from '../components/ui/Spinner';

export default function Cart() {
  const { items, loading } = useCartStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center animate-fade-in">
        <RiShoppingBagLine size={80} className="text-border mx-auto mb-6" />
        <h2 className="font-display text-2xl font-semibold text-dark mb-2">Your bag is empty!</h2>
        <p className="text-muted text-sm mb-8">Looks like you haven't added anything to your bag yet.</p>
        <Link to="/products" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-2xl font-semibold text-dark mb-6">
        My Bag <span className="text-base font-normal text-muted font-body">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 bg-white border border-border rounded p-5">
          {items.map(item => <CartItem key={item.id} item={item} />)}
        </div>

        {/* Summary */}
        <div className="lg:w-80 xl:w-96 flex-shrink-0">
          <CartSummary items={items} />
        </div>
      </div>
    </div>
  );
}
