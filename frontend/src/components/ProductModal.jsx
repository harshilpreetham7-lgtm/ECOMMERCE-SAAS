import { motion } from 'framer-motion';

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-lg max-w-3xl w-full p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="w-1/3">
            {product.images && product.images[0] ? (
              <img src={product.images[0].url} alt={product.name} className="w-full h-56 object-cover rounded" />
            ) : (
              <div className="w-full h-56 bg-gray-100 rounded" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
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
