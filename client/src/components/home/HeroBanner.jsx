import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/hero-banner-1/1400/600',
    tag: 'New Collection',
    title: 'Wear Your\nStory',
    subtitle: "Explore the season's finest ethnic & western wear",
    cta: 'Shop Women',
    link: '/products?category=women',
    accent: '#FF3F6C',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/hero-banner-2/1400/600',
    tag: "Men's Edit",
    title: 'Dressed to\nImpress',
    subtitle: 'Formal, casual, ethnic — curated for the modern man',
    cta: 'Shop Men',
    link: '/products?category=men',
    accent: '#282C3F',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/hero-banner-3/1400/600',
    tag: 'Upto 60% Off',
    title: 'Grand Fashion\nSale',
    subtitle: 'Biggest discounts on top brands. Limited time only.',
    cta: 'Shop Sale',
    link: '/products?discount=30',
    accent: '#FF905A',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => transition((current + 1) % SLIDES.length), 4000);
    return () => clearInterval(timer);
  }, [current]);

  const transition = (idx) => {
    setFading(true);
    setTimeout(() => { setCurrent(idx); setFading(false); }, 350);
  };

  const slide = SLIDES[current];

  return (
    <div className="relative w-full overflow-hidden bg-gray-100" style={{ height: 'clamp(280px, 48vw, 500px)' }}>
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{ backgroundImage: `url(${slide.image})`, opacity: fading ? 0 : 1 }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

      <div className={`absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}>
        <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 w-fit text-white" style={{ background: slide.accent }}>
          {slide.tag}
        </span>
        <h1 className="font-display text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight whitespace-pre-line mb-3">
          {slide.title}
        </h1>
        <p className="text-white/80 text-sm md:text-base max-w-sm mb-6">{slide.subtitle}</p>
        <Link to={slide.link} className="inline-flex items-center gap-2 bg-white text-dark font-semibold text-sm px-6 py-3 rounded hover:bg-primary hover:text-white transition-colors duration-200 w-fit">
          {slide.cta} →
        </Link>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => transition(i)} className="transition-all duration-300 rounded-full" style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? '#FF3F6C' : 'rgba(255,255,255,0.5)' }} />
        ))}
      </div>
      <button onClick={() => transition((current - 1 + SLIDES.length) % SLIDES.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white text-xl flex items-center justify-center backdrop-blur-sm transition-colors">‹</button>
      <button onClick={() => transition((current + 1) % SLIDES.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white text-xl flex items-center justify-center backdrop-blur-sm transition-colors">›</button>
    </div>
  );
}
