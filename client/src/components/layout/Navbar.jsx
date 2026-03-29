import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { RiSearchLine, RiHeartLine, RiShoppingBagLine, RiUserLine, RiMenuLine, RiCloseLine } from 'react-icons/ri';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import axiosInstance from '../../api/axiosInstance';

const CATEGORIES = ['Women', 'Men', 'Kids', 'Beauty', 'Footwear'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef(null);
  const searchTimer = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout } = useAuthStore();
  const cartItems = useCartStore(s => s.items);
  const wishlistIds = useWishlistStore(s => s.ids);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearch('');
  }, [location]);

  useEffect(() => {
    if (!search.trim()) { setSearchResults([]); return; }
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await axiosInstance.get('/products', { params: { search, limit: 5 } });
        setSearchResults(res.data.products || []);
      } catch { setSearchResults([]); }
    }, 300);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  const handleLogout = () => {
    logout();
    useCartStore.getState().clearLocal();
    useWishlistStore.getState().clearLocal();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'border-b border-border'}`}>
        {/* Top bar */}
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* Mobile menu button */}
          <button className="md:hidden text-dark" onClick={() => setMobileOpen(true)}>
            <RiMenuLine size={22} />
          </button>

          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-bold text-dark tracking-widest flex-shrink-0">
            DRAPE
          </Link>

          {/* Category links - desktop */}
          <div className="hidden md:flex items-center gap-1 ml-6">
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                to={`/products?category=${cat.toLowerCase()}`}
                className="px-3 py-1 text-sm font-medium text-dark hover:text-primary transition-colors whitespace-nowrap"
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4 relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center bg-light rounded px-3 py-2 gap-2">
                <RiSearchLine className="text-muted flex-shrink-0" size={16} />
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                  placeholder="Search for products, brands and more"
                  className="bg-transparent text-sm text-dark placeholder-muted outline-none w-full"
                />
              </div>
            </form>
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded shadow-lg z-50 max-h-80 overflow-y-auto">
                {searchResults.map(p => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-light transition-colors"
                  >
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="w-10 h-12 object-cover rounded"
                      onError={e => e.target.src = '/placeholder.jpg'}
                    />
                    <div>
                      <p className="text-xs text-muted">{p.brand}</p>
                      <p className="text-sm text-dark font-medium line-clamp-1">{p.name}</p>
                      <p className="text-sm text-primary font-semibold">₹{p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex flex-col items-center px-3 py-1 text-dark hover:text-primary transition-colors"
              >
                <RiUserLine size={20} />
                <span className="text-xs mt-0.5 hidden md:block">{user ? user.name.split(' ')[0] : 'Profile'}</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-border rounded shadow-lg z-50 animate-fade-in">
                  {token ? (
                    <>
                      <Link to="/profile" className="block px-4 py-2.5 text-sm text-dark hover:bg-light">My Profile</Link>
                      <Link to="/orders" className="block px-4 py-2.5 text-sm text-dark hover:bg-light">My Orders</Link>
                      <Link to="/wishlist" className="block px-4 py-2.5 text-sm text-dark hover:bg-light">Wishlist</Link>
                      <hr className="border-border" />
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-light">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2.5 text-sm text-dark hover:bg-light font-medium">Login</Link>
                      <Link to="/register" className="block px-4 py-2.5 text-sm text-dark hover:bg-light">New Customer? Sign Up</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="flex flex-col items-center px-3 py-1 text-dark hover:text-primary transition-colors relative">
              <div className="relative">
                <RiHeartLine size={20} />
                {wishlistIds.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {wishlistIds.length > 9 ? '9+' : wishlistIds.length}
                  </span>
                )}
              </div>
              <span className="text-xs mt-0.5 hidden md:block">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex flex-col items-center px-3 py-1 text-dark hover:text-primary transition-colors relative">
              <div className="relative">
                <RiShoppingBagLine size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-0.5 hidden md:block">Bag</span>
            </Link>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex items-center bg-light rounded px-3 py-2 gap-2">
              <RiSearchLine className="text-muted flex-shrink-0" size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products, brands..."
                className="bg-transparent text-sm outline-none w-full text-dark placeholder-muted"
              />
            </div>
          </form>
        </div>
      </nav>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-white h-full overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <span className="font-display text-xl font-bold">DRAPE</span>
              <button onClick={() => setMobileOpen(false)}><RiCloseLine size={22} /></button>
            </div>
            {token && (
              <div className="px-4 py-3 bg-light border-b border-border">
                <p className="text-sm font-medium text-dark">Hello, {user?.name}</p>
                <p className="text-xs text-muted">{user?.email}</p>
              </div>
            )}
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider py-2">Categories</p>
              {CATEGORIES.map(cat => (
                <Link key={cat} to={`/products?category=${cat.toLowerCase()}`} className="block py-3 text-sm text-dark border-b border-border hover:text-primary">
                  {cat}
                </Link>
              ))}
              <p className="text-xs font-semibold text-muted uppercase tracking-wider py-2 mt-2">Account</p>
              {token ? (
                <>
                  <Link to="/profile" className="block py-3 text-sm text-dark border-b border-border">My Profile</Link>
                  <Link to="/orders" className="block py-3 text-sm text-dark border-b border-border">My Orders</Link>
                  <button onClick={handleLogout} className="block py-3 text-sm text-primary">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-3 text-sm text-dark border-b border-border font-medium">Login</Link>
                  <Link to="/register" className="block py-3 text-sm text-dark">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-[100px] md:h-16" />
    </>
  );
}
