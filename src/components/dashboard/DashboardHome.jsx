import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { dashboardAPI } from '../../services/api';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [overviewRes, lowStockRes, topProductsRes, recentOrdersRes] = await Promise.all([
        dashboardAPI.getOverview(),
        dashboardAPI.getLowStock(),
        dashboardAPI.getTopProducts({ limit: 5 }),
        dashboardAPI.getRecentOrders({ limit: 5 })
      ]);
      setOverview(overviewRes.data.data);
      setLowStockProducts(lowStockRes.data.products);
      setTopProducts(topProductsRes.data.products);
      setRecentOrders(recentOrdersRes.data.orders);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <ScheduleIcon />;
      case 'confirmed': return <CheckCircleIcon />;
      case 'shipped': return <ShoppingCartIcon />;
      case 'delivered': return <CheckCircleIcon />;
      case 'cancelled': return <WarningIcon />;
      default: return <ScheduleIcon />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
            <p className="text-gray-600">Here's what's happening with your store today.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              onClick={() => navigate('/admin/products')}
            >
              <InventoryIcon className="w-4 h-4" />
              Manage Products
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors font-medium"
              onClick={() => navigate('/admin/orders')}
            >
              <ShoppingCartIcon className="w-4 h-4" />
              View Orders
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Sales</span>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <MoneyIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(overview?.totalSales || 0)}</div>
          <div className="text-sm text-gray-600 mb-4">Monthly: {formatCurrency(overview?.monthlySales || 0)}</div>
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <TrendingUpIcon className="w-4 h-4" />
            <span>+12.5%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Orders</span>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <ShoppingCartIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{overview?.totalOrders || 0}</div>
          <div className="text-sm text-gray-600 mb-4">This month: {overview?.monthlyOrders || 0}</div>
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <TrendingUpIcon className="w-4 h-4" />
            <span>+8.3%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Products</span>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <InventoryIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{overview?.totalProducts || 0}</div>
          <div className="text-sm text-gray-600 mb-4">Active: {overview?.activeProducts || 0}</div>
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <TrendingUpIcon className="w-4 h-4" />
            <span>+5.2%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Customers</span>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <PeopleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{overview?.totalCustomers || 0}</div>
          <div className="text-sm text-gray-600 mb-4">Active: {overview?.activeCustomers || 0}</div>
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <TrendingUpIcon className="w-4 h-4" />
            <span>+3.7%</span>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCartIcon className="w-5 h-5 text-white" />
                <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
              </div>
              <button
                className="px-3 py-1 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors text-sm font-medium"
                onClick={() => navigate('/admin/orders')}
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <ShoppingCartIcon className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg">No recent orders</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order, index) => (
                  <div key={order._id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">#{order.order_number || order._id?.slice(-6)}</div>
                      <div className="text-sm text-gray-600">{order.customer_name || 'Guest'}</div>
                      <div className="font-semibold text-green-600 text-sm">{formatCurrency(order.final_amount || 0)}</div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}>
                      {getStatusIcon(order.status)}
                      {order.status || 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StarIcon className="w-5 h-5 text-white" />
                <h3 className="text-lg font-semibold text-white">Top Products</h3>
              </div>
              <button
                className="px-3 py-1 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors text-sm font-medium"
                onClick={() => navigate('/admin/products')}
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {topProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <InventoryIcon className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg">No products data</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={product._id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{product.name}</div>
                      <div className="text-sm text-gray-600 capitalize">{product.category}</div>
                      <div className="font-semibold text-green-600 text-sm">{formatCurrency(product.price || 0)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{product.total_sales || 0} sold</div>
                      <div className="flex items-center gap-1 text-sm text-yellow-500 font-semibold">
                        <StarIcon className="w-4 h-4" />
                        {product.rating || '4.5'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <WarningIcon className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-800">Low Stock Alert</h3>
            </div>
            <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {lowStockProducts.length}
            </div>
          </div>
          <div className="text-yellow-800 mb-6">
            <p className="text-base leading-relaxed">
              {lowStockProducts.length} products are running low on stock and need immediate attention.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {lowStockProducts.slice(0, 3).map((product, index) => (
              <div key={product._id || index} className="bg-white p-4 rounded-lg border border-yellow-300">
                <div className="font-semibold text-gray-900 text-sm mb-1">{product.name}</div>
                <div className="text-sm text-gray-600 capitalize mb-3">{product.category}</div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600 font-semibold">Stock: {product.stock || 0}</span>
                  <span className="text-gray-600">Min: {product.min_stock || 10}</span>
                </div>
              </div>
            ))}
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            onClick={() => navigate('/admin/products')}
          >
            <EditIcon className="w-4 h-4" />
            Manage Stock
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-5">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200"
            onClick={() => navigate('/admin/products')}
          >
            <InventoryIcon className="w-8 h-8 text-green-600" />
            <span className="text-sm font-semibold text-center">Add Product</span>
          </button>
          <button
            className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200"
            onClick={() => navigate('/admin/orders')}
          >
            <ShoppingCartIcon className="w-8 h-8 text-green-600" />
            <span className="text-sm font-semibold text-center">View Orders</span>
          </button>
          <button
            className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200"
            onClick={() => navigate('/admin/customers')}
          >
            <PeopleIcon className="w-8 h-8 text-green-600" />
            <span className="text-sm font-semibold text-center">Manage Customers</span>
          </button>
          <button
            className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200"
            onClick={() => navigate('/admin/reports')}
          >
            <VisibilityIcon className="w-8 h-8 text-green-600" />
            <span className="text-sm font-semibold text-center">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 