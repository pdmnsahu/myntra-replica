import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiCheckLine, RiMapPinLine, RiBankCard2Line, RiListCheck } from 'react-icons/ri';
import { useCartStore } from '../store/cartStore';
import { createOrder } from '../api/order.api';
import { formatCurrency } from '../utils/formatCurrency';
import Button from '../components/ui/Button';
import { showError } from '../utils/toastHelper';

const STEPS = [
  { id: 1, label: 'Address', icon: RiMapPinLine },
  { id: 2, label: 'Payment', icon: RiBankCard2Line },
  { id: 3, label: 'Review', icon: RiListCheck },
];

const INDIAN_STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'];

const emptyAddress = { name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${current === step.id ? 'bg-dark text-white' : current > step.id ? 'bg-success text-white' : 'bg-light text-muted'}`}>
            {current > step.id ? <RiCheckLine size={16} /> : <step.icon size={16} />}
            <span className="hidden sm:inline">{step.label}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`w-8 h-0.5 mx-1 ${current > step.id + 1 ? 'bg-success' : 'bg-border'}`} />}
        </div>
      ))}
    </div>
  );
}

function AddressForm({ address, onChange, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!address.name.trim()) e.name = 'Name is required';
    if (!address.phone.match(/^\d{10}$/)) e.phone = 'Enter valid 10-digit number';
    if (!address.line1.trim()) e.line1 = 'Address is required';
    if (!address.city.trim()) e.city = 'City is required';
    if (!address.state) e.state = 'State is required';
    if (!address.pincode.match(/^\d{6}$/)) e.pincode = 'Enter valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-semibold text-dark mb-1">{label}</label>
      <input
        type={type}
        value={address[key]}
        onChange={e => onChange({ ...address, [key]: e.target.value })}
        placeholder={placeholder}
        className={`input-field ${errors[key] ? 'border-primary' : ''}`}
      />
      {errors[key] && <p className="text-xs text-primary mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-dark mb-6">Delivery Address</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('name', 'Full Name', 'text', 'Enter your full name')}
        {field('phone', 'Phone Number', 'tel', '10-digit mobile number')}
        <div className="sm:col-span-2">{field('line1', 'Address Line 1', 'text', 'House/Flat no., Street name')}</div>
        <div className="sm:col-span-2">{field('line2', 'Address Line 2 (optional)', 'text', 'Area, Locality, Landmark')}</div>
        {field('city', 'City', 'text', 'Enter your city')}
        <div>
          <label className="block text-xs font-semibold text-dark mb-1">State</label>
          <select value={address.state} onChange={e => onChange({ ...address, state: e.target.value })} className={`input-field ${errors.state ? 'border-primary' : ''}`}>
            <option value="">Select State</option>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <p className="text-xs text-primary mt-1">{errors.state}</p>}
        </div>
        {field('pincode', 'Pincode', 'text', '6-digit pincode')}
      </div>
      <Button onClick={handleNext} size="lg" className="mt-6 w-full sm:w-auto">Continue to Payment →</Button>
    </div>
  );
}

function PaymentStep({ onNext, onBack }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-dark mb-6">Payment Method</h2>
      <div className="space-y-3 max-w-md">
        <label className="flex items-center gap-4 p-4 border-2 border-dark rounded cursor-pointer bg-dark/5">
          <input type="radio" name="payment" defaultChecked className="accent-dark" />
          <div>
            <p className="font-semibold text-dark text-sm">Cash on Delivery</p>
            <p className="text-xs text-muted mt-0.5">Pay when your order arrives</p>
          </div>
          <span className="ml-auto text-xs font-medium bg-success text-white px-2 py-0.5 rounded">Available</span>
        </label>
        {['Credit / Debit Card', 'UPI / Wallets', 'Net Banking'].map(method => (
          <label key={method} className="flex items-center gap-4 p-4 border border-border rounded cursor-not-allowed opacity-50">
            <input type="radio" name="payment" disabled className="accent-dark" />
            <div>
              <p className="font-semibold text-dark text-sm">{method}</p>
              <p className="text-xs text-muted mt-0.5">Coming soon</p>
            </div>
            <span className="ml-auto text-xs font-medium bg-light text-muted px-2 py-0.5 rounded">Soon</span>
          </label>
        ))}
      </div>
      <div className="flex gap-3 mt-6">
        <Button variant="ghost" onClick={onBack} className="border border-border">← Back</Button>
        <Button onClick={onNext} size="lg">Review Order →</Button>
      </div>
    </div>
  );
}

function ReviewStep({ items, address, onPlace, onBack, placing }) {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const mrp = items.reduce((s, i) => s + i.mrp * i.quantity, 0);
  const delivery = total > 499 ? 0 : 49;

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-dark mb-6">Review Your Order</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Items */}
        <div>
          <h3 className="text-sm font-semibold text-dark mb-4 uppercase tracking-wide">Items ({items.length})</h3>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex gap-3">
                <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} className="w-14 h-18 object-cover rounded flex-shrink-0" style={{ height: 72 }} onError={e => e.target.src = '/placeholder.jpg'} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-dark truncate">{item.brand}</p>
                  <p className="text-xs text-muted truncate">{item.name}</p>
                  <p className="text-xs text-muted">Size: {item.size} | Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold text-dark mt-1">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address + Summary */}
        <div className="space-y-6">
          <div className="border border-border rounded p-4">
            <h3 className="text-sm font-semibold text-dark mb-2 uppercase tracking-wide">Delivering To</h3>
            <p className="text-sm font-medium text-dark">{address.name}</p>
            <p className="text-sm text-muted">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
            <p className="text-sm text-muted">{address.city}, {address.state} - {address.pincode}</p>
            <p className="text-sm text-muted">📞 {address.phone}</p>
          </div>

          <div className="border border-border rounded p-4">
            <h3 className="text-sm font-semibold text-dark mb-3 uppercase tracking-wide">Price Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">MRP Total</span><span>{formatCurrency(mrp)}</span></div>
              <div className="flex justify-between text-success"><span>Discount</span><span>− {formatCurrency(mrp - total)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Delivery</span><span className={delivery === 0 ? 'text-success font-medium' : ''}>{delivery === 0 ? 'FREE' : formatCurrency(delivery)}</span></div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-base"><span>Total</span><span>{formatCurrency(total + delivery)}</span></div>
            </div>
          </div>

          <p className="text-xs text-muted flex items-center gap-1.5">🏦 Payment: Cash on Delivery</p>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button variant="ghost" onClick={onBack} className="border border-border">← Back</Button>
        <Button onClick={onPlace} loading={placing} size="lg" className="min-w-40">Place Order ✓</Button>
      </div>
    </div>
  );
}

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(emptyAddress);
  const [placing, setPlacing] = useState(false);
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();

  if (!items.length) {
    navigate('/cart');
    return null;
  }

  const handlePlace = async () => {
    setPlacing(true);
    try {
      const res = await createOrder({ address, paymentMethod: 'COD' });
      await clearCart();
      navigate(`/order-success/${res.data.order.id}`);
    } catch (err) {
      showError(err?.response?.data?.error || 'Failed to place order');
    }
    setPlacing(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-dark text-center mb-2">Checkout</h1>
      <StepIndicator current={step} />
      <div className="bg-white border border-border rounded-lg p-6 md:p-8">
        {step === 1 && <AddressForm address={address} onChange={setAddress} onNext={() => setStep(2)} />}
        {step === 2 && <PaymentStep onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <ReviewStep items={items} address={address} onPlace={handlePlace} onBack={() => setStep(2)} placing={placing} />}
      </div>
    </div>
  );
}
