import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiPriceTag3Line, RiArrowRightLine } from 'react-icons/ri';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../ui/Button';

const VALID_COUPON = 'DRAPE10';

export default function CartSummary({ items }) {
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  const mrpTotal = items.reduce((s, i) => s + i.mrp * i.quantity, 0);
  const priceTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = mrpTotal - priceTotal;
  const couponDiscount = appliedCoupon ? Math.round(priceTotal * 0.1) : 0;
  const delivery = priceTotal > 499 ? 0 : 49;
  const grandTotal = priceTotal - couponDiscount + delivery;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === VALID_COUPON) {
      setAppliedCoupon(coupon.toUpperCase());
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    setCoupon('');
    setCouponError('');
  };

  return (
    <div className="bg-white border border-border rounded p-5 sticky top-20">
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Price Details</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-dark">Price ({items.length} items)</span>
          <span>{formatCurrency(mrpTotal)}</span>
        </div>
        <div className="flex justify-between text-success">
          <span>Discount</span>
          <span>− {formatCurrency(discount)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-success">
            <span>Coupon Discount</span>
            <span>− {formatCurrency(couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-dark">Delivery Charges</span>
          {delivery === 0
            ? <span className="text-success font-medium">FREE</span>
            : <span>{formatCurrency(delivery)}</span>}
        </div>
        <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
          <span>Total Amount</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      {discount > 0 && (
        <p className="text-success text-xs font-medium mt-3 bg-green-50 rounded px-3 py-2">
          🎉 You will save {formatCurrency(discount + couponDiscount)} on this order
        </p>
      )}

      {/* Coupon */}
      <div className="mt-4">
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
            <div className="flex items-center gap-2">
              <RiPriceTag3Line className="text-success" />
              <span className="text-xs font-medium text-success">{appliedCoupon} applied</span>
            </div>
            <button onClick={removeCoupon} className="text-xs text-muted hover:text-dark">Remove</button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponError(''); }}
                placeholder="Enter coupon code"
                className="input-field text-xs flex-1"
              />
              <button
                onClick={applyCoupon}
                className="text-sm font-semibold text-primary hover:text-primary-dark whitespace-nowrap"
              >Apply</button>
            </div>
            {couponError && <p className="text-xs text-primary mt-1">{couponError}</p>}
            <p className="text-xs text-muted mt-1">Try: <span className="font-mono font-medium text-dark">DRAPE10</span> for 10% off</p>
          </div>
        )}
      </div>

      <Button
        className="w-full mt-5"
        size="lg"
        onClick={() => navigate('/checkout')}
      >
        PLACE ORDER <RiArrowRightLine className="ml-2" size={16} />
      </Button>

      <p className="text-xs text-center text-muted mt-3 flex items-center justify-center gap-1">
        🔒 Safe and secure payments
      </p>
    </div>
  );
}
