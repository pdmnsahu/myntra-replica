import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Women', slug: 'women', emoji: '👗', image: 'https://picsum.photos/seed/cat-women/200/240', color: 'bg-rose-50' },
  { name: 'Men',   slug: 'men',   emoji: '👔', image: 'https://picsum.photos/seed/cat-men/200/240',   color: 'bg-blue-50' },
  { name: 'Kids',  slug: 'kids',  emoji: '🧒', image: 'https://picsum.photos/seed/cat-kids/200/240',  color: 'bg-yellow-50' },
  { name: 'Beauty',slug: 'beauty',emoji: '✨', image: 'https://picsum.photos/seed/cat-beauty/200/240',color: 'bg-pink-50' },
  { name: 'Footwear',slug:'footwear',emoji:'👟',image:'https://picsum.photos/seed/cat-foot/200/240', color: 'bg-amber-50' },
  { name: 'Ethnic Wear',slug:'women&subcategory=Ethnic Wear',emoji:'🥻',image:'https://picsum.photos/seed/cat-ethnic/200/240',color:'bg-orange-50'},
  { name: 'Sports',slug:'men&subcategory=T-Shirts',emoji:'🏃',image:'https://picsum.photos/seed/cat-sports/200/240',color:'bg-green-50'},
];

export default function CategoryStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="font-display text-2xl font-bold text-dark mb-6">Shop by Category</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <Link
            key={cat.name}
            to={`/products?category=${cat.slug}`}
            className="flex-shrink-0 group flex flex-col items-center gap-2"
          >
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ${cat.color} border-2 border-transparent group-hover:border-primary transition-all duration-200 shadow-sm`}>
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={e => { e.target.style.display='none'; e.target.parentNode.querySelector('span').style.display='block'; }}
              />
              <span className="hidden text-3xl leading-none flex items-center justify-center w-full h-full">{cat.emoji}</span>
            </div>
            <span className="text-xs font-semibold text-dark group-hover:text-primary transition-colors text-center whitespace-nowrap">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
