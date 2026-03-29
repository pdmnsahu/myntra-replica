import { Link } from 'react-router-dom';
import ProductCard from '../product/ProductCard';
import { useFeaturedProducts } from '../../hooks/useProducts';
import { RiArrowRightLine } from 'react-icons/ri';

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-44 md:w-52 bg-white rounded-sm overflow-hidden">
      <div className="skeleton aspect-[4/5] w-full" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
      </div>
    </div>
  );
}

export default function TrendingSection() {
  const { data, isLoading } = useFeaturedProducts();
  const products = data?.products || [];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-dark">Trending Now</h2>
        <Link to="/products?sort=rating" className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
          View All <RiArrowRightLine size={16} />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map(p => (
              <div key={p.id} className="flex-shrink-0 w-44 md:w-52">
                <ProductCard product={p} />
              </div>
            ))
        }
      </div>
    </section>
  );
}
