const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All cart routes require auth
router.use(authMiddleware);

// GET /api/cart
router.get('/', (req, res) => {
  const items = db.prepare(
    `SELECT ci.*, p.name, p.price, p.image_url, p.stock
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = ?`
  ).all(req.user.id);
  res.json(items);
});

// POST /api/cart
router.post('/', (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'product_id is required' });
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Not enough stock' });
    }

    const existing = db.prepare(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?'
    ).get(req.user.id, product_id);

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (product.stock < newQty) {
        return res.status(400).json({ error: 'Not enough stock' });
      }
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQty, existing.id);
    } else {
      db.prepare(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)'
      ).run(req.user.id, product_id, quantity);
    }

    const items = db.prepare(
      `SELECT ci.*, p.name, p.price, p.image_url, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`
    ).all(req.user.id);

    res.status(201).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/cart/:id
router.put('/:id', (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const item = db.prepare(
      'SELECT ci.*, p.stock FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.id = ? AND ci.user_id = ?'
    ).get(req.params.id, req.user.id);

    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (item.stock < quantity) {
      return res.status(400).json({ error: 'Not enough stock' });
    }

    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, req.params.id);

    const items = db.prepare(
      `SELECT ci.*, p.name, p.price, p.image_url, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`
    ).all(req.user.id);

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/cart/:id
router.delete('/:id', (req, res) => {
  try {
    const item = db.prepare(
      'SELECT * FROM cart_items WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.user.id);

    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    db.prepare('DELETE FROM cart_items WHERE id = ?').run(req.params.id);

    const items = db.prepare(
      `SELECT ci.*, p.name, p.price, p.image_url, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`
    ).all(req.user.id);

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;