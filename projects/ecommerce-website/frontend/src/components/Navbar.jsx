import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar({ navigate, cartCount: externalCartCount }) {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetch('/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((r) => r.json())
        .then((items) => setCartCount(Array.isArray(items) ? items.length : 0))
        .catch(() => {});
    } else {
      setCartCount(0);
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('home');
    // We pass search via custom event
    window.dispatchEvent(new CustomEvent('search', { detail: search }));
  };

  const handleLogout = () => {
    logout();
    navigate('home');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <div className="navbar-left">
          <span className="logo" onClick={() => navigate('home')}>
            ShopEasy
          </span>
        </div>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="navbar-right">
          {user && user.role === 'admin' && (
            <span className="nav-link" onClick={() => navigate('admin')}>
              Admin Panel
            </span>
          )}

          {user && user.role !== 'admin' && (
            <span className="nav-link" onClick={() => navigate('orders')}>
              My Orders
            </span>
          )}

          <span className="cart-btn" onClick={() => navigate('cart')}>
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </span>

          {user ? (
            <div className="user-menu">
              <span className="user-greeting">Hi, {user.name}</span>
              <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn btn-sm btn-secondary" onClick={() => navigate('login')}>
                Login
              </button>
              <button className="btn btn-sm btn-primary" onClick={() => navigate('register')}>
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}