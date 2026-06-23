import { useRef } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard.jsx';

export default function ProductCarousel({ products }) {
  const ref = useRef();

  const scroll = (dir) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow">
        ‹
      </button>

      <div ref={ref} className="flex gap-4 overflow-x-auto py-4 scroll-smooth">
        {products.map((p) => (
          <motion.div key={p._id} className="w-72 flex-shrink-0">
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
