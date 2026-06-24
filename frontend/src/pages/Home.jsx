import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productService, cartService } from '../services/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../store/slices/cartSlice.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductCarousel from '../components/ProductCarousel.jsx';
import DealsCarousel from '../components/DealsCarousel.jsx';
import FeaturedCategories from '../components/FeaturedCategories.jsx';
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
  const displayProducts = filteredProducts.slice(0, 16);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50">
        <section className="relative overflow-hidden bg-gradient-to-r from-brand to-sky-500 text-white py-20">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.25),_transparent_35%)]" />
          <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex-1"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                Flipkart-inspired marketplace
              </span>
              <h1 className="mt-6 text-5xl md:text-6xl font-bold leading-tight">
                Discover top deals and premium products with a modern shopping experience.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-white/90">
                Shop fast-moving categories, curated deals, and best-selling products with smooth animations and an elegant layout that feels premium.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-stretch gap-4 sm:items-center">
                <a href="#products" className="btn-brand px-6 py-3 rounded-lg font-semibold shadow-lg shadow-brand/30 text-center">
                  Start Shopping
                </a>
                <a href="#deals" className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-white transition hover:bg-white/20">
                  View top deals
                </a>
              </div>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-3xl font-bold">24k+</p>
                  <p className="mt-2 text-sm text-white/80">Products listed</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-3xl font-bold">99.9%</p>
                  <p className="mt-2 text-sm text-white/80">Delivery on time</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-3xl font-bold">4.9/5</p>
                  <p className="mt-2 text-sm text-white/80">Customer satisfaction</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3"
            >
              {fallbackProducts.slice(0, 6).map((product, index) => (
                <div key={product._id} className="overflow-hidden rounded-3xl bg-white/90 shadow-2xl shadow-slate-900/10">
                  <img src={product.images[0].url} alt={product.name} className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Featured</p>
                    <h3 className="mt-3 text-lg font-semibold text-slate-900 line-clamp-2">{product.name}</h3>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-xl font-bold text-brand">${product.price}</span>
                      <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">{product.discount}% OFF</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <div className="bg-brand text-white py-2">
          <div className="max-w-7xl mx-auto px-4 flex flex-col gap-2 sm:flex-row items-center justify-between text-sm">
            <div>Free delivery on orders above $49 • 30-day returns</div>
            <div>Big Summer Sale — Up to 60% off on selected items</div>
          </div>
        </div>

        <FeaturedCategories categories={categories.filter((c) => c !== 'all')} />

        <section id="deals" className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand font-semibold">Hot Picks</p>
              <h2 className="text-3xl font-bold">Deals of the Day</h2>
            </div>
          </div>
          <DealsCarousel deals={products.slice(0, 10)} />
        </section>

        <section id="products" className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand font-semibold">Shop all</p>
              <h2 className="text-3xl font-bold">Browse Products</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === c ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-24">
              <p className="text-slate-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-slate-500">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </section>

        <section className="bg-white py-20 border-t">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-brand mb-2">1000+</h3>
              <p className="text-slate-500">Products</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-brand mb-2">500+</h3>
              <p className="text-slate-500">Vendors</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-brand mb-2">10K+</h3>
              <p className="text-slate-500">Happy Customers</p>
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
