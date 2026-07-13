import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

export default function Checkout({ navigate }) {
  const { user, authHeaders } = useAuth();
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    fetch('/api/cart', authHeaders)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim() || !phone.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setPlacing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders.headers,
        },
        body: JSON.stringify({ shipping_address: address, phone }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate('orders');
      } else {
        setError(data.error || 'Failed to place order');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <h2>Checkout</h2>
        <p className="empty-msg">Your cart is empty. Add items before checkout.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h2>Checkout</h2>

      <div className="checkout-layout">
        <form className="checkout-form card" onSubmit={handlePlaceOrder}>
          <h3>Shipping Information</h3>

          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label>Shipping Address</label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full shipping address"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone number"
              required
            />
          </div>

          <p className="payment-note">
            💰 Payment: Cash on Delivery (COD) — Pay when you receive your order.
          </p>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={placing}>
            {placing ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="checkout-summary card">
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
        </div>
      </div>
    </div>
  );
}