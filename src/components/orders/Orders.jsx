import React, { useEffect, useState } from 'react';
import { ordersAPI } from '../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  const fetchCustomerOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await ordersAPI.getCustomerOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      setError('Failed to fetch your orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-layout">
        <div className="main-content">
          <div className="container">
            <div className="form-container">
              <div className="form-header">
                <h1 className="form-title">My Orders</h1>
                <p className="form-subtitle">View and track your orders</p>
              </div>
              <div className="table-container">
                <div className="table-header">
                  <div className="table-title">
                    <span>📋</span>
                    <span>My Orders</span>
                  </div>
                </div>
                <div className="table-content">
                  <table className="data-table">
                    <thead className="table-head">
                      <tr className="table-row">
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Delivery</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {loading ? (
                        <tr><td colSpan="6">Loading...</td></tr>
                      ) : error ? (
                        <tr><td colSpan="6">{error}</td></tr>
                      ) : orders.length === 0 ? (
                        <tr><td colSpan="6">No orders found</td></tr>
                      ) : (
                        orders.map(order => (
                          <tr className="table-row" key={order._id}>
                            <td>{order.order_number}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>₹{order.final_amount}</td>
                            <td><span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></td>
                            <td>{order.payment_status === 'Paid' ? 'Paid' : 'Unpaid'}</td>
                            <td>
                              {order.payment_status === 'Paid' ? (
                                order.delivery_tracking_link || order.delivery_link ? (
                                  <div className="flex flex-col">
                                    <a href={order.delivery_tracking_link || order.delivery_link} target="_blank" rel="noopener noreferrer">Track Shipment</a>
                                    <span className="text-sm text-gray-500">{order.delivery_status || 'Shipment pending'}</span>
                                  </div>
                                ) : (
                                  <span>{order.delivery_status || 'Waiting for shipment'}</span>
                                )
                              ) : (
                                <span>-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders; 