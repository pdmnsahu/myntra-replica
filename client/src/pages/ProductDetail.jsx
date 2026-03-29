import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { RiHeartLine, RiHeartFill, RiShoppingBagLine, RiTruckLine, RiShieldCheckLine, RiRepeatLine, RiArrowLeftLine } from 'react-icons/ri';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuthStore } from '../store/authStore';
import StarRating from '../components/ui/StarRating';
import Button from '../components/ui/Button';
import ProductGrid from '../components/product/ProductGrid';
import { formatCurrency } from '../utils/formatCurrency';
import { submitReview } from '../api/product.api';
import { useQueryClient } from '@tanstack/react-query';
import { showSuccess, showError } from '../utils/toastHelper';

function ImageGallery({ images }) {
  const [main, setMain] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex gap-3">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2">
        {(images || []).slice(0, 5).map((img, i) => (
          <button
            key={i}
            onClick={() => setMain(i)}
            className={`w-16 h-20 rounded overflow-hidden border-2 transition-colors flex-shrink-0 ${i === main ? 'border-dark' : 'border-border hover:border-gray-400'}`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" onError={e => e.target.src = '/placeholder.jpg'} />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        className="flex-1 aspect-[3/4] rounded overflow-hidden bg-light relative cursor-zoom-in"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={images?.[main] || '/placeholder.jpg'}
          alt="Product"
          className="w-full h-full object-cover transition-transform duration-200"
          style={zoomed ? { transform: 'scale(2)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
          onError={e => e.target.src = '/placeholder.jpg'}
        />
      </div>
    </div>
  );
}

function ReviewForm({ productId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const qc = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { showError('Please select a rating'); return; }
    setSubmitting(true);
    try {
      await submitReview(productId, { rating, comment });
      showSuccess('Review submitted!');
      setRating(0); setComment('');
      qc.invalidateQueries(['product', productId]);
    } catch (err) {
      showError(err?.response?.data?.error || 'Failed to submit review');
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 border border-border rounded p-4 bg-light">
      <h4 className="font-semibold text-dark mb-3">Write a Review</h4>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-muted">Your rating:</span>
        <StarRating rating={rating} interactive onRate={setRating} size={20} />
      </div>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Share your experience with this product..."
        className="input-field resize-none h-24 text-sm mb-3"
      />
      <Button type="submit" loading={submitting} size="sm">Submit Review</Button>
    </form>
  );
}

function RatingBreakdown({ reviews }) {
  const counts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));
  const total = reviews.length || 1;
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <div className="flex gap-8 items-start">
      <div className="text-center">
        <div className="font-display text-5xl font-bold text-dark">{avg}</div>
        <StarRating rating={parseFloat(avg)} size={16} />
        <p className="text-xs text-muted mt-1">{reviews.length} ratings</p>
      </div>
      <div className="flex-1 space-y-1.5">
        {counts.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-3 text-right text-muted">{star}★</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-success h-2 rounded-full transition-all duration-500" style={{ width: `${(count / total) * 100}%` }} />
            </div>
            <span className="w-5 text-muted">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useProduct(id);
  const { data: similarData } = useProducts({ category: data?.product?.category_slug, limit: 6 });
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { token } = useAuthStore();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [pincode, setPincode] = useState('');
  const [pincodeMsg, setPincodeMsg] = useState('');
  const [addingCart, setAddingCart] = useState(false);

  const product = data?.product;
  const reviews = data?.reviews || [];
  const wishlisted = product ? isWishlisted(product.id) : false;

  const handleAddToCart = async () => {
    if (!token) { navigate('/login'); return; }
    if (!selectedSize) { showError('Please select a size'); return; }
    if (!selectedColor) { showError('Please select a colour'); return; }
    setAddingCart(true);
    await addItem(product.id, selectedSize, selectedColor);
    setAddingCart(false);
  };

  const handlePincode = () => {
    if (pincode.length === 6) setPincodeMsg('Estimated delivery in 3-5 business days ✓');
    else setPincodeMsg('Please enter a valid 6-digit pincode');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="skeleton aspect-[3/4] rounded" />
          <div className="space-y-4">
            {[80, 60, 40, 40, 60, 80, 100].map((w, i) => (
              <div key={i} className={`skeleton h-4 rounded`} style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="font-display text-2xl font-semibold mb-2">Product not found</h2>
        <Link to="/products" className="text-primary hover:underline mt-2">Browse all products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-dark">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category_slug}`} className="hover:text-dark capitalize">{product.category_name}</Link>
        <span>/</span>
        <span className="text-dark">{product.brand}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        {/* Gallery */}
        <ImageGallery images={product.images} />

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-bold text-dark text-lg uppercase tracking-wide">{product.brand}</h1>
              <h2 className="text-muted text-base mt-0.5">{product.name}</h2>
            </div>
            <button
              onClick={() => toggle(product.id)}
              className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors"
            >
              {wishlisted ? <RiHeartFill className="text-primary" size={18} /> : <RiHeartLine size={18} />}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="bg-success text-white text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
              {product.rating} ★
            </span>
            <span className="text-muted text-xs">| {product.review_count?.toLocaleString()} Ratings</span>
          </div>

          <div className="border-t border-border mt-4 pt-4">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl font-bold text-dark">{formatCurrency(product.price)}</span>
              <span className="text-muted text-sm line-through">{formatCurrency(product.mrp)}</span>
              <span className="text-success font-semibold text-sm">({product.discount_percent}% OFF)</span>
            </div>
            <p className="text-xs text-muted mt-1">inclusive of all taxes</p>
          </div>

          {/* Size */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm text-dark">Select Size</h3>
              <button className="text-xs text-primary hover:underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(product.sizes || []).map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 text-sm rounded border transition-colors ${selectedSize === size ? 'border-dark bg-dark text-white' : 'border-border text-dark hover:border-dark'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mt-4">
            <h3 className="font-semibold text-sm text-dark mb-2">Select Colour</h3>
            <div className="flex flex-wrap gap-2">
              {(product.colors || []).map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1.5 text-xs rounded border transition-colors ${selectedColor === color ? 'border-dark bg-dark text-white' : 'border-border text-dark hover:border-dark'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => toggle(product.id)}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <RiHeartLine size={16} className="mr-2" />
              {wishlisted ? 'WISHLISTED' : 'WISHLIST'}
            </Button>
            <Button
              onClick={handleAddToCart}
              loading={addingCart}
              size="lg"
              className="flex-1"
            >
              <RiShoppingBagLine size={16} className="mr-2" />
              ADD TO BAG
            </Button>
          </div>

          {/* Delivery check */}
          <div className="mt-5 border border-border rounded p-4">
            <h3 className="font-semibold text-sm text-dark mb-2">Delivery Options</h3>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={e => { setPincode(e.target.value.replace(/\D/g, '')); setPincodeMsg(''); }}
                placeholder="Enter delivery pincode"
                className="input-field text-sm flex-1"
              />
              <button onClick={handlePincode} className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">Check</button>
            </div>
            {pincodeMsg && <p className={`text-xs mt-1.5 ${pincodeMsg.includes('✓') ? 'text-success' : 'text-primary'}`}>{pincodeMsg}</p>}
          </div>

          {/* Promises */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: RiTruckLine, label: 'Free Delivery', sub: 'Above ₹499' },
              { icon: RiRepeatLine, label: '7-Day Returns', sub: 'Easy exchanges' },
              { icon: RiShieldCheckLine, label: '100% Genuine', sub: 'Verified brands' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1 p-3 bg-light rounded">
                <Icon size={20} className="text-dark" />
                <p className="text-xs font-semibold text-dark">{label}</p>
                <p className="text-xs text-muted">{sub}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-6">
              <h3 className="font-semibold text-sm text-dark mb-2">Product Details</h3>
              <p className="text-sm text-muted leading-relaxed">{product.description}</p>
              <div className="mt-3 space-y-1.5 text-sm">
                <div className="flex gap-3"><span className="text-muted w-28">Brand</span><span className="text-dark">{product.brand}</span></div>
                <div className="flex gap-3"><span className="text-muted w-28">Category</span><span className="text-dark">{product.subcategory}</span></div>
                <div className="flex gap-3"><span className="text-muted w-28">Gender</span><span className="text-dark">{product.gender}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-display text-2xl font-semibold text-dark mb-6">Ratings & Reviews</h2>
        {reviews.length > 0 && <RatingBreakdown reviews={reviews} />}

        <div className="mt-8 space-y-6">
          {reviews.length === 0 && (
            <p className="text-muted text-sm">No reviews yet. Be the first to review this product!</p>
          )}
          {reviews.map(review => (
            <div key={review.id} className="border-b border-border pb-5 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-dark text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {review.user_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-dark">{review.user_name}</p>
                  <StarRating rating={review.rating} size={13} />
                </div>
                <span className="ml-auto text-xs text-muted">{new Date(review.created_at).toLocaleDateString('en-IN')}</span>
              </div>
              {review.comment && <p className="text-sm text-muted ml-11">{review.comment}</p>}
            </div>
          ))}
        </div>

        {token && <ReviewForm productId={id} />}
        {!token && (
          <p className="mt-4 text-sm text-muted">
            <Link to="/login" className="text-primary font-medium hover:underline">Login</Link> to write a review.
          </p>
        )}
      </section>

      {/* Similar Products */}
      {similarData?.products?.length > 1 && (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="font-display text-2xl font-semibold text-dark mb-6">Similar Products</h2>
          <ProductGrid products={similarData.products.filter(p => p.id !== parseInt(id)).slice(0, 4)} columns={4} />
        </section>
      )}
    </div>
  );
}
