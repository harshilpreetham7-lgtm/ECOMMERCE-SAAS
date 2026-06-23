import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function FeaturedCategories({ categories = [] }) {
  const presets = {
    electronics: 'https://images.unsplash.com/photo-1510557880182-3eec9f7f0f33?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=1',
    apparel: 'https://images.unsplash.com/photo-1520975919394-3b6c6b4a2b59?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=2',
    home: 'https://images.unsplash.com/photo-1505691723518-34d53b3b0a64?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=3',
    accessories: 'https://images.unsplash.com/photo-1524499943358-aca8d3d3a7c4?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=4',
    beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=5',
    toys: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=6',
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h3 className="text-2xl font-bold mb-6">Shop by Category</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((c) => (
          <motion.div key={c} whileHover={{ scale: 1.03 }} className="bg-white rounded-lg overflow-hidden shadow-sm">
            <Link to={`/products?category=${encodeURIComponent(c)}`} className="block">
              <div className="h-28 md:h-20 overflow-hidden">
                <img src={presets[c] || presets['accessories']} alt={c} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 text-center">
                <div className="text-sm font-semibold capitalize text-gray-800">{c}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
