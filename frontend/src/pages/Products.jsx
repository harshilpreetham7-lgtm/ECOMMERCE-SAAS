import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';
import { productService, cartService } from '../services/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../store/slices/cartSlice.js';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('latest');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({ min: 0, max: 1000, rating: 0 });
  const [filterOpen, setFilterOpen] = useState(false);
  const { token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await productService.getProducts('', { limit: 100 });
        setProducts(res.products && res.products.length > 0 ? res.products : fallbackProducts);
      } catch (e) {
        console.error(e);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const params = {};
    if (category !== 'all') params.category = category;
    if (search.trim()) params.search = search.trim();
    setSearchParams(params, { replace: true });
  }, [category, search, setSearchParams]);

  const addToCart = async (product) => {
    if (!token) return alert('Please login to add to cart');
    try {
      const res = await cartService.addToCart({ productId: product._id, quantity: 1 });
      dispatch(setCart(res.cart));
      alert('Added to cart');
    } catch (err) {
      console.error(err);
      alert('Unable to add to cart');
    }
  };

  const categories = useMemo(
    () => ['all', ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (category !== 'all') list = list.filter((item) => item.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }
    list = list.filter(
      (item) => item.price >= filters.min && item.price <= filters.max && (item.rating || 0) >= filters.rating
    );

    switch (sort) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        list.sort((a, b) => (b._id || 0).toString().localeCompare((a._id || 0).toString()));
    }

    return list;
  }, [products, category, filters, sort, search]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-r from-brand to-sky-500 p-10 text-white shadow-2xl shadow-brand/20"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/80">Explore the marketplace</p>
                <h1 className="mt-4 text-4xl md:text-5xl font-bold">Find the best products at unbeatable prices.</h1>
                <p className="mt-4 max-w-2xl text-lg text-white/90">
                  Use powerful filters, sort by price or rating, and discover a wide collection of products crafted for modern shopping.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2">
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-3xl font-semibold">{filteredProducts.length}</p>
                  <p className="mt-2 text-sm text-white/80">Products available</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-3xl font-semibold">{categories.length - 1}</p>
                  <p className="mt-2 text-sm text-white/80">Categories</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-3xl font-semibold">Fast</p>
                  <p className="mt-2 text-sm text-white/80">Smooth browsing</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 shadow-sm outline-none focus:border-brand"
                />
              </div>
              <button
                onClick={() => setFilterOpen((open) => !open)}
                className="lg:hidden rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm"
              >
                {filterOpen ? 'Hide filters' : 'Show filters'}
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
              <aside className={`${filterOpen ? 'block' : 'hidden'} lg:block rounded-3xl bg-white p-6 shadow-lg h-fit`}>
              <h2 className="text-xl font-semibold mb-5">Refine search</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-3">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          category === cat ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-3">Price range</p>
                  <div className="grid gap-3">
                    <input
                      type="number"
                      value={filters.min}
                      onChange={(e) => setFilters({ ...filters, min: Number(e.target.value) || 0 })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={filters.max}
                      onChange={(e) => setFilters({ ...filters, max: Number(e.target.value) || 1000 })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-3 block">Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <option value={0}>All ratings</option>
                    <option value={3}>3 stars & up</option>
                    <option value={4}>4 stars & up</option>
                    <option value={4.5}>4.5 stars & up</option>
                  </select>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-2">Selected</p>
                  <p className="text-lg font-semibold text-slate-900">{category === 'all' ? 'All categories' : category}</p>
                  <p className="mt-2 text-sm text-slate-500">{filteredProducts.length} matching products</p>
                </div>
              </div>
            </aside>
          </div>

            <main>
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand font-semibold">Product catalogue</p>
                  <h2 className="mt-3 text-3xl font-bold text-slate-900">Shop top products</h2>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="rounded-full bg-white border border-slate-200 px-4 py-3 shadow-sm">
                    <span className="text-sm text-slate-500">Sort by:</span>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="ml-3 bg-transparent text-slate-900 outline-none"
                    >
                      <option value="latest">Latest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>
                  <div className="rounded-full bg-white border border-slate-200 px-4 py-3 shadow-sm">
                    <span className="text-sm text-slate-500">Showing</span>
                    <span className="ml-2 font-semibold text-slate-900">{filteredProducts.length}</span>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="rounded-3xl bg-white p-12 text-center shadow-sm">Loading products...</div>
              ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((p) => (
                    <ProductCard key={p._id} product={p} onAddToCart={addToCart} onView={(prod) => setSelected(prod)} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
      <ProductModal product={selected} onClose={() => setSelected(null)} onAddToCart={addToCart} />
    </>
  );
}

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
    rating: 4.7,
    images: [
      { url: 'https://images.unsplash.com/photo-1518444022266-9f64a43d0b6b?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=1' },
      { url: 'https://images.unsplash.com/photo-1580894908360-2f9e2d9b0b0e?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=2' },
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
    rating: 4.4,
    images: [
      { url: 'https://images.unsplash.com/photo-1519741494066-1c0a8fbc0cde?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=2' },
      { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55c86?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3' },
    ],
  },
  {
    _id: 'p3',
    name: 'Running Shoes',
    description: 'Lightweight shoes built for speed and comfort.',
    price: 59.99,
    originalPrice: 69.99,
    discount: 14,
    stock: 76,
    category: 'apparel',
    rating: 4.5,
    images: [
      { url: 'https://images.unsplash.com/photo-1600180758890-9a0d2f3d8b6f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3' },
      { url: 'https://images.unsplash.com/photo-1520975919394-3b6c6b4a2b59?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=60' },
    ],
  },
  {
    _id: 'p4',
    name: 'Modern Lamp',
    description: 'Minimal desk lamp with adjustable brightness.',
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    stock: 120,
    category: 'home',
    rating: 4.2,
    images: [
      { url: 'https://images.unsplash.com/photo-1505691723518-34d53b3b0a64?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=4' },
      { url: 'https://images.unsplash.com/photo-1505691723520-0e1b3dfb8b8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=60' },
    ],
  },
  {
    _id: 'p5',
    name: 'Backpack',
    description: 'Durable backpack with laptop compartment and water-resistant fabric.',
    price: 49.99,
    originalPrice: 69.99,
    discount: 28,
    stock: 60,
    category: 'accessories',
    rating: 4.6,
    images: [
      { url: 'https://images.unsplash.com/photo-1524499943358-aca8d3d3a7c4?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=5' },
      { url: 'https://images.unsplash.com/photo-1519741494066-1c0a8fbc0cde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=60' },
    ],
  },
  {
    _id: 'p6',
    name: 'Coffee Maker',
    description: 'Brew barista-style coffee at home with programmable timer.',
    price: 89.99,
    originalPrice: 109.99,
    discount: 18,
    stock: 30,
    category: 'home',
    rating: 4.8,
    images: [
      { url: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=6' },
      { url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=60' },
    ],
  },
  {
    _id: 'p7',
    name: 'Wireless Speaker',
    description: 'Portable Bluetooth speaker with rich bass and 12-hour battery.',
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    stock: 48,
    category: 'electronics',
    rating: 4.3,
    images: [
      { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=7' },
    ],
  },
  {
    _id: 'p8',
    name: 'Denim Jacket',
    description: 'Stylish denim jacket with modern fit and soft lining.',
    price: 69.99,
    originalPrice: 89.99,
    discount: 22,
    stock: 25,
    category: 'apparel',
    rating: 4.5,
    images: [
      { url: 'https://images.unsplash.com/photo-1520975919394-3b6c6b4a2b59?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=8' },
    ],
  },
  {
    _id: 'p9',
    name: 'Desk Organizer',
    description: 'Keep your workspace tidy with this elegant desk organizer.',
    price: 24.99,
    stock: 150,
    category: 'home',
    rating: 4.1,
    images: [
      { url: 'https://images.unsplash.com/photo-1519741494066-1c0a8fbc0cde?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=9' },
    ],
  },
  {
    _id: 'p10',
    name: 'Leather Wallet',
    description: 'Premium leather wallet with RFID protection and multiple slots.',
    price: 34.99,
    originalPrice: 49.99,
    discount: 30,
    stock: 72,
    category: 'accessories',
    rating: 4.7,
    images: [
      { url: 'https://images.unsplash.com/photo-1524499943358-aca8d3d3a7c4?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=10' },
    ],
  },
  {
    _id: 'p11',
    name: 'Fitness Band',
    description: 'Track activity, heart rate, and sleep with precise metrics.',
    price: 39.99,
    originalPrice: 59.99,
    discount: 33,
    stock: 90,
    category: 'electronics',
    rating: 4.2,
    images: [
      { url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=11' },
    ],
  },
  {
    _id: 'p12',
    name: 'Scented Candles',
    description: 'Set of 3 scented candles for a calming home environment.',
    price: 19.99,
    stock: 140,
    category: 'home',
    rating: 4.4,
    images: [
      { url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=60' },
    ],
  },
  {
    _id: 'p13',
    name: 'Gaming Keyboard',
    description: 'RGB mechanical keyboard with tactile feedback and profile macros.',
    price: 89.99,
    originalPrice: 109.99,
    discount: 18,
    stock: 22,
    category: 'electronics',
    rating: 4.6,
    images: [
      { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=12' },
    ],
  },
  {
    _id: 'p14',
    name: 'Cotton T-Shirt',
    description: 'Soft cotton tee in a classic fit for everyday comfort.',
    price: 24.99,
    stock: 90,
    category: 'apparel',
    rating: 4.3,
    images: [
      { url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=13' },
    ],
  },
  {
    _id: 'p15',
    name: 'Travel Mug',
    description: 'Insulated travel mug that keeps drinks hot for 8 hours.',
    price: 19.99,
    stock: 110,
    category: 'accessories',
    rating: 4.5,
    images: [
      { url: 'https://images.unsplash.com/photo-1495121605193-b116b5b09a36?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=14' },
    ],
  },
];
