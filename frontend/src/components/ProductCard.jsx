import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
    >
      {product.images && product.images[0] ? (
        <img
          src={product.images[0].url}
          alt={product.name}
          className="w-full h-48 object-cover hover:scale-105 transition"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">No image</div>
      )}

      <div className="p-4">
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
          {product.discount > 0 && (
            <span className="bg-danger text-white px-2 py-1 rounded text-sm font-semibold">
              -{product.discount}%
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="bg-primary text-white px-3 py-2 rounded-lg hover:bg-secondary transition disabled:opacity-50 flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
