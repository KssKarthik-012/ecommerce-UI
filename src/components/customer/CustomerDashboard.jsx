import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../services/apiConfig';
import Footer from '../public/Footer';
import PublicHeader from '../shared/PublicHeader';
import { lightgreenbox } from '../../classConstat';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';

const CustomerDashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ phone: '', address: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profilePopup, setProfilePopup] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadCustomerOrders();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const loadCustomerOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/orders/my`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleProfileFormChange = (field, value) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileSave = async () => {
    setProfileLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/auth/users/${user.id}`, profileForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfilePopup({ show: true, message: 'Profile updated successfully!', type: 'success' });
      setUser({ ...user, ...profileForm });
    } catch (error) {
      setProfilePopup({ show: true, message: 'Failed to update profile.', type: 'error' });
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (profilePopup.show) {
      const timer = setTimeout(() => setProfilePopup({ ...profilePopup, show: false }), 2000);
      return () => clearTimeout(timer);
    }
  }, [profilePopup]);

  if (loading) {
    return (
      <div className="customer-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-dashboard public-website !bg-gray-50" >
      {/* Header */}
      <PublicHeader />

      {/* Navigation Tabs
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabChange('overview')}
        >
          <InsertChartIcon /> Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => handleTabChange('orders')}
        >
          📦 My Orders
        </button>
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          👤 Profile
        </button>
        <button
          className={`tab-button ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => navigate('/shop')}
        >
          <ShoppingCartIcon /> Shop Now
        </button>
      </div> */}

      {/* Dashboard Content */}
      <div className="dashboard-content ">

        <section className={`shop-section ${lightgreenbox}`}>
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-3">
              Hi, {user?.name || 'Customer'}!
            </h1>
            {/* <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Discover our premium organic food products and spices
            </p> */}
          </div>
          <div className="w-full flex flex-wrap justify-center gap-4">
            {/* <button
              className="w-inherit rounded-full px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition"
              onClick={() => handleTabChange('overview')}
            >
              <InsertChartIcon /> Overview
            </button>
            <button onClick={() => navigate('/shop')} className="w-inherit rounded-full px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition">
              <SearchIcon /> Browse Products
            </button> */}
            <button onClick={() => handleTabChange('orders')} className="w-inherit rounded-full px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition">
              <ViewInArIcon /> View Orders
            </button>
            <button onClick={() => navigate('/cart')} className="w-inherit rounded-full px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition">
              <ShoppingCartIcon /> My Cart
            </button>
            <button onClick={() => handleTabChange('profile')} className="w-inherit rounded-full px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition">
              <PersonIcon /> Edit Profile
            </button>
          </div>
        </section>
        {activeTab === 'overview' && (
          <div className="overview-tab !mt-10 !mb-15">
            <h2>Quick Overview</h2>
            <div className="stats-grid bg-white shadow p-4 rounded-lg">
              <div className={`${lightgreenbox} stat-card`}>
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <div className="stat-number">{orders.length}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
              </div>
              <div className={`${lightgreenbox} stat-card P`}>
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-number">₹{orders.reduce((sum, order) => sum + (order.final_amount || 0), 0)}</div>
                  <div className="stat-label">Total Spent</div>
                </div>
              </div>
              <div className={`${lightgreenbox} stat-card`}>
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <div className="stat-number">4.8</div>
                  <div className="stat-label">Rating</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-tab !mt-10 !mb-15">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No Orders Yet</h3>
                <p>Start shopping to see your orders here!</p>
                <button onClick={() => navigate('/shop')} className="primary-button">
                  <ShoppingCartIcon /> Start Shopping
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <span className="order-id">Order #{order.order_number || order._id}</span>
                      <span className={`order-status ${order.status ? order.status.toLowerCase() : ''}`}>{order.status}</span>
                    </div>
                    <div className="order-details">
                      <div className="order-date">Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</div>
                      <div className="order-total">Total: ₹{order.final_amount || 0}</div>
                      <div className="order-delivery-status">Delivery: {order.delivery_status || 'Pending'}</div>
                      <div className="order-tracking-link">Tracking: {order.delivery_tracking_link ? <a href={order.delivery_tracking_link} target="_blank" rel="noopener noreferrer">Track</a> : 'Not available yet'}</div>
                    </div>
                    <button className="view-order-button" onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}>View Details</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-tab !mt-10 !mb-15">
            <h2>My Profile</h2>
            <div className="profile-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={user?.name || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user?.email || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" placeholder="Add your phone number" value={profileForm.phone} onChange={e => handleProfileFormChange('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea placeholder="Add your delivery address" value={profileForm.address} onChange={e => handleProfileFormChange('address', e.target.value)}></textarea>
              </div>
              <button className="save-button" onClick={handleProfileSave} disabled={profileLoading}>{profileLoading ? 'Saving...' : '💾 Save Changes'}</button>
            </div>
            {profilePopup.show && (
              <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, padding: '12px 24px', background: profilePopup.type === 'success' ? '#4caf50' : '#f44336', color: '#fff', borderRadius: 8, pointerEvents: 'none' }}>
                {profilePopup.message}
              </div>
            )}
          </div>
        )}
      </div>
      {showDetailModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal order-detail-modal bg-white shadow-lg rounded-lg">
            <div className="modal-header">
              <h2>Order #{selectedOrder.order_number}</h2>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div><b>Status:</b> {selectedOrder.status}</div>
              <div><b>Amount:</b> ₹{selectedOrder.final_amount}</div>
              <div><b>Date:</b> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : ''}</div>
              <div><b>Delivery Status:</b> {selectedOrder.delivery_status || 'Pending'}</div>
              <div><b>Tracking Link:</b> {selectedOrder.delivery_tracking_link ? <a href={selectedOrder.delivery_tracking_link} target="_blank" rel="noopener noreferrer">Track Delivery</a> : 'Not available yet'}</div>
              <div><b>Items:</b>
                <ul>
                  {selectedOrder.items?.map((item, idx) => (
                    <li key={idx}>{item.product_name} x {item.quantity} = ₹{item.total_price}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setShowDetailModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CustomerDashboard;