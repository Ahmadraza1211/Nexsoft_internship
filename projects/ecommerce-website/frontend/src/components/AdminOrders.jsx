import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

export default function AdminOrders({ navigate }) {
  const { authHeaders } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedItems, setExpandedItems] = useState([]);

  const fetchOrders = () => {
    fetch('/api/admin/orders', authHeaders)
      .then((r) => r.json())
      .then(setOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders.headers,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch {}
  };

  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, authHeaders);
      const data = await res.json();
      setExpandedItems(data.items);
    } catch {
      setExpandedItems([]);
    }
  };

  const statusColors = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#16a34a',
    cancelled: '#dc2626',
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="admin-header">
        <h2>Manage Orders</h2>
        <div className="admin-nav-links">
          <span className="btn btn-secondary btn-sm" onClick={() => navigate('admin')}>
            Dashboard
          </span>
          <span className="btn btn-secondary btn-sm" onClick={() => navigate('admin-products')}>
            Products
          </span>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <>
                <tr key={order.id}>
                  <td>
                    <span
                      style={{ cursor: 'pointer', color: '#4f46e5' }}
                      onClick={() => toggleExpand(order.id)}
                    >
                      #{order.id}
                    </span>
                  </td>
                  <td>
                    <div>{order.user_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{order.user_email}</div>
                  </td>
                  <td>{order.item_count}</td>
                  <td>${order.total_amount.toFixed(2)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="status-select"
                      style={{ borderColor: statusColors[order.status] }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <span
                      style={{ color: '#4f46e5', cursor: 'pointer', fontSize: '0.875rem' }}
                      onClick={() => toggleExpand(order.id)}
                    >
                      {expandedId === order.id ? 'Hide' : 'View'}
                    </span>
                  </td>
                </tr>
                {expandedId === order.id && (
                  <tr key={`${order.id}-items`}>
                    <td colSpan={7} style={{ background: '#f8fafc' }}>
                      <div className="expanded-items">
                        {expandedItems.map((item) => (
                          <div key={item.id} className="expanded-item">
                            <span>{item.product_name}</span>
                            <span>
                              ${item.product_price.toFixed(2)} x {item.quantity} = ${item.subtotal.toFixed(2)}
                            </span>
                          </div>
                        ))}
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                          Shipping: {order.shipping_address} | Phone: {order.phone}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}