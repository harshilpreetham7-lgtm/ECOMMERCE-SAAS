import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;
  const images = (product.images && product.images.length > 0) ? product.images : [{ url: 'https://via.placeholder.com/800x600?text=No+Image' }];
  const [idx, setIdx] = useState(0);
  let touchStartX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) setIdx((i) => (i + 1) % images.length);
    else setIdx((i) => (i - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="bg-white rounded-lg max-w-4xl w-full p-6">
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
            <div className="rounded overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <img src={images[idx].url} alt={product.name} className="w-full h-96 object-cover rounded" />
            </div>

            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((im, i) => (
                <button key={i} onClick={() => setIdx(i)} className={`w-20 h-20 rounded overflow-hidden border ${i === idx ? 'ring-2 ring-primary' : 'border-gray-200'}`}>
                  <img src={im.url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
              <button onClick={onClose} className="text-gray-500">Close</button>
            </div>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="mb-4">
              <span className="text-3xl font-bold text-primary">${product.price}</span>
              {product.originalPrice && <span className="ml-3 line-through text-gray-400">${product.originalPrice}</span>}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => onAddToCart(product)} className="bg-primary text-white px-5 py-2 rounded">Add to cart</button>
              <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
