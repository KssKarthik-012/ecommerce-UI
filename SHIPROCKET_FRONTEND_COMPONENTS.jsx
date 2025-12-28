/**
 * FRONTEND IMPLEMENTATION EXAMPLES
 * Add these components to your React frontend for Shiprocket integration
 */

// ============================================================================
// 1. Admin Dashboard - Shipment Management Component
// ============================================================================

// File: frontend/src/components/dashboard/ShipmentManagement.jsx

import React, { useState, useEffect } from 'react';
import './ShipmentManagement.css';

function ShipmentManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState({});
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
    // Refresh every 5 minutes
    const interval = setInterval(fetchOrders, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/admin/list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createShipment = async (orderId) => {
    setCreating({ ...creating, [orderId]: true });
    try {
      const response = await fetch('/api/shipments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✓ Shipment ${data.shipment_id} created successfully`);
        fetchOrders(); // Refresh list
      } else {
        setMessage(`✗ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`✗ Failed: ${error.message}`);
    } finally {
      setCreating({ ...creating, [orderId]: false });
    }
  };

  const cancelShipment = async (shipmentId) => {
    if (!window.confirm('Are you sure you want to cancel this shipment?')) {
      return;
    }

    setCreating({ ...creating, [shipmentId]: true });
    try {
      const response = await fetch(`/api/shipments/cancel/${shipmentId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✓ Shipment cancelled successfully');
        fetchOrders();
      } else {
        setMessage(`✗ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`✗ Failed: ${error.message}`);
    } finally {
      setCreating({ ...creating, [shipmentId]: false });
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="shipment-management">
      <h2>Shipment Management</h2>

      {message && (
        <div className="message">
          {message}
          <button onClick={() => setMessage('')}>×</button>
        </div>
      )}

      <div className="shipment-table-container">
        <table className="shipment-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Delivery Status</th>
              <th>Shipment ID</th>
              <th>AWB</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className={`status-${order.status.toLowerCase()}`}>
                <td>{order._id.substring(0, 8)}...</td>
                <td>{order.customer_name}</td>
                <td>
                  <span className={`badge status-${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <span className={`badge delivery-${order.delivery_status}`}>
                    {order.delivery_status}
                  </span>
                </td>
                <td>
                  {order.shipment?.shiprocket_shipment_id || '-'}
                </td>
                <td>
                  {order.shipment?.awb ? (
                    <a
                      href={`https://track.shiprocket.in/${order.shipment.awb}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="awb-link"
                    >
                      {order.shipment.awb}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="actions">
                  {!order.shipment ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => createShipment(order._id)}
                      disabled={creating[order._id]}
                    >
                      {creating[order._id] ? 'Creating...' : 'Create Shipment'}
                    </button>
                  ) : order.shipment.status !== 'CANCELLED' ? (
                    <div className="shipment-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => fetchOrders()}
                      >
                        Refresh Status
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => cancelShipment(order.shipment.shiprocket_shipment_id)}
                        disabled={creating[order.shipment.shiprocket_shipment_id]}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="text-cancelled">Cancelled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="empty-state">
          <p>No orders found</p>
        </div>
      )}
    </div>
  );
}

export default ShipmentManagement;

// ============================================================================
// 2. Customer Order Tracking Component
// ============================================================================

// File: frontend/src/components/public/OrderTracking.jsx

import React, { useState, useEffect } from 'react';
import './OrderTracking.css';

function OrderTracking({ orderId }) {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusTimeline, setStatusTimeline] = useState([]);

  useEffect(() => {
    fetchTracking();
    // Refresh every 10 minutes
    const interval = setInterval(fetchTracking, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchTracking = async () => {
    try {
      const response = await fetch(`/api/shipments/track-order/${orderId}`);
      const data = await response.json();

      if (data.success) {
        setTracking(data);
        generateTimeline(data);
        setError('');
      } else {
        setError(data.message || 'Tracking information not available');
        setTracking(null);
      }
    } catch (err) {
      setError('Failed to load tracking information');
      console.error('Tracking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeline = (trackingData) => {
    const statuses = [
      'Pending',
      'Picked',
      'Dispatched',
      'In Transit',
      'Out for Delivery',
      'Delivered'
    ];

    const currentStatus = trackingData.current_status;
    const currentIndex = statuses.findIndex(s => s === currentStatus);

    const timeline = statuses.map((status, index) => ({
      status,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));

    setStatusTimeline(timeline);
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Delivered': '✓',
      'In Transit': '→',
      'Out for Delivery': '🚚',
      'Dispatched': '📦',
      'Picked': '✓',
      'Pending': '○'
    };
    return icons[status] || '○';
  };

  if (loading) {
    return <div className="tracking-loading">Loading tracking information...</div>;
  }

  if (error) {
    return (
      <div className="tracking-error">
        <p>{error}</p>
        <button onClick={fetchTracking} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="tracking-empty">
        <p>No tracking information available yet.</p>
        <p>Please check back later or contact support.</p>
      </div>
    );
  }

  return (
    <div className="order-tracking">
      <div className="tracking-header">
        <h2>Track Your Order</h2>
        <p>Order ID: {orderId}</p>
      </div>

      <div className="tracking-summary">
        <div className="summary-item">
          <label>Current Status</label>
          <span className="status-badge">{tracking.current_status}</span>
        </div>
        {tracking.awb && (
          <div className="summary-item">
            <label>Tracking Number (AWB)</label>
            <span className="awb-number">{tracking.awb}</span>
          </div>
        )}
        {tracking.shipments?.[0]?.awb && (
          <div className="summary-item">
            <a
              href={`https://track.shiprocket.in/${tracking.shipments[0].awb}`}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              View Detailed Tracking →
            </a>
          </div>
        )}
      </div>

      <div className="tracking-timeline">
        <h3>Delivery Timeline</h3>
        <div className="timeline">
          {statusTimeline.map((item, index) => (
            <div
              key={index}
              className={`timeline-item ${item.completed ? 'completed' : ''} ${
                item.active ? 'active' : ''
              }`}
            >
              <div className="timeline-marker">
                <span className="marker-icon">{getStatusIcon(item.status)}</span>
              </div>
              <div className="timeline-content">
                <p className="timeline-status">{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {tracking.shipments && tracking.shipments.length > 0 && (
        <div className="shipment-details">
          <h3>Shipment Details</h3>
          {tracking.shipments.map((shipment, index) => (
            <div key={index} className="shipment-card">
              <p>
                <strong>Shipment {index + 1}:</strong> {shipment.shipment_id}
              </p>
              <p>
                <strong>Status:</strong> {shipment.shipment_status}
              </p>
              {shipment.delivery_date && (
                <p>
                  <strong>Expected Delivery:</strong> {shipment.delivery_date}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="tracking-footer">
        <button onClick={fetchTracking} className="btn btn-secondary">
          Refresh Tracking
        </button>
        <p className="refresh-info">Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export default OrderTracking;

// ============================================================================
// 3. Customer Order Page - Enhanced with Tracking
// ============================================================================

// File: frontend/src/components/public/OrderDetailPage.jsx (Updated)

import React, { useState, useEffect } from 'react';
import OrderTracking from './OrderTracking';

function OrderDetailPage({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderWithTracking();
  }, [orderId]);

  const fetchOrderWithTracking = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/with-tracking`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Fetch order error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading order details...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="order-detail-page">
      <h1>Order Details</h1>

      <div className="order-info-section">
        <h2>Order Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Order ID</label>
            <span>{order._id}</span>
          </div>
          <div className="info-item">
            <label>Order Date</label>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <label>Status</label>
            <span className="badge">{order.status}</span>
          </div>
          <div className="info-item">
            <label>Total Amount</label>
            <span>₹{order.final_amount}</span>
          </div>
        </div>
      </div>

      <div className="order-items-section">
        <h2>Items Ordered</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price}</td>
                <td>₹{item.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="shipping-info-section">
        <h2>Shipping Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Recipient</label>
            <span>{order.customer_name}</span>
          </div>
          <div className="info-item">
            <label>Email</label>
            <span>{order.customer_email}</span>
          </div>
          <div className="info-item">
            <label>Phone</label>
            <span>{order.customer_contact}</span>
          </div>
          <div className="info-item">
            <label>Address</label>
            <span>{order.customer_address}</span>
          </div>
        </div>
      </div>

      {/* Tracking Component */}
      <div className="tracking-section">
        <OrderTracking orderId={orderId} />
      </div>
    </div>
  );
}

export default OrderDetailPage;

// ============================================================================
// 4. CSS Styles for Components
// ============================================================================

// File: frontend/src/components/dashboard/ShipmentManagement.css

/*
.shipment-management {
  padding: 20px;
}

.shipment-management h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.message {
  padding: 15px;
  margin-bottom: 20px;
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.shipment-table-container {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.shipment-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.shipment-table thead {
  background-color: #f5f5f5;
}

.shipment-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

.shipment-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge.status-Confirmed {
  background-color: #e3f2fd;
  color: #1976d2;
}

.badge.delivery-Pending {
  background-color: #fff3e0;
  color: #f57c00;
}

.badge.delivery-Confirmed {
  background-color: #e3f2fd;
  color: #1976d2;
}

.badge.delivery-Dispatched {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.badge.delivery-InTransit {
  background-color: #e0f2f1;
  color: #00796b;
}

.badge.delivery-Delivered {
  background-color: #e8f5e9;
  color: #388e3c;
}

.awb-link {
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
}

.awb-link:hover {
  text-decoration: underline;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #1976d2;
  color: white;
}

.btn-primary:hover {
  background-color: #1565c0;
}

.btn-primary:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #757575;
  color: white;
}

.btn-danger {
  background-color: #d32f2f;
  color: white;
}

.btn-danger:hover {
  background-color: #c62828;
}

.shipment-actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}
*/

// ============================================================================
// 5. API Service Helper
// ============================================================================

// File: frontend/src/services/shipmentService.js

const API_BASE = '/api';

export const shipmentService = {
  // Create shipment for order
  createShipment: async (orderId, token) => {
    const response = await fetch(`${API_BASE}/shipments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ orderId })
    });
    return response.json();
  },

  // Get shipment tracking by shipment ID
  trackShipment: async (shipmentId) => {
    const response = await fetch(`${API_BASE}/shipments/track/${shipmentId}`);
    return response.json();
  },

  // Get order tracking
  trackOrder: async (orderId) => {
    const response = await fetch(`${API_BASE}/shipments/track-order/${orderId}`);
    return response.json();
  },

  // Cancel shipment
  cancelShipment: async (shipmentId, token) => {
    const response = await fetch(`${API_BASE}/shipments/cancel/${shipmentId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  // Get all shipments (admin)
  getAllShipments: async (token) => {
    const response = await fetch(`${API_BASE}/shipments`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  // Get shipment by order ID
  getShipmentByOrder: async (orderId) => {
    const response = await fetch(`${API_BASE}/shipments/order/${orderId}`);
    return response.json();
  }
};

export default shipmentService;
