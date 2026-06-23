import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateCartItem, clearCart, setCart } from '../store/slices/cartSlice.js';
import { cartService } from '../services/index.js';
import { Trash2, Plus, Minus } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, total } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return navigate('/login');
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await cartService.removeFromCart(itemId);
      dispatch(removeFromCart(itemId));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) return;
    try {
      await cartService.updateCartItem(itemId, { quantity });
      dispatch(updateCartItem({ id: itemId, quantity }));
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
              <button
                onClick={() => navigate('/products')}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md">
                  {items.map((item) => (
                    <div key={item._id} className="border-b p-6 flex gap-4">
                      {item.product?.images?.[0] && (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{item.product?.name}</h3>
                        <p className="text-gray-600 mb-4">Price: ${item.price}</p>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-danger hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>$0.00</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${total?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition font-bold mb-3"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => navigate('/products')}
                    className="w-full border border-primary text-primary py-3 rounded-lg hover:bg-primary hover:text-white transition font-bold"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
