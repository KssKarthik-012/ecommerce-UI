import React, { useEffect, useState } from 'react';
import { ordersAPI } from '../../services/api';
import AlertModal from '../shared/AlertModal';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as PendingIcon,
  Build as ProcessingIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Link as LinkIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Helper function to get status styling
const getStatusStyle = (status) => {
  const statusLower = status?.toLowerCase();
  
  switch (statusLower) {
    case 'pending':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-300',
        icon: <PendingIcon className="w-3 h-3" />
      };
    case 'processing':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-300',
        icon: <ProcessingIcon className="w-3 h-3" />
      };
    case 'shipped':
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-300',
        icon: <ShippingIcon className="w-3 h-3" />
      };
    case 'delivered':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-300',
        icon: <CheckCircleIcon className="w-3 h-3" />
      };
    case 'cancelled':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300',
        icon: <CancelIcon className="w-3 h-3" />
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-300',
        icon: <PendingIcon className="w-3 h-3" />
      };
  }
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deliveryLink, setDeliveryLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    onConfirm: null,
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUserRole(JSON.parse(userData).role);
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await ordersAPI.getAll();
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredOrders = orders.filter(order =>
    order.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    order.order_number?.toLowerCase().includes(search.toLowerCase())
  );

  // Filter to show only paid orders
  const paidOrders = filteredOrders.filter(order => order.payment_status === 'Paid');

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const closeOrderDetail = () => {
    setSelectedOrder(null);
    setShowDetailModal(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(true);
    try {
      // Map status to appropriate delivery status
      let deliveryStatus = 'Pending';
      if (newStatus === 'Processing') {
        deliveryStatus = 'Processing';
      } else if (newStatus === 'Shipped') {
        deliveryStatus = 'Shipped';
      } else if (newStatus === 'Delivered') {
        deliveryStatus = 'Delivered';
      } else if (newStatus === 'Cancelled') {
        deliveryStatus = 'Cancelled';
      }
      
      await ordersAPI.updateStatus(orderId, { 
        status: newStatus,
        delivery_status: deliveryStatus
      });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ 
          ...selectedOrder, 
          status: newStatus,
          delivery_status: deliveryStatus
        });
      }
    } catch (err) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to update status',
        type: 'error',
        onConfirm: null,
      });
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    setDeleteLoading(true);
    try {
      await ordersAPI.delete(orderId);
      fetchOrders();
      closeOrderDetail();
    } catch (err) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to delete order',
        type: 'error',
        onConfirm: null,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (order) => {
    setEditingId(order._id);
    setDeliveryLink(order.delivery_tracking_link || '');
  };

  const handleSave = async (orderId) => {
    setSaving(true);
    try {      
      const response = await ordersAPI.setDeliveryLink(orderId, { delivery_link: deliveryLink });
      setEditingId(null);
      setDeliveryLink('');
      // Force refresh the orders data
      await fetchOrders();
    } catch (err) {
      console.error('Failed to save delivery link:', err);
      console.error('Error details:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error URL:', err.config?.url);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to save delivery link',
        type: 'error',
        onConfirm: null,
      });
    } finally {
      setSaving(false);
    }
  };

  if (userRole !== 'admin' && userRole !== 'staff') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CancelIcon className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onConfirm={alertModal.onConfirm}
      />
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
            <p className="text-gray-600">Manage and track all customer orders</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-sm font-medium">
              {paidOrders.length} Orders
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Search by customer name or order number..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-5 h-5 text-red-500">⚠️</div>
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivery</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tracking</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paidOrders.map(order => {
                const statusStyle = getStatusStyle(order.status);
                const deliveryStatusStyle = getStatusStyle(order.delivery_status);
                
                return (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-sm">#{order.order_number?.slice(-4)}</span>
                        </div>
                        <span className="font-medium text-gray-900">{order.order_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <PersonIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{order.customer_name}</div>
                          <div className="text-sm text-gray-600">{order.customer_contact}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.icon}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-green-600 font-semibold">
                        <MoneyIcon className="w-4 h-4" />
                        ₹{order.final_amount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${deliveryStatusStyle.bg} ${deliveryStatusStyle.text}`}>
                        {deliveryStatusStyle.icon}
                        {order.delivery_status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === order._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={deliveryLink}
                            onChange={e => setDeliveryLink(e.target.value)}
                            placeholder="Enter tracking link"
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-48"
                          />
                        </div>
                      ) : order.delivery_tracking_link ? (
                        <a 
                          href={order.delivery_tracking_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <LinkIcon className="w-4 h-4" />
                          Track
                        </a>
                      ) : (
                        <span className="text-gray-500 text-sm">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {order.payment_status === 'Paid' && (
                          editingId === order._id ? (
                            <>
                              <button 
                                onClick={() => handleSave(order._id)} 
                                disabled={saving}
                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                title="Save"
                              >
                                {saving ? (
                                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <SaveIcon className="w-4 h-4" />
                                )}
                              </button>
                              <button 
                                onClick={() => setEditingId(null)} 
                                disabled={saving}
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <CloseIcon className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleEdit(order)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title={order.delivery_tracking_link ? "Edit Link" : "Add Link"}
                            >
                              <EditIcon className="w-4 h-4" />
                            </button>
                          )
                        )}
                        <button 
                          onClick={() => openOrderDetail(order)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <ViewIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order._id)} 
                          disabled={deleteLoading}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Order"
                        >
                          {deleteLoading ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <DeleteIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{paidOrders.length}</span> of <span className="font-semibold">{orders.length}</span> orders
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed" disabled>
              ← Previous
            </button>
            <button className="px-3 py-1 bg-green-600 text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-1 text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed" disabled>
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order #{selectedOrder.order_number}</h2>
                <p className="text-gray-600">Order details and management</p>
              </div>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={closeOrderDetail}
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <PersonIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Customer</h3>
                  </div>
                  <p className="text-gray-900 font-medium">{selectedOrder.customer_name}</p>
                  <p className="text-gray-600 text-sm">{selectedOrder.customer_contact}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <MoneyIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Amount</h3>
                  </div>
                  <p className="text-green-600 font-bold text-xl">₹{selectedOrder.final_amount}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <CalendarIcon className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Date</h3>
                  </div>
                  <p className="text-gray-900 font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-600 text-sm">{new Date(selectedOrder.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>

              {/* Status Management */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                    <select
                      value={selectedOrder.status}
                      onChange={e => handleStatusChange(selectedOrder._id, e.target.value)}
                      disabled={statusUpdating}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const statusStyle = getStatusStyle(selectedOrder.status);
                        return (
                          <span className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.icon}
                            {selectedOrder.status}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Status</label>
                    <input
                      type="text"
                      value={selectedOrder.delivery_status || ''}
                      onChange={e => setSelectedOrder({ ...selectedOrder, delivery_status: e.target.value })}
                      placeholder="e.g. Shipped, Out for delivery, Delivered"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Link</label>
                    <input
                      type="text"
                      value={selectedOrder.delivery_tracking_link || ''}
                      onChange={e => setSelectedOrder({ ...selectedOrder, delivery_tracking_link: e.target.value })}
                      placeholder="Paste delivery tracking URL here"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                  {selectedOrder.delivery_tracking_link && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Link Preview</label>
                      <a 
                        href={selectedOrder.delivery_tracking_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <LinkIcon className="w-4 h-4" />
                        Track Delivery
                      </a>
                    </div>
                  )}
                  <button
                    onClick={async () => {
                      setStatusUpdating(true);
                      try {
                        // Update delivery status using status endpoint
                        await ordersAPI.updateStatus(selectedOrder._id, {
                          delivery_status: selectedOrder.delivery_status
                        });
                        // Update delivery link using delivery-link endpoint
                        if (selectedOrder.delivery_tracking_link) {
                          await ordersAPI.setDeliveryLink(selectedOrder._id, {
                            delivery_link: selectedOrder.delivery_tracking_link
                          });
                        }
                        await fetchOrders();
                      } catch (err) {
                        console.error('Failed to update delivery info:', err);
                        setAlertModal({
                          isOpen: true,
                          title: 'Error',
                          message: 'Failed to update delivery info',
                          type: 'error',
                          onConfirm: null,
                        });
                      }
                      setStatusUpdating(false);
                    }}
                    disabled={statusUpdating}
                    className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors font-medium flex items-center gap-2"
                  >
                    {statusUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="w-4 h-4" />
                        Update Delivery Info
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.product_name}</h4>
                        <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">₹{item.total_price}</p>
                        <p className="text-gray-600 text-sm">₹{item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <button
                className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium flex items-center gap-2"
                onClick={() => handleDeleteOrder(selectedOrder._id)}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <DeleteIcon className="w-4 h-4" />
                    Delete Order
                  </>
                )}
              </button>
              <button
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                onClick={closeOrderDetail}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement; 