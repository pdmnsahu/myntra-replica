import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { RiFilterLine, RiCloseLine } from 'react-icons/ri';
import FilterSidebar from '../components/product/FilterSidebar';
import SortDropdown from '../components/product/SortDropdown';
import ProductGrid from '../components/product/ProductGrid';
import { useProducts } from '../hooks/useProducts';

function ActiveFilterChips({ params, setParams }) {
  const CHIP_KEYS = ['gender', 'brand', 'size', 'color', 'minPrice', 'maxPrice', 'discount', 'rating', 'sort', 'search'];
  const LABELS = { minPrice: 'Min ₹', maxPrice: 'Max ₹', discount: 'Discount ≥', rating: 'Rating ≥', sort: 'Sort', gender: '', brand: '', size: 'Size: ', color: 'Color: ', search: 'Search: ' };

  const chips = CHIP_KEYS.flatMap(key => {
    const val = params.get(key);
    if (!val) return [];
    const vals = key === 'brand' || key === 'gender' ? val.split(',') : [val];
    return vals.map(v => ({ key, val: v, label: `${LABELS[key] || ''}${v}` }));
  });

  if (!chips.length) return null;

  const remove = (key, val) => {
    const next = new URLSearchParams(params);
    const current = next.get(key);
    if (!current) return;
    const arr = current.split(',').filter(v => v !== val);
    if (arr.length) next.set(key, arr.join(','));
    else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((chip, i) => (
        <span key={i} className="flex items-center gap-1.5 bg-light border border-border rounded-full px-3 py-1 text-xs text-dark">
          {chip.label}
          <button onClick={() => remove(chip.key, chip.val)} className="text-muted hover:text-dark">
            <RiCloseLine size={13} />
          </button>
        </span>
      ))}
    </div>
  );
}

export default function ProductListing() {
  const [params, setParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  const queryParams = {
    category: params.get('category') || undefined,
    subcategory: params.get('subcategory') || undefined,
    gender: params.get('gender') || undefined,
    brand: params.get('brand') || undefined,
    minPrice: params.get('minPrice') || undefined,
    maxPrice: params.get('maxPrice') || undefined,
    size: params.get('size') || undefined,
    color: params.get('color') || undefined,
    sort: params.get('sort') || undefined,
    search: params.get('search') || undefined,
    discount: params.get('discount') || undefined,
    rating: params.get('rating') || undefined,
    page: params.get('page') || 1,
    limit: 12,
  };

  const { data, isLoading } = useProducts(queryParams);
  const products = data?.products || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const currentPage = parseInt(params.get('page') || 1);

  const goPage = (p) => {
    const next = new URLSearchParams(params);
    next.set('page', p);
    setParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryTitle = params.get('category')
    ? params.get('category').charAt(0).toUpperCase() + params.get('category').slice(1)
    : params.get('search')
    ? `Search: "${params.get('search')}"`
    : 'All Products';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted mb-4">
        <Link to="/" className="hover:text-dark">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-dark font-medium">{categoryTitle}</span>
      </nav>

      <div className="flex gap-6">
        {/* Sidebar — desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <FilterSidebar />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h1 className="font-display text-xl font-semibold text-dark">{categoryTitle}</h1>
              {!isLoading && (
                <p className="text-xs text-muted mt-0.5">
                  {total.toLocaleString()} {total === 1 ? 'item' : 'items'} found
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                className="md:hidden flex items-center gap-1.5 border border-border rounded px-3 py-1.5 text-sm text-dark"
                onClick={() => setFilterOpen(true)}
              >
                <RiFilterLine size={16} /> Filter
              </button>
              <SortDropdown />
            </div>
          </div>

          <ActiveFilterChips params={params} setParams={setParams} />

          <ProductGrid products={products} loading={isLoading} columns={3} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => goPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-border rounded text-sm disabled:opacity-40 hover:border-dark transition-colors"
              >← Prev</button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => goPage(p)}
                    className={`w-9 h-9 rounded text-sm border transition-colors ${p === currentPage ? 'bg-dark text-white border-dark' : 'border-border hover:border-dark'}`}
                  >{p}</button>
                );
              })}
              <button
                onClick={() => goPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-border rounded text-sm disabled:opacity-40 hover:border-dark transition-colors"
              >Next →</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="relative ml-auto w-80 bg-white h-full overflow-y-auto p-5 animate-slide-in" style={{ animation: 'slideIn 0.3s ease-out' }}>
            <FilterSidebar onClose={() => setFilterOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
