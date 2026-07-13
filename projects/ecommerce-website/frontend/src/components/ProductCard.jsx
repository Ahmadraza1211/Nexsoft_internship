import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

export default function ProductCard({ product, navigate }) {
  const { user, authHeaders } = useAuth();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
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
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
      if (res.ok) {
        showToast('Added to cart!');
      }
    } catch {
      // silent
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <div className="product-card card" onClick={() => navigate('product', product.id)}>
        <div className="product-img-wrapper">
          <img src={product.image_url} alt={product.name} className="product-img" />
          {product.stock === 0 && <div className="out-of-stock-badge">Out of Stock</div>}
        </div>
        <div className="product-info">
          <span className="product-category">{product.category_name}</span>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-bottom">
            <span className="product-price">${product.price.toFixed(2)}</span>
            <button
              className="btn btn-primary btn-sm add-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
            >
              {adding ? '...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
      {adding && <ToastContainer message="Added to cart!" type="success" />}
    </>
  );
}

function showToast(message, type = 'success') {
  // handled inline via ToastContainer
}

function ToastContainer({ message, type }) {
  const [visible, setVisible] = useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;
  return <div className={`toast toast-${type}`}>{message}</div>;
}