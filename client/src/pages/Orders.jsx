import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { RiBox3Line, RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { fetchOrders, cancelOrder } from '../api/order.api';
import { formatCurrency } from '../utils/formatCurrency';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { showSuccess, showError } from '../utils/toastHelper';

const STATUS_BADGE = {
  Placed: 'warning',
  Packed: 'dark',
  Shipped: 'primary',
  Delivered: 'success',
  Cancelled: 'light',
};

const STATUS_STEPS = ['Placed', 'Packed', 'Shipped', 'Delivered'];

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const qc = useQueryClient();

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      await cancelOrder(order.id);
      showSuccess('Order cancelled');
      qc.invalidateQueries(['orders']);
    } catch (err) {
      showError(err?.response?.data?.error || 'Cannot cancel this order');
    }
    setCancelling(false);
  };

  const stepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="text-xs text-muted">Order #{order.id}</p>
          <p className="text-xs text-muted mt-0.5">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={STATUS_BADGE[order.status] || 'light'}>{order.status}</Badge>
          <span className="font-bold text-dark text-sm">{formatCurrency(order.total)}</span>
          <button onClick={() => setExpanded(!expanded)} className="text-muted hover:text-dark">
            {expanded ? <RiArrowUpSLine size={20} /> : <RiArrowDownSLine size={20} />}
          </button>
        </div>
      </div>

      {/* Quick preview */}
      {!expanded && (
        <div className="flex items-center gap-3 px-5 py-3">
          {order.items.slice(0, 3).map((item, i) => (
            <img key={i} src={item.image || '/placeholder.jpg'} alt={item.name} className="w-12 h-16 object-cover rounded" onError={e => e.target.src = '/placeholder.jpg'} />
          ))}
          {order.items.length > 3 && (
            <span className="text-xs text-muted">+{order.items.length - 3} more</span>
          )}
        </div>
      )}

      {/* Expanded */}
      {expanded && (
        <div className="px-5 py-4">
          {/* Progress bar */}
          {order.status !== 'Cancelled' && stepIdx >= 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-border rounded-full -z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-success rounded-full -z-0 transition-all duration-500"
                  style={{ width: `${(stepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                />
                {STATUS_STEPS.map((s, i) => (
                  <div key={s} className="flex flex-col items-center gap-1 z-10">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${i <= stepIdx ? 'bg-success border-success' : 'bg-white border-border'}`}>
                      {i <= stepIdx && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className={`text-xs ${i <= stepIdx ? 'text-success font-medium' : 'text-muted'}`}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="space-y-3 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3">
                <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-14 object-cover rounded flex-shrink-0" style={{ height: 72 }} onError={e => e.target.src = '/placeholder.jpg'} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-dark">{item.brand}</p>
                  <p className="text-xs text-muted truncate">{item.name}</p>
                  <p className="text-xs text-muted">Size: {item.size} | Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold text-dark">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Address */}
          <div className="bg-light rounded p-3 text-xs text-muted">
            <p className="font-semibold text-dark mb-1">Delivered to: {order.address?.name}</p>
            <p>{order.address?.line1}{order.address?.line2 ? `, ${order.address.line2}` : ''}</p>
            <p>{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
          </div>

          {/* Actions */}
          {order.status === 'Placed' && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="mt-3 text-xs font-medium text-primary hover:underline disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetchOrders().then(r => r.data),
  });

  const orders = data?.orders || [];

  if (isLoading) return <div className="flex justify-center items-center min-h-96"><Spinner size="lg" /></div>;

  if (!orders.length) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center animate-fade-in">
        <RiBox3Line size={80} className="text-border mx-auto mb-6" />
        <h2 className="font-display text-2xl font-semibold text-dark mb-2">No orders yet!</h2>
        <p className="text-muted text-sm mb-8">When you place an order, it will show up here.</p>
        <Link to="/products" className="btn-primary inline-block">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-2xl font-semibold text-dark mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => <OrderCard key={order.id} order={order} />)}
      </div>
    </div>
  );
}
