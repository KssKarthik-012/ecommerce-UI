import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PublicHeader from '../shared/PublicHeader';
import CustomerTabs from '../shared/CustomerTabs';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'customer') {
          setCustomerName(user.name || 'User');
        }
      } catch {}
    }
  }, []);

  const handleTabChange = (tab) => {
    if (tab === 'overview') navigate('/customer/dashboard');
    else if (tab === 'orders') navigate('/customer/dashboard?tab=orders');
    else if (tab === 'profile') navigate('/customer/dashboard?tab=profile');
    else if (tab === 'shop') navigate('/shop');
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  const handleViewOrders = () => {
    navigate('/customer/dashboard?tab=orders');
  };

  return (
    <div className="public-website">
      <PublicHeader />
      <CustomerTabs activeTab="orders" onTabChange={handleTabChange} userName={customerName} />
      
      <div className="container">
        <div className="order-success-page">
          <div className="success-card">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2"/>
                <path d="M8 12L11 15L16 9" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h1 className="success-title">🎉 Payment Successful!</h1>
            <p className="success-message">
              Thank you for your order! Your payment has been processed successfully.
            </p>
            
            <div className="order-details">
              <h3>Order Details</h3>
              <div className="detail-item">
                <span className="label">Order Status:</span>
                <span className="value status-confirmed">Confirmed</span>
              </div>
              <div className="detail-item">
                <span className="label">Payment Status:</span>
                <span className="value status-paid">Paid</span>
              </div>
              <div className="detail-item">
                <span className="label">Order Date:</span>
                <span className="value">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="next-steps">
              <h3>What's Next?</h3>
              <ul>
                <li>📧 You'll receive an order confirmation email shortly</li>
                <li>📦 Your order will be processed and shipped within 2-3 business days</li>
                <li>📱 You can track your order status in your dashboard</li>
                <li>📞 Contact us if you have any questions</li>
              </ul>
            </div>
            
            <div className="action-buttons">
              <button className="btn-primary" onClick={handleContinueShopping}>
                Continue Shopping
              </button>
              <button className="btn-secondary" onClick={handleViewOrders}>
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage; 