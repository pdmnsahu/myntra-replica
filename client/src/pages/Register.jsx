import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { registerUser } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import Button from '../components/ui/Button';
import { showError } from '../utils/toastHelper';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchWishlistIds } = useWishlistStore();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await registerUser({ name: form.name, email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      await Promise.all([fetchCart(), fetchWishlistIds()]);
      navigate('/');
    } catch (err) {
      showError(err?.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  const field = (key, label, type = 'text', placeholder = '', extra = {}) => (
    <div>
      <label className="block text-xs font-semibold text-dark mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={type === 'password' ? (showPass ? 'text' : 'password') : type}
          value={form[key]}
          onChange={e => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); }}
          placeholder={placeholder}
          className={`input-field ${type === 'password' ? 'pr-10' : ''} ${errors[key] ? 'border-primary' : ''}`}
          {...extra}
        />
        {type === 'password' && (
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
            {showPass ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
          </button>
        )}
      </div>
      {errors[key] && <p className="text-xs text-primary mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl font-bold text-dark tracking-widest">DRAPE</Link>
          <p className="text-muted text-sm mt-2">Create your account</p>
        </div>

        <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-dark mb-6">Join Drape</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {field('name', 'Full Name', 'text', 'Enter your full name')}
            {field('email', 'Email Address', 'email', 'you@example.com')}
            {field('password', 'Password', 'password', 'At least 6 characters')}
            {field('confirm', 'Confirm Password', 'password', 'Re-enter your password')}

            <p className="text-xs text-muted">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-dark underline">Terms of Use</a> and{' '}
              <a href="#" className="text-dark underline">Privacy Policy</a>.
            </p>

            <Button type="submit" loading={loading} className="w-full" size="lg">Create Account</Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
