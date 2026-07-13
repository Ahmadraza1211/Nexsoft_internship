import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetail({ id, navigate }) {
  const { user, authHeaders } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then(setProduct)
      .catch(() => {});
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('login');
      return;
    }
    setAdding(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders.headers,
        },
        body: JSON.stringify({ product_id: product.id, quantity }),
      });
      if (res.ok) {
        setToast('Added to cart!');
        setTimeout(() => setToast(null), 2000);
      } else {
        const data = await res.json();
        setToast(data.error || 'Failed to add');
        setTimeout(() => setToast(null), 2000);
      }
    } catch {
      setToast('Failed to add to cart');
      setTimeout(() => setToast(null), 2000);
    } finally {
      setAdding(false);
    }
  };

  if (!product) {
    return (
      <div className="loading-screen" style={{ minHeight: '300px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <span className="back-link" onClick={() => navigate('home')}>
        ← Back to Products
      </span>

      <div className="detail-card card">
        <div className="detail-img-section">
          <img src={product.image_url} alt={product.name} className="detail-img" />
        </div>
        <div className="detail-info">
          <span className="detail-category">{product.category_name}</span>
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className="detail-stock">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock-text">Out of Stock</span>
            )}
          </p>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-actions">
            <div className="qty-control">
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className={`toast ${toast.includes('Failed') || toast.includes('Not') ? 'toast-error' : 'toast-success'}`}>
          {toast}
        </div>
      )}
    </div>
  );
}