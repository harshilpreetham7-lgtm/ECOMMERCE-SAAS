import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard.jsx';

export default function ProductCarousel({ products }) {
  const ref = useRef();
  const [paused, setPaused] = useState(false);

  const scroll = (dir) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!ref.current) return;
    const t = setInterval(() => {
      if (paused) return;
      ref.current.scrollBy({ left: 320, behavior: 'smooth' });
      // loop back
      if (ref.current.scrollLeft + ref.current.clientWidth >= ref.current.scrollWidth) {
        ref.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="relative">
      <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow">
        ‹
      </button>

      <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="flex gap-4 overflow-x-auto py-4 scroll-smooth">
        {products.map((p) => (
          <motion.div key={p._id} whileHover={{ y: -6 }} className="w-72 flex-shrink-0">
            <ProductCard product={p} onAddToCart={() => {}} />
          </motion.div>
        ))}
      </div>

      <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow">
        ›
      </button>
    </div>
  );
}
