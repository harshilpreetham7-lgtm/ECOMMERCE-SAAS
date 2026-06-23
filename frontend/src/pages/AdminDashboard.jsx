import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/index.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function AdminDashboard() {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  if (!token || user?.role !== 'superadmin') {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, statsRes] = await Promise.all([
          orderService.getOrders(),
          orderService.getOrderStats(),
        ]);

        setOrders(ordersRes.orders);
        setStats(statsRes.stats);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading admin dashboard...</div>;
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map((o) => o.customer?._id)).size;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-primary">{totalOrders}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-2">Total Customers</p>
              <p className="text-3xl font-bold text-success">{totalCustomers}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-2">Completed Orders</p>
              <p className="text-3xl font-bold text-success">{completedOrders}</p>
            </div>
          </div>

          {/* All Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">All Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">Order #</th>
                      <th className="text-left py-2">Customer</th>
                      <th className="text-left py-2">Store</th>
                      <th className="text-left py-2">Amount</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-semibold">{order.orderNumber}</td>
                        <td className="py-3">{order.customer?.name}</td>
                        <td className="py-3">{order.store?.name}</td>
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
