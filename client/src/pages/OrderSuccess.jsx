import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchOrderById } from '../api/order.api';
import { formatCurrency } from '../utils/formatCurrency';

export default function OrderSuccess() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id).then(r => r.data),
  });

  const order = data?.order;
  const delivery = new Date();
  delivery.setDate(delivery.getDate() + 5);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center animate-fade-in">
      {/* Animated checkmark */}
      <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 relative">
        <svg viewBox="0 0 52 52" className="w-14 h-14">
          <circle cx="26" cy="26" r="25" fill="none" stroke="#03A685" strokeWidth="2"
            strokeDasharray="157" strokeDashoffset="0"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
          <path fill="none" stroke="#03A685" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            strokeDasharray="30" strokeDashoffset="0"
            style={{ transition: 'stroke-dashoffset 0.6s ease 0.3s' }}
          />
        </svg>
      </div>

      <h1 className="font-display text-3xl font-bold text-dark mb-2">Order Placed!</h1>
      <p className="text-muted mb-6">Your order has been confirmed and will be delivered soon.</p>

      {order && (
        <div className="bg-light border border-border rounded-lg p-5 text-left mb-8">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-muted">Order ID</span>
            <span className="font-mono font-semibold text-dark">#{order.id}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-muted">Total Amount</span>
            <span className="font-bold text-dark">{formatCurrency(order.total)}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-muted">Payment</span>
            <span className="text-dark">Cash on Delivery</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Estimated Delivery</span>
            <span className="text-dark font-medium">{delivery.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/" className="btn-primary flex-1 text-center py-3">Continue Shopping</Link>
        <Link to="/orders" className="btn-outline flex-1 text-center py-3">View My Orders</Link>
      </div>
    </div>
  );
}
