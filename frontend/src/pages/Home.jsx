import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productService, cartService } from '../services/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../store/slices/cartSlice.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductCarousel from '../components/ProductCarousel.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch featured products from all stores
        const response = await productService.getProducts('', { isFeatured: true, limit: 12 });
        // If backend not available or returns empty, fall back to attractive mock products
        setProducts(response.products || fallbackProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      const response = await cartService.addToCart({
        productId: product._id,
        quantity: 1,
      });
      dispatch(setCart(response.cart));
      alert('Product added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const categories = ['all', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = selectedCategory === 'all' ? products : products.filter((p) => p.category === selectedCategory);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center md:text-left"
            >
              <h1 className="text-5xl font-bold mb-4">Shop with Confidence</h1>
              <p className="text-xl mb-6">Beautiful products, great prices, and seamless checkout.</p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <a href="#products" className="bg-white text-primary px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                  Start Shopping
                </a>
                <a href="/register" className="bg-transparent border border-white px-6 py-3 rounded-lg hover:bg-white/10 transition">
                  Create Account
                </a>
              </div>
            </motion.div>

            <div className="flex-1 hidden md:flex items-center justify-center relative">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-72 h-48 rounded-lg overflow-hidden shadow-2xl bg-white"
              >
                <img src={fallbackProducts[0].images[0].url} alt="hero-product-1" className="w-full h-full object-cover" />
              </motion.div>

              <motion.div
                initial={{ x: 40, y: -20, opacity: 0 }}
                animate={{ x: 10, y: -10, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-56 h-40 rounded-lg overflow-hidden shadow-lg absolute right-32 top-8 bg-white"
              >
                <img src={fallbackProducts[1].images[0].url} alt="hero-product-2" className="w-full h-full object-cover" />
              </motion.div>

              <motion.div
                initial={{ x: -40, y: 20, opacity: 0 }}
                animate={{ x: -10, y: 10, opacity: 1 }}
                transition={{ duration: 0.9 }}
                className="w-48 h-36 rounded-lg overflow-hidden shadow-lg absolute left-28 bottom-6 bg-white"
              >
                <img src={fallbackProducts[2].images[0].url} alt="hero-product-3" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Product Carousel + Filters */}
        <section id="products" className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <div className="flex items-center gap-3">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1 rounded-md ${selectedCategory === c ? 'bg-primary text-white' : 'bg-gray-100'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <ProductCarousel products={products.slice(0, 8)} />
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="bg-white py-20 border-t">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">1000+</h3>
              <p className="text-gray-600">Products</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
              <p className="text-gray-600">Vendors</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">10K+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

// Fallback products with Unsplash images for attractive placeholders
const fallbackProducts = [
  {
    _id: 'p1',
    name: 'Wireless Headphones',
    description: 'Comfortable over-ear headphones with deep bass and noise isolation.',
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    stock: 42,
    category: 'electronics',
    images: [
      { url: 'https://images.unsplash.com/photo-1518444022266-9f64a43d0b6b?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=1' },
      { url: 'https://images.unsplash.com/photo-1580894908360-2f9e2d9b0b0e?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=2' },
      { url: 'https://images.unsplash.com/photo-1518444022266-9f64a43d0b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=60' },
    ],
  },
  {
    _id: 'p2',
    name: 'Smart Watch Series',
    description: 'Track fitness, messages and more with a sleek AMOLED display.',
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    stock: 18,
    category: 'electronics',
    images: [
      { url: 'https://images.unsplash.com/photo-1519741494066-1c0a8fbc0cde?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=2' },
      { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55c86?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3' },
      { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=10' },
    ],
  },
  {
    _id: 'p3',
    name: 'Running Shoes',
    description: 'Lightweight shoes built for speed and comfort.',
    price: 59.99,
    discount: 10,
    stock: 76,
    category: 'apparel',
    images: [
      { url: 'https://images.unsplash.com/photo-1600180758890-9a0d2f3d8b6f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3' },
      { url: 'https://images.unsplash.com/photo-1520975919394-3b6c6b4a2b59?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=60' },
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=60' },
    ],
  },
  {
    _id: 'p4',
    name: 'Modern Lamp',
    description: 'Minimal desk lamp with adjustable brightness.',
    price: 29.99,
    stock: 120,
    category: 'home',
    images: [
      { url: 'https://images.unsplash.com/photo-1505691723518-34d53b3b0a64?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=4' },
      { url: 'https://images.unsplash.com/photo-1505691723520-0e1b3dfb8b8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=60' },
      { url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=12' },
    ],
  },
  {
    _id: 'p5',
    name: 'Backpack',
    description: 'Durable backpack with laptop compartment and water-resistant fabric.',
    price: 49.99,
    stock: 60,
    category: 'accessories',
    images: [
      { url: 'https://images.unsplash.com/photo-1524499943358-aca8d3d3a7c4?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=5' },
      { url: 'https://images.unsplash.com/photo-1519741494066-1c0a8fbc0cde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=60' },
      { url: 'https://images.unsplash.com/photo-1542291027-1d8f9f5a0b2a?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=13' },
    ],
  },
  {
    _id: 'p6',
    name: 'Coffee Maker',
    description: 'Brew barista-style coffee at home with programmable timer.',
    price: 89.99,
    stock: 30,
    category: 'home',
    images: [
      { url: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=6' },
      { url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=60' },
      { url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=14' },
    ],
  },
];
