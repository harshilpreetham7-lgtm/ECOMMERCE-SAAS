import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingCart, User, LogOut, Menu, X, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('flipkart');
  const { user, token } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showMega, setShowMega] = useState(false);
  const searchRef = useRef();

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return;
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand text-white rounded-md flex items-center justify-center">EC</div>
          <span className="text-2xl font-bold text-brand">E-Commerce SaaS</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 mx-6" role="search">
          <div className="flex items-center w-full bg-gray-100 rounded-md px-3 py-2 gap-2">
            <select className="bg-transparent border-r pr-3 mr-3 text-sm outline-none">
              <option value="all">All</option>
              <option value="electronics">Electronics</option>
              <option value="apparel">Fashion</option>
            </select>
            <Search className="w-5 h-5 text-gray-500" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, brands and more"
              className="bg-transparent flex-1 outline-none text-sm px-2"
            />
            <button type="submit" className="ml-3 px-4 py-1 text-sm bg-brand text-white rounded">Search</button>
          </div>
        </form>

        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-brand transition">
            Home
          </Link>
          <div className="relative" onMouseEnter={() => setShowMega(true)} onMouseLeave={() => setShowMega(false)}>
            <Link to="/products" className="hover:text-brand transition">
              Shop
            </Link>

            {showMega && (
              <div className="absolute left-0 top-8 w-80 bg-white shadow-lg border rounded-md p-4 z-50">
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/products?category=electronics" className="text-sm hover:text-brand">Electronics</Link>
                  <Link to="/products?category=apparel" className="text-sm hover:text-brand">Fashion</Link>
                  <Link to="/products?category=home" className="text-sm hover:text-brand">Home</Link>
                  <Link to="/products?category=accessories" className="text-sm hover:text-brand">Accessories</Link>
                  <Link to="/products?category=beauty" className="text-sm hover:text-brand">Beauty</Link>
                  <Link to="/products?category=toys" className="text-sm hover:text-brand">Toys</Link>
                </div>
              </div>
            )}
          </div>
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
