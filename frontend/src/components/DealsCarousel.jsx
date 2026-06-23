import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function DealsCarousel({ deals = [] }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    let handle;
    const startAutoScroll = () => {
      handle = setInterval(() => {
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: Math.round(el.clientWidth / 2), behavior: 'smooth' });
        }
      }, 3000);
    };

    startAutoScroll();
    return () => clearInterval(handle);
  }, [deals]);

  if (!deals || deals.length === 0) return null;

  return (
    <div>
      <h3 className="text-xl font-bold mb-3">Deals of the Day</h3>
      <div className="relative">
        <div ref={ref} className="flex gap-4 overflow-x-auto no-scrollbar py-2" style={{ scrollSnapType: 'x mandatory' }}>
          {deals.map((p) => (
            <motion.div
              key={p._id}
              className="flex-none w-60 bg-white rounded-lg shadow-md p-3"
              style={{ scrollSnapAlign: 'start' }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative rounded overflow-hidden h-36 mb-3">
                <img src={p.images?.[0]?.url} alt={p.name} className="w-full h-full object-cover" />
                {p.discount && (
                  <span className="absolute top-2 left-2 bg-accent text-black text-xs font-bold px-2 py-1 rounded">{p.discount}% OFF</span>
                )}
              </div>

              <div className="text-sm font-semibold mb-1 truncate">{p.name}</div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold">${p.price}</div>
                {p.originalPrice && <div className="text-xs line-through text-gray-400">${p.originalPrice}</div>}
              </div>

              <div className="mt-3">
                <button className="w-full btn-brand py-2 rounded text-sm">Buy Now</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
