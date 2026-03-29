import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
      <div className="font-display text-[120px] leading-none font-bold text-light select-none">
        404
      </div>
      <h1 className="font-display text-2xl font-semibold text-dark mt-2 mb-2">Page not found</h1>
      <p className="text-muted text-sm max-w-sm mb-8">
        Looks like this page went out of stock! Let's get you back to shopping.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="btn-primary">Go Home</Link>
        <Link to="/products" className="btn-outline">Browse Products</Link>
      </div>
    </div>
  );
}
