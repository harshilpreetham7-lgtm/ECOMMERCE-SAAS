import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onView }) {
  const images = (product.images && product.images.length > 0) ? product.images : [{ url: 'https://via.placeholder.com/600x400?text=No+Image' }];
  const [idx, setIdx] = useState(0);
  const isBestSeller = (product.rating || 0) >= 4.5;
  const isLimitedStock = product.stock > 0 && product.stock <= 20;

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), isMobile ? 5000 : 4000);
    return () => clearInterval(t);
  }, [images]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
    >
      <div className="relative overflow-hidden">
        <motion.img
          key={images[idx].url}
          src={images[idx].url}
          alt={product.name}
          initial={{ scale: 1 }}
          animate={typeof window !== 'undefined' && window.innerWidth <= 768 ? {} : { scale: [1, 1.03, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-48 object-cover transition-transform duration-500"
        />

        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-accent text-white px-2 py-1 rounded text-sm font-semibold">-{product.discount}%</div>
        )}

        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {isBestSeller && (
            <div className="bg-yellow-400 text-slate-900 px-2 py-1 rounded text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm">
              Best Seller
            </div>
          )}
          {isLimitedStock && (
            <div className="bg-red-500 text-white px-2 py-1 rounded text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm">
              Limited stock
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <p className="text-[11px] uppercase tracking-[0.3em] text-brand font-semibold mb-2">{product.category}</p>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex justify-between items-center mb-4">
          <div>
            {product.originalPrice ? (
              <>
                <span className="text-2xl font-bold text-primary">${product.price}</span>
                <span className="ml-2 line-through text-gray-400">${product.originalPrice}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-primary">${product.price}</span>
            )}
          </div>
          {product.rating > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-yellow-500 font-semibold">
              ★ {product.rating.toFixed(1)}
            </motion.div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className={`text-sm ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView?.(product)}
              className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              View
            </button>
            <a
              href={`/products/${product._id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Details
            </a>
            <button
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className="bg-primary text-white px-3 py-2 rounded-lg hover:bg-secondary transition disabled:opacity-50 flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`w-12 h-12 rounded overflow-hidden border ${i === idx ? 'ring-2 ring-primary' : 'border-gray-200'}`}>
              <img src={img.url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
