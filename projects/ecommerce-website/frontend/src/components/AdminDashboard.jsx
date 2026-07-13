import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

export default function AdminDashboard({ navigate }) {
  const { authHeaders } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/admin/orders', authHeaders).then((r) => r.json()),
    ]).then(([products, orders]) => {
      const pendingCount = orders.filter((o) => o.status === 'pending').length;
      const revenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
      setStats({
        products: products.length,
        orders: orders.length,
        pending: pendingCount,
        revenue,
      });
      setRecentOrders(orders.slice(0, 5));
    });
  }, []);

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
        <h2>Admin Dashboard</h2>
        <div className="admin-nav-links">
          <span className="btn btn-secondary btn-sm" onClick={() => navigate('admin-products')}>
            Manage Products
          </span>
          <span className="btn btn-secondary btn-sm" onClick={() => navigate('admin-orders')}>
            Manage Orders
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{stats.products}</div>
        </div>
        <div className="stat-card card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{stats.orders}</div>
        </div>
        <div className="stat-card card">
          <div className="stat-label">Pending Orders</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.pending}</div>
        </div>
        <div className="stat-card card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">${stats.revenue.toFixed(2)}</div>
        </div>
      </div>

      <div className="recent-section">
        <h3>Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="empty-msg">No orders yet.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user_name}</td>
                    <td>${order.total_amount.toFixed(2)}</td>
                    <td>
                      <span
                        className="order-status"
                        style={{ backgroundColor: statusColors[order.status] || '#999' }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}