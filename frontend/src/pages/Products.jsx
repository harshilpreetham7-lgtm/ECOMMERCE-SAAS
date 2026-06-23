import { useEffect, useState } from 'react';
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
  const [filters, setFilters] = useState({ min: 0, max: 1000, rating: 0 });
  const { token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await productService.getProducts('', { limit: 100 });
        setProducts(res.products || []);
      } catch (e) {
        console.error(e);
        // fallback to empty
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const addToCart = async (product) => {
    if (!token) return alert('Please login to add to cart');
    try {
      const res = await cartService.addToCart({ productId: product._id, quantity: 1 });
      dispatch(setCart(res.cart));
      alert('Added to cart');
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter((p) => p.price >= filters.min && p.price <= filters.max && (p.rating || 0) >= filters.rating);

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">All Products</h1>
        <div className="flex gap-6">
          <aside className="w-64 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Filters</h3>
            <div className="mb-3">
              <label className="text-sm">Price min</label>
              <input type="number" value={filters.min} onChange={(e) => setFilters({ ...filters, min: Number(e.target.value) })} className="w-full" />
            </div>
            <div className="mb-3">
              <label className="text-sm">Price max</label>
              <input type="number" value={filters.max} onChange={(e) => setFilters({ ...filters, max: Number(e.target.value) })} className="w-full" />
            </div>
            <div className="mb-3">
              <label className="text-sm">Min rating</label>
              <select value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })} className="w-full">
                <option value={0}>Any</option>
                <option value={3}>3+</option>
                <option value={4}>4+</option>
              </select>
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => (
                  <ProductCard key={p._id} product={p} onAddToCart={addToCart} onView={(prod) => setSelected(prod)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ProductModal product={selected} onClose={() => setSelected(null)} onAddToCart={addToCart} />
    </>
  );
}
