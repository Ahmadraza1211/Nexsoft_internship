import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export default function Cart({ navigate }) {
  const { user, authHeaders } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = () => {
    fetch('/api/cart', authHeaders)
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      navigate('login');
    }
  }, [user]);

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders.headers,
        },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch {}
  };

  const removeItem = async (id) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: 'DELETE',
        headers: authHeaders.headers,
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch {}
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: '300px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h2>Shopping Cart</h2>

      {items.length === 0 ? (
        <p className="empty-msg">Your cart is empty.</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item card">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="cart-item-img"
                  onClick={() => navigate('product', item.product_id)}
                />
                <div className="cart-item-details">
                  <h4 onClick={() => navigate('product', item.product_id)}>{item.name}</h4>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <span className="cart-item-subtotal">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    className="btn btn-sm btn-danger remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary card">
            <h3>Order Summary</h3>
            <div className="summary-rows">
              {items.map((item) => (
                <div key={item.id} className="summary-row">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}