import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { orderService, storeService } from '../services/index.js';
import { connectSocket } from '../services/socket.js';
import { useToast } from '../components/ToastProvider.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function VendorDashboard() {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [store, setStore] = useState(null);
  const [theme, setTheme] = useState({
    primaryColor: '#2874f0',
    accentColor: '#ffcc00',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter, system-ui, sans-serif',
  });
  const [liveSales, setLiveSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  if (!token || user?.role !== 'vendor') {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes, storeRes] = await Promise.all([
          orderService.getOrderStats(),
          orderService.getOrders(),
          storeService.getVendorStore(),
        ]);

        setStats(statsRes.stats);
        setOrders(ordersRes.orders);
        setStore(storeRes.store);
        if (storeRes.store?.theme) {
          setTheme(storeRes.store.theme);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token, (event, payload) => {
      if (event === 'vendor-sale' || event === 'live-sale') {
        setLiveSales((current) => [payload, ...current].slice(0, 6));
        toast.addToast(`New sale: ${payload.storeName} - $${payload.total.toFixed(2)}`, 'success');
      }
    });

    socket.on('connect', () => {
      socket.emit('joinRoom', `vendor:${user.id}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, user, toast]);

  if (loading) {
    return <div className="text-center py-20">Loading dashboard...</div>;
  }

  const handleThemeChange = (field, value) => {
    setTheme((current) => ({ ...current, [field]: value }));
  };

  const handleSaveTheme = async () => {
    try {
      await storeService.updateStore(store._id, { theme });
      toast.addToast('Store theme updated successfully', 'success');
    } catch (err) {
      toast.addToast('Failed to save theme settings', 'danger');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-primary">{stats?.totalOrders || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-2">Completed Orders</p>
              <p className="text-3xl font-bold text-success">{stats?.completedOrders || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-primary">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-2">Conversion Rate</p>
              <p className="text-3xl font-bold text-primary">{stats?.conversionRate || 0}%</p>
            </div>
          </div>

          {/* Store Info */}
          {store && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Store Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Store Name</p>
                  <p className="font-semibold">{store.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Category</p>
                  <p className="font-semibold">{store.category}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-semibold">{store.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-semibold">{store.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Branding & Theme Builder */}
          {store && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Theme Builder</h2>
                <button
                  type="button"
                  onClick={handleSaveTheme}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
                >
                  Save Theme
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-gray-600">Primary Color</span>
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                    className="mt-2 h-12 w-full rounded-lg border px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-600">Accent Color</span>
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                    className="mt-2 h-12 w-full rounded-lg border px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-600">Background Color</span>
                  <input
                    type="color"
                    value={theme.backgroundColor}
                    onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                    className="mt-2 h-12 w-full rounded-lg border px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-600">Font Family</span>
                  <input
                    type="text"
                    value={theme.fontFamily}
                    onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
                    className="mt-2 h-12 w-full rounded-lg border px-3 py-2"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Live sales */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Live Sales Feed</h2>
              <span className="text-sm text-gray-500">Real-time updates powered by Socket.io</span>
            </div>
            {liveSales.length === 0 ? (
              <p className="text-gray-600">Waiting for new sales...</p>
            ) : (
              <div className="space-y-3">
                {liveSales.map((sale, index) => (
                  <div key={`${sale.orderNumber}-${index}`} className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                    <p className="font-semibold">{sale.storeName} received a sale</p>
                    <p className="text-sm text-gray-600">Amount: ${sale.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Customer: {sale.customerName}</p>
                    <p className="text-xs text-gray-500">{new Date(sale.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">Order #</th>
                      <th className="text-left py-2">Customer</th>
                      <th className="text-left py-2">Amount</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-semibold">{order.orderNumber}</td>
                        <td className="py-3">{order.customer?.name}</td>
                        <td className="py-3 font-semibold text-primary">${order.total.toFixed(2)}</td>
                        <td className="py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-success'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 text-primary'
                                : 'bg-yellow-100 text-warning'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
