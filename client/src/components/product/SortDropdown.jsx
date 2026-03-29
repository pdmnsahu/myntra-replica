import { useSearchParams } from 'react-router-dom';

const SORT_OPTIONS = [
  { label: 'Recommended', value: '' },
  { label: 'New Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Customer Rating', value: 'rating' },
  { label: 'Best Discount', value: 'discount' },
];

export default function SortDropdown() {
  const [params, setParams] = useSearchParams();
  const current = params.get('sort') || '';

  const handleChange = (e) => {
    const next = new URLSearchParams(params);
    if (e.target.value) next.set('sort', e.target.value);
    else next.delete('sort');
    next.delete('page');
    setParams(next);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted hidden sm:inline">Sort by:</span>
      <select
        value={current}
        onChange={handleChange}
        className="text-sm border border-border rounded px-3 py-1.5 text-dark focus:outline-none focus:border-dark bg-white"
      >
        {SORT_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
