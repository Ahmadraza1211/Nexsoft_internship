const express = require('express');
const db = require('../database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();
const adminRouter = express.Router();

// === BUYER ROUTES ===

// POST /api/orders — place order from cart
router.post('/', authMiddleware, (req, res) => {
  try {
    const { shipping_address, phone } = req.body;

    if (!shipping_address || !phone) {
      return res.status(400).json({ error: 'Shipping address and phone are required' });
    }

    // Get cart items
    const cartItems = db.prepare(
      `SELECT ci.*, p.name, p.price, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`
    ).all(req.user.id);

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Check stock
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for "${item.name}"` });
      }
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order in a transaction
    const createOrder = db.transaction(() => {
      const orderResult = db.prepare(
        'INSERT INTO orders (user_id, total_amount, status, shipping_address, phone) VALUES (?, ?, ?, ?, ?)'
      ).run(req.user.id, totalAmount, 'pending', shipping_address, phone);

      const orderId = orderResult.lastInsertRowid;

      const insertItem = db.prepare(
        'INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)'
      );

      for (const item of cartItems) {
        insertItem.run(
          orderId,
          item.product_id,
          item.name,
          item.price,
          item.quantity,
          item.price * item.quantity
        );
      }

      // Reduce stock
      const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
      for (const item of cartItems) {
        updateStock.run(item.quantity, item.product_id);
      }

      // Clear cart
      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);

      return orderId;
    });

    const orderId = createOrder();

    const order = db.prepare(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`
    ).get(orderId);

    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

    res.status(201).json({ order, items: orderItems });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders — user's orders
router.get('/', authMiddleware, (req, res) => {
  const orders = db
    .prepare(
      `SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`
    )
    .all(req.user.id);
  res.json(orders);
});

// GET /api/orders/:id — order detail
router.get('/:id', authMiddleware, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(
    req.params.id,
    req.user.id
  );

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(req.params.id);
  res.json({ order, items });
});

// === ADMIN ROUTES ===

// GET /api/admin/orders
adminRouter.get('/orders', authMiddleware, adminMiddleware, (req, res) => {
  const orders = db
    .prepare(
      `SELECT o.*, u.name as user_name, u.email as user_email,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    )
    .all();
  res.json(orders);
});

// PUT /api/admin/orders/:id/status
adminRouter.put('/orders/:id/status', authMiddleware, adminMiddleware, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);

  const updated = db.prepare(
    `SELECT o.*, u.name as user_name, u.email as user_email
     FROM orders o
     JOIN users u ON o.user_id = u.id
     WHERE o.id = ?`
  ).get(req.params.id);

  res.json(updated);
});

module.exports = { router, adminRouter };