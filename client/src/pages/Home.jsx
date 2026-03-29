import { Link } from 'react-router-dom';
import HeroBanner from '../components/home/HeroBanner';
import CategoryStrip from '../components/home/CategoryStrip';
import TrendingSection from '../components/home/TrendingSection';
import ProductGrid from '../components/product/ProductGrid';
import { useFeaturedProducts, useProducts } from '../hooks/useProducts';

function OfferBanners() {
  const banners = [
    { label: 'Upto 60% Off', sub: 'Ethnic Wear Sale', link: '/products?category=women&subcategory=Ethnic Wear&discount=30', bg: 'from-rose-400 to-pink-600', emoji: '🥻' },
    { label: 'Buy 2 Get 1', sub: 'On All Footwear', link: '/products?category=footwear', bg: 'from-indigo-400 to-blue-600', emoji: '👟' },
    { label: 'New Arrivals', sub: 'Men\'s Collection', link: '/products?category=men&sort=newest', bg: 'from-slate-500 to-gray-700', emoji: '👔' },
    { label: 'Beauty Deals', sub: 'Starting ₹149', link: '/products?category=beauty', bg: 'from-purple-400 to-violet-600', emoji: '💄' },
  ];
  return (
    <section className="py-8 bg-light">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {banners.map((b) => (
            <Link key={b.label} to={b.link} className={`bg-gradient-to-br ${b.bg} rounded-lg p-5 flex flex-col justify-between min-h-[130px] hover:scale-[1.02] transition-transform duration-200 cursor-pointer`}>
              <span className="text-4xl">{b.emoji}</span>
              <div>
                <p className="text-white font-bold text-base leading-tight">{b.label}</p>
                <p className="text-white/80 text-xs mt-0.5">{b.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewArrivals() {
  const { data, isLoading } = useProducts({ sort: 'newest', limit: 8 });
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-dark">New Arrivals</h2>
            <p className="text-muted text-sm mt-1">Fresh styles, just landed</p>
          </div>
          <Link to="/products?sort=newest" className="text-sm font-semibold text-primary hover:underline">View All →</Link>
        </div>
        <ProductGrid products={data?.products} loading={isLoading} columns={4} />
      </div>
    </section>
  );
}

function FeaturedBrands() {
  const brands = [
    { name: 'Nike', img: 'https://picsum.photos/seed/brand-nike/120/60' },
    { name: 'Puma', img: 'https://picsum.photos/seed/brand-puma/120/60' },
    { name: 'Fabindia', img: 'https://picsum.photos/seed/brand-fab/120/60' },
    { name: 'Manyavar', img: 'https://picsum.photos/seed/brand-many/120/60' },
    { name: 'W', img: 'https://picsum.photos/seed/brand-w/120/60' },
    { name: 'Libas', img: 'https://picsum.photos/seed/brand-libas/120/60' },
  ];
  return (
    <section className="py-10 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-display text-2xl font-semibold text-dark mb-6 text-center">Top Brands</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {brands.map(b => (
            <Link key={b.name} to={`/products?brand=${b.name}`} className="flex items-center justify-center w-32 h-16 border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-200 bg-white overflow-hidden p-2">
              <img src={b.img} alt={b.name} className="max-w-full max-h-full object-contain" onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML = `<span class="font-bold text-dark text-sm">${b.name}</span>`; }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="animate-fade-in">
      <HeroBanner />
      <CategoryStrip />
      <TrendingSection />
      <OfferBanners />
      <NewArrivals />
      <FeaturedBrands />
    </div>
  );
}
