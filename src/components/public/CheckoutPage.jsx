import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import API_BASE_URL from '../../services/apiConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import PublicHeader from '../shared/PublicHeader';
import CustomerTabs from '../shared/CustomerTabs';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { lightgreenbox } from '../../classConstat';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

function getTotalWeight(items) {
  return items.reduce((sum, item) => sum + ((item.weight || 0) * (item.quantity || 1)), 0);
}

function calculateDeliveryCharge(state, totalWeight) {
  // Minimum charge is ₹50, and per-kg cost is ₹50
  // Only calculate when a delivery state is selected
  if (!state) return 0;
  const kg = Math.ceil((totalWeight || 0) / 500);
  const perKgCharge = 26; // ₹50 per kg
  const calculated = Math.max(26, kg * perKgCharge);
  return calculated;
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    deliveryInstructions: ''
  });
  const [isEmailReadonly, setIsEmailReadonly] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  // Get selected items from navigation state or fallback to all cart items
  const selectedItems = location.state?.selectedItems || [];
  const orderAmount = selectedItems.reduce((sum, item) => sum + ((item.discount_price || item.price) * (item.quantity || 1)), 0);
  const totalWeight = getTotalWeight(selectedItems);
  const finalAmount = orderAmount + deliveryCharge;

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'customer') {
          setCustomerName(user.name || 'User');
          if (user.email) {
            setDeliveryForm(prev => ({ ...prev, email: user.email }));
            setIsEmailReadonly(true);
          }
        }
      } catch { }
    }
  }, []);
  // Recalculate delivery charge when state or selected items change
  useEffect(() => {
    setDeliveryCharge(calculateDeliveryCharge(deliveryForm.state, totalWeight));
  }, [deliveryForm.state, totalWeight]);
  const handleTabChange = (tab) => {
    if (tab === 'overview') navigate('/customer/dashboard');
    else if (tab === 'orders') navigate('/customer/dashboard?tab=orders');
    else if (tab === 'profile') navigate('/customer/dashboard?tab=profile');
    else if (tab === 'shop') navigate('/shop');
  };

  const handleDeliveryFormChange = (field, value) => {
    setDeliveryForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateDeliveryForm = () => {
    const errors = {};

    if (!deliveryForm.fullName.trim()) errors.fullName = 'Full name is required';
    if (!deliveryForm.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(deliveryForm.email)) errors.email = 'Please enter a valid email';
    if (!deliveryForm.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(deliveryForm.phone.replace(/\s/g, ''))) errors.phone = 'Please enter a valid 10-digit phone number';
    if (!deliveryForm.address.trim()) errors.address = 'Address is required';
    if (!deliveryForm.city.trim()) errors.city = 'City is required';
    if (!deliveryForm.state.trim()) errors.state = 'State is required';
    if (!deliveryForm.pincode.trim()) errors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(deliveryForm.pincode)) errors.pincode = 'Please enter a valid 6-digit pincode';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (validateDeliveryForm()) {
      setShowDeliveryForm(true);
    }
  };

  const handleRazorpayPayment = async () => {
    if (selectedItems.length === 0) {
      setError('No items selected for checkout');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // 1. Create Razorpay order from backend
      const res = await fetch(`${API_BASE_URL}/orders/payments/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          amount: finalAmount,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          items: selectedItems,
          deliveryDetails: deliveryForm,
          deliveryCharge
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to create Razorpay order');
      const razorpayOrder = data.order;
      const dbOrderId = data.dbOrderId;

      // 2. Load Razorpay script dynamically
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Failed to load Razorpay SDK. Please try again.');
        setLoading(false);
        return;
      }

      // 3. Open Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'RTQ Foods',
        description: `Order Payment - ${selectedItems.length} items`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // 4. Verify payment with backend
            const verifyRes = await fetch(`${API_BASE_URL}/orders/payments/verify-razorpay`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: dbOrderId
              })
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              navigate('/order-success');
            } else {
              setError('Payment verification failed: ' + (verifyData.message || 'Unknown error'));
            }
          } catch (error) {
            setError('Payment verification failed: ' + error.message);
          }
        },
        prefill: {
          name: deliveryForm.fullName || customerName || 'Customer',
          email: deliveryForm.email || 'customer@example.com',
          contact: deliveryForm.phone || '9999999999',
        },
        theme: { color: '#3399cc' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-website">
      <PublicHeader />
      {/* <CustomerTabs activeTab="checkout" onTabChange={handleTabChange} userName={customerName} /> */}
     <div className="shop-container">
        <section className={`shop-section ${lightgreenbox} mb-5`}>
          <div className="text-center ">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              <ShoppingCartIcon fontSize='20px'/> Checkout
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-0">
              Complete your purchase
            </p>
          </div>
        </section>

        {selectedItems.length === 0 ? (
          <div className="no-items">
            <p>No items selected for checkout.</p>
            <button className="back-to-cart-btn" onClick={() => navigate('/cart')}>
              Back to Cart
            </button>
          </div>
        ) : (
          <>
            <div className="checkout-summary">
              <h3>Order Summary</h3>
              <div className="selected-items">
                {selectedItems.map((item, index) => (
                  <div key={index} className="checkout-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity || 1}</span>
                    {item.discount_price && item.discount_price > 0 ? (
                      <div className="item-price-section">
                        <span className="item-original-price" style={{ textDecoration: 'line-through' }}>₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                        <span className="item-price">₹{((item.discount_price || item.price) * (item.quantity || 1)).toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="item-price">₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="order-total">
                <div>Subtotal: ₹{orderAmount.toFixed(2)}</div>
                <div>Delivery Charges: ₹{deliveryCharge.toFixed(2)}</div>
                <strong>Total: ₹{finalAmount.toFixed(2)}</strong>
              </div>
            </div>

            {!showDeliveryForm ? (
              <>
                <div className="delivery-form-section">
                  <h3>Delivery Details</h3>
                  <p className="form-subtitle">Please provide your delivery information</p>

                  <div className="delivery-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          value={deliveryForm.fullName}
                          onChange={(e) => handleDeliveryFormChange('fullName', e.target.value)}
                          className={formErrors.fullName ? 'error' : ''}
                        />
                        {formErrors.fullName && <span className="error-text">{formErrors.fullName}</span>}
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          value={deliveryForm.email}
                          onChange={(e) => handleDeliveryFormChange('email', e.target.value)}
                          className={formErrors.email ? 'error' : ''}
                          disabled={isEmailReadonly}
                        />
                        {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Phone Number *</label>
                        <input
                          type="tel"
                          value={deliveryForm.phone}
                          onChange={(e) => handleDeliveryFormChange('phone', e.target.value)}
                          className={formErrors.phone ? 'error' : ''}
                        />
                        {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                      </div>
                      <div className="form-group">
                        <label>Pincode *</label>
                        <input
                          type="text"
                          value={deliveryForm.pincode}
                          onChange={(e) => handleDeliveryFormChange('pincode', e.target.value)}
                          className={formErrors.pincode ? 'error' : ''}
                        />
                        {formErrors.pincode && <span className="error-text">{formErrors.pincode}</span>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Address *</label>
                      <textarea
                        value={deliveryForm.address}
                        onChange={(e) => handleDeliveryFormChange('address', e.target.value)}
                        className={formErrors.address ? 'error' : ''}
                        rows="3"
                      />
                      {formErrors.address && <span className="error-text">{formErrors.address}</span>}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>City *</label>
                        <input
                          type="text"
                          value={deliveryForm.city}
                          onChange={(e) => handleDeliveryFormChange('city', e.target.value)}
                          className={formErrors.city ? 'error' : ''}
                        />
                        {formErrors.city && <span className="error-text">{formErrors.city}</span>}
                      </div>
                      <div className="form-group">
                        <label>State *</label>
                        <select
                          value={deliveryForm.state}
                          onChange={e => handleDeliveryFormChange('state', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors h-[49.78px] ${formErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        {formErrors.state && <span className="error-text">{formErrors.state}</span>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Delivery Instructions (Optional)</label>
                      <textarea
                        value={deliveryForm.deliveryInstructions}
                        onChange={(e) => handleDeliveryFormChange('deliveryInstructions', e.target.value)}
                        rows="2"
                        placeholder="Any special instructions for delivery..."
                      />
                    </div>
                  </div>
                </div>

                <div className="checkout-actions max-sm:mb-10">
                  <button className="back-btn" onClick={() => navigate('/cart')}>
                    Back to Cart
                  </button>
                  <button className="proceed-btn bg-green-600" onClick={handleProceedToPayment}>
                    Proceed to Payment
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="delivery-summary">
                  <h3>Delivery Details</h3>
                  <div className="delivery-info">
                    <p><strong>Name:</strong> {deliveryForm.fullName}</p>
                    <p><strong>Email:</strong> {deliveryForm.email}</p>
                    <p><strong>Phone:</strong> {deliveryForm.phone}</p>
                    <p><strong>Address:</strong> {deliveryForm.address}</p>
                    <p><strong>City:</strong> {deliveryForm.city}, <strong>State:</strong> {deliveryForm.state}, <strong>Pincode:</strong> {deliveryForm.pincode}</p>
                    {deliveryForm.deliveryInstructions && (
                      <p><strong>Instructions:</strong> {deliveryForm.deliveryInstructions}</p>
                    )}
                  </div>
                  <button className="edit-delivery-btn" onClick={() => setShowDeliveryForm(false)}>
                    Edit Delivery Details
                  </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="checkout-actions">
                  <button className="back-btn" onClick={() => navigate('/cart')}>
                    Back to Cart
                  </button>
                  <button className="checkout-btn" onClick={handleRazorpayPayment} disabled={loading}>
                    {loading ? 'Processing...' : 'Pay with Razorpay'}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage; 