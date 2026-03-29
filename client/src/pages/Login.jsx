import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { loginUser } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import Button from '../components/ui/Button';
import { showError } from '../utils/toastHelper';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchWishlistIds } = useWishlistStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';

  const validate = () => {
    const e = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      await Promise.all([fetchCart(), fetchWishlistIds()]);
      navigate(redirect, { replace: true });
    } catch (err) {
      showError(err?.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl font-bold text-dark tracking-widest">DRAPE</Link>
          <p className="text-muted text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-dark mb-6">Welcome back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-dark mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                placeholder="you@example.com"
                className={`input-field ${errors.email ? 'border-primary' : ''}`}
              />
              {errors.email && <p className="text-xs text-primary mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                  placeholder="Enter your password"
                  className={`input-field pr-10 ${errors.password ? 'border-primary' : ''}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                  {showPass ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-primary mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">Sign In</Button>
          </form>

          <div className="mt-4 p-3 bg-light rounded text-xs text-muted text-center">
            Demo: <span className="font-mono text-dark">demo@drape.com</span> / <span className="font-mono text-dark">password123</span>
          </div>

          <p className="text-center text-sm text-muted mt-6">
            New to Drape?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
