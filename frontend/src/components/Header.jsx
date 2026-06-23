import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingCart, User, LogOut } from 'lucide-react';

export default function Header() {
  const { user, token } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          🛍️ E-Commerce SaaS
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-primary transition">
            Home
          </Link>
          <Link to="/products" className="hover:text-primary transition">
            Shop
          </Link>
          {user?.role === 'vendor' && (
            <Link to="/vendor/dashboard" className="hover:text-primary transition">
              Vendor Dashboard
            </Link>
          )}
          {user?.role === 'superadmin' && (
            <Link to="/admin/dashboard" className="hover:text-primary transition">
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {token ? (
            <>
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{user?.name}</span>
              </div>
              <button className="text-danger hover:text-red-700">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
