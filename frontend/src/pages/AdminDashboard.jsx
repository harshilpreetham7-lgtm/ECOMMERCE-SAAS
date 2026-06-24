import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { connectSocket } from '../services/socket.js';
import { useToast } from '../components/ToastProvider.jsx';
import { orderService } from '../services/index.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function AdminDashboard() {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const toast = useToast();

  const [orders, setOrders] = useState([]);
  const [platformSales, setPlatformSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!token || user?.role !== 'superadmin') {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const res = await orderService.getOrders();

      setOrders(res.orders || []);
    } catch (error) {
      console.error(error);
      toast.addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token, (event, payload) => {
      if (event === 'platform-sale' || event === 'live-sale') {
        setPlatformSales((current) => [payload, ...current].slice(0, 10));

        toast.addToast(
          `${payload.storeName} sold for $${payload.total.toFixed(2)}`,
          'success'
        );
      }
    });

    socket.on('connect', () => {
      socket.emit('joinRoom', 'superadmin');
    });

    return () => socket.disconnect();
  }, [token]);

  const dashboardStats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    const totalCustomers = new Set(
      orders.map((o) => o.customer?._id)
    ).size;

    const completedOrders = orders.filter(
      (o) => o.status === 'delivered'
    ).length;

    const pendingOrders = orders.filter(
      (o) => o.status === 'pending'
    ).length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers,
      completedOrders,
      pendingOrders,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        order.customer?.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">
              Super Admin Dashboard
            </h1>

            <button
              onClick={fetchDashboardData}
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              Refresh
            </button>
          </div>

          {/* Stats */}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Orders</p>
              <p className="text-3xl font-bold text-primary">
                {dashboardStats.totalOrders}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Revenue</p>
              <p className="text-3xl font-bold text-primary">
                ${dashboardStats.totalRevenue.toFixed(2)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Customers</p>
              <p className="text-3xl font-bold text-success">
                {dashboardStats.totalCustomers}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-success">
                {dashboardStats.completedOrders}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-warning">
                {dashboardStats.pendingOrders}
              </p>
            </div>

          </div>

          {/* Filters */}

          <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex flex-col md:flex-row gap-4">

            <input
              type="text"
              placeholder="Search Order / Customer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-2 flex-1"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>

          </div>

          {/* Live Sales */}

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Live Platform Sales
            </h2>

            {platformSales.length === 0 ? (
              <p>No live sales yet...</p>
            ) : (
              <div className="space-y-3">
                {platformSales.map((sale, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-slate-50"
                  >
                    <p className="font-semibold">
                      {sale.storeName}
                    </p>

                    <p>
                      Amount: ${sale.total.toFixed(2)}
                    </p>

                    <p>
                      Customer: {sale.customerName}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Orders Table */}

          <div className="bg-white rounded-lg shadow-md p-6">

            <h2 className="text-2xl font-bold mb-4">
              Orders Management
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2">Order</th>
                    <th className="text-left py-2">Customer</th>
                    <th className="text-left py-2">Store</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3">
                        {order.orderNumber}
                      </td>

                      <td className="py-3">
                        {order.customer?.name}
                      </td>

                      <td className="py-3">
                        {order.store?.name}
                      </td>

                      <td className="py-3 font-semibold text-primary">
                        ${order.total.toFixed(2)}
                      </td>

                      <td className="py-3">
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-success">
                          {order.status}
                        </span>
                      </td>

                      <td className="py-3">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}