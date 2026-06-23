import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('flipkart');
  const { user, token } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    const stored = localStorage.getItem('site-theme');
    const initial = stored || 'flipkart';
    setTheme(initial);
    document.body.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'flipkart' ? 'amazon' : 'flipkart';
    setTheme(next);
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('site-theme', next);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary text-white rounded-md flex items-center justify-center">EC</div>
          <span className="text-2xl font-bold text-primary">E-Commerce SaaS</span>
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

          {/* Theme toggle */}
          <button onClick={toggleTheme} className="px-3 py-2 border rounded mr-2 hidden md:inline-block">
            {theme === 'flipkart' ? 'Flipkart' : 'Amazon'}
          </button>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav overlay */}
      {open && (
        <div className="md:hidden bg-white shadow-lg p-4">
          <nav className="flex flex-col gap-3">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setOpen(false)}>Shop</Link>
            {user?.role === 'vendor' && <Link to="/vendor/dashboard" onClick={() => setOpen(false)}>Vendor Dashboard</Link>}
            {user?.role === 'superadmin' && <Link to="/admin/dashboard" onClick={() => setOpen(false)}>Admin Panel</Link>}
            {!token && <Link to="/login" onClick={() => setOpen(false)}>Login</Link>}
            {!token && <Link to="/register" onClick={() => setOpen(false)}>Register</Link>}
          </nav>
        </div>
      )}
    </header>
  );
}
