import { useEffect, useMemo, useState } from 'react';
import { Heart, Plus, Minus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ProductCarousel from '../components/ProductCarousel.jsx';
import { productService, cartService } from '../services/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../store/slices/cartSlice.js';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await productService.getProduct(id);
        setProduct(response.product || response);
        const category = (response.product || response)?.category;
        if (category) {
          const relatedResponse = await productService.getProducts('', { category, limit: 6 });
          setRelated((relatedResponse.products || []).filter((item) => item._id !== id).slice(0, 4));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await cartService.addToCart({ productId: product._id, quantity });
      dispatch(setCart(res.cart));
      alert('Added to cart');
    } catch (err) {
      console.error(err);
      alert('Unable to add to cart');
    }
  };
  const savings = useMemo(() => {
  if (!product?.originalPrice) return 0;

  return (
    (product.originalPrice - product.price) *
    quantity
  );
}, [product, quantity]);
  const images = useMemo(
    () => (product?.images && product.images.length > 0 ? product.images : [{ url: 'https://via.placeholder.com/900x600?text=No+Image' }]),
    [product]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-600">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-600">
          <p>Product not found.</p>
          <button onClick={() => navigate('/products')} className="mt-4 px-4 py-2 rounded-lg bg-brand text-white">
            Back to shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <section className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <div className="rounded-3xl overflow-hidden border border-slate-200">
                    <img src={images[selectedImage].url} alt={product.name} className="w-full h-[420px] object-cover" />
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`rounded-3xl overflow-hidden border ${index === selectedImage ? 'border-brand ring-2 ring-brand/30' : 'border-slate-200'}`}
                      >
                        <img src={img.url} alt={`${product.name} ${index + 1}`} className="w-full h-24 object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{product.category || 'Category'}</p>
                    <h1 className="text-4xl font-bold text-slate-900">{product.name}</h1>
                    <p className="text-slate-600">{product.description}</p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-3xl font-bold text-brand">${product.price.toFixed(2)}</p>
                        {product.originalPrice && (
                          <p className="text-sm text-slate-500 line-through">${product.originalPrice.toFixed(2)}</p>
                        )}
                      </div>
                      {product.rating > 0 && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                          ★ {product.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
                      <span className="rounded-full bg-white px-3 py-2 border">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                      {product.discount > 0 && <span className="rounded-full bg-brand/10 text-brand px-3 py-2">{product.discount}% off</span>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-slate-700">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        max={product.stock || 10}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                        className="w-24 rounded-2xl border border-slate-200 px-3 py-2"
                      />
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="w-full rounded-2xl bg-brand px-5 py-3 text-white font-semibold hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Add to cart
                      </button>
                      <button
                        onClick={() => navigate('/products')}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-slate-700 hover:bg-slate-100"
                      >
                        Back to products
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-lg border border-slate-200">
                <h2 className="text-xl font-semibold mb-4">Seller info</h2>
                <p className="text-slate-600">Fast delivery from trusted vendors with verified reviews and quick support.</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-lg border border-slate-200">
                <h2 className="text-xl font-semibold mb-4">Shipping & returns</h2>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li>Free delivery above $49</li>
                  <li>30-day easy returns</li>
                  <li>Secure checkout</li>
                </ul>
              </div>
            </aside>
          </section>

          {related.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-brand font-semibold">Related</p>
                  <h2 className="text-3xl font-bold text-slate-900">You may also like</h2>
                </div>
              </div>
              <ProductCarousel products={related} />
            </section>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
