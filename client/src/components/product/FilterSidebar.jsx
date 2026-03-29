import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RiArrowDownSLine, RiArrowUpSLine, RiCloseLine } from 'react-icons/ri';
import { useBrands } from '../../hooks/useProducts';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '26', '28', '30', '32', '34', '36', '38'];
const GENDERS = ['Men', 'Women', 'Kids', 'Unisex'];
const DISCOUNTS = [{ label: '10% and above', value: 10 }, { label: '20% and above', value: 20 }, { label: '30% and above', value: 30 }, { label: '50% and above', value: 50 }];
const RATINGS = [{ label: '4★ and above', value: 4 }, { label: '3★ and above', value: 3 }];

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left">
        <span className="text-sm font-semibold text-dark uppercase tracking-wider">{title}</span>
        {open ? <RiArrowUpSLine size={18} /> : <RiArrowDownSLine size={18} />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({ onClose }) {
  const [params, setParams] = useSearchParams();
  const { data: brandsData } = useBrands();
  const brands = brandsData?.brands || [];

  const get = (key) => params.get(key) || '';
  const getArr = (key) => params.get(key) ? params.get(key).split(',') : [];

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  const toggleArr = (key, value) => {
    const arr = getArr(key);
    const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    set(key, next.join(','));
  };

  const clearAll = () => {
    const next = new URLSearchParams();
    if (params.get('category')) next.set('category', params.get('category'));
    if (params.get('search')) next.set('search', params.get('search'));
    setParams(next);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-dark">Filters</h3>
        <div className="flex items-center gap-2">
          <button onClick={clearAll} className="text-xs text-primary font-medium hover:underline">Clear All</button>
          {onClose && (
            <button onClick={onClose} className="md:hidden text-muted hover:text-dark">
              <RiCloseLine size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Gender */}
      <Section title="Gender">
        <div className="space-y-2">
          {GENDERS.map(g => (
            <label key={g} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={getArr('gender').includes(g)}
                onChange={() => toggleArr('gender', g)}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-dark">{g}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Price Range */}
      <Section title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>₹{get('minPrice') || 0}</span>
            <span>₹{get('maxPrice') || 5000}</span>
          </div>
          <input
            type="range" min="0" max="5000" step="100"
            value={get('maxPrice') || 5000}
            onChange={e => set('maxPrice', e.target.value)}
          />
          <div className="flex gap-2">
            <input
              type="number" placeholder="Min" value={get('minPrice')}
              onChange={e => set('minPrice', e.target.value)}
              className="w-1/2 input-field text-xs py-1.5"
            />
            <input
              type="number" placeholder="Max" value={get('maxPrice')}
              onChange={e => set('maxPrice', e.target.value)}
              className="w-1/2 input-field text-xs py-1.5"
            />
          </div>
        </div>
      </Section>

      {/* Brand */}
      {brands.length > 0 && (
        <Section title="Brand" defaultOpen={false}>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {brands.map(b => (
              <label key={b} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={getArr('brand').includes(b)}
                  onChange={() => toggleArr('brand', b)}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm text-dark">{b}</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {/* Size */}
      <Section title="Size" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(s => (
            <button
              key={s}
              onClick={() => set('size', get('size') === s ? '' : s)}
              className={`px-3 py-1 text-xs border rounded transition-colors ${get('size') === s ? 'border-dark bg-dark text-white' : 'border-border text-dark hover:border-dark'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>

      {/* Discount */}
      <Section title="Discount" defaultOpen={false}>
        <div className="space-y-2">
          {DISCOUNTS.map(d => (
            <label key={d.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="discount"
                checked={get('discount') === String(d.value)}
                onChange={() => set('discount', get('discount') === String(d.value) ? '' : d.value)}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-dark">{d.label}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Rating */}
      <Section title="Customer Ratings" defaultOpen={false}>
        <div className="space-y-2">
          {RATINGS.map(r => (
            <label key={r.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={get('rating') === String(r.value)}
                onChange={() => set('rating', get('rating') === String(r.value) ? '' : r.value)}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-dark">{r.label}</span>
            </label>
          ))}
        </div>
      </Section>
    </div>
  );
}
