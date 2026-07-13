const express = require('express');
const db = require('../database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();
const adminRouter = express.Router();

// GET /api/categories
router.get('/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
  res.json(categories);
});

// GET /api/products
router.get('/', (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (sort === 'price_asc') {
      query += ' ORDER BY p.price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY p.price DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY p.created_at DESC';
    } else {
      query += ' ORDER BY p.id ASC';
    }

    const products = db.prepare(query).all(...params);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = db
    .prepare(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`
    )
    .get(req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

// === ADMIN ROUTES ===

// POST /api/admin/products
adminRouter.post('/products', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { name, description, price, stock, image_url, category_id } = req.body;

    if (!name || price === undefined || !category_id) {
      return res.status(400).json({ error: 'Name, price, and category_id are required' });
    }

    const result = db.prepare(
      'INSERT INTO products (name, description, price, stock, image_url, category_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(name, description || '', price, stock || 0, image_url || '', category_id, req.user.id);

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/products/:id
adminRouter.put('/products/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { name, description, price, stock, image_url, category_id } = req.body;
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    db.prepare(
      `UPDATE products SET
        name = ?, description = ?, price = ?, stock = ?, image_url = ?, category_id = ?
       WHERE id = ?`
    ).run(
      name ?? product.name,
      description ?? product.description,
      price ?? product.price,
      stock ?? product.stock,
      image_url ?? product.image_url,
      category_id ?? product.category_id,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/products/:id
adminRouter.delete('/products/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    db.prepare('DELETE FROM cart_items WHERE product_id = ?').run(req.params.id);
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = { router, adminRouter };