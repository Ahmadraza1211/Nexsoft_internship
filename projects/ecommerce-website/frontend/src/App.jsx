import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';

function App() {
  const [page, setPage] = useState('home');
  const [pageParam, setPageParam] = useState(null);
  const { user, loading } = useAuth();

  const navigate = useCallback((newPage, param = null) => {
    setPage(newPage);
    setPageParam(param);
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'login':
        return <Login navigate={navigate} />;
      case 'register':
        return <Register navigate={navigate} />;
      case 'product':
        return <ProductDetail id={pageParam} navigate={navigate} />;
      case 'cart':
        return <Cart navigate={navigate} />;
      case 'checkout':
        return user ? <Checkout navigate={navigate} /> : <Login navigate={navigate} />;
      case 'orders':
        return user ? <OrderList navigate={navigate} /> : <Login navigate={navigate} />;
      case 'admin':
        return user?.role === 'admin' ? <AdminDashboard navigate={navigate} /> : <Login navigate={navigate} />;
      case 'admin-products':
        return user?.role === 'admin' ? <AdminProducts navigate={navigate} /> : <Login navigate={navigate} />;
      case 'admin-orders':
        return user?.role === 'admin' ? <AdminOrders navigate={navigate} /> : <Login navigate={navigate} />;
      default:
        return <ProductList navigate={navigate} />;
    }
  };

  return (
    <div className="app">
      <Navbar navigate={navigate} cartCount={pageParam?.cartCount || 0} />
      <main className="main-content">{renderPage()}</main>
      <footer className="footer">
        <p>&copy; 2024 ShopEasy. All rights reserved.</p>
      </footer>
    </div>
  );
}

function OrderList({ navigate }) {
  const { authHeaders } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedItems, setExpandedItems] = useState([]);

  useEffect(() => {
    fetch('/api/orders', authHeaders)
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => {});
  }, []);

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
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p className="empty-msg">No orders yet. Start shopping!</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header" onClick={() => toggleExpand(order.id)}>
                <div>
                  <span className="order-id">#{order.id}</span>
                  <span className="order-date">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="order-right">
                  <span className="order-total">${order.total_amount.toFixed(2)}</span>
                  <span
                    className="order-status"
                    style={{ backgroundColor: statusColors[order.status] || '#999' }}
                  >
                    {order.status}
                  </span>
                  <span className="expand-icon">{expandedId === order.id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expandedId === order.id && (
                <div className="order-items">
                  {expandedItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <span>{item.product_name}</span>
                      <span>
                        ${item.product_price.toFixed(2)} x {item.quantity} = ${item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;