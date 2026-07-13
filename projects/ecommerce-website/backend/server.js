const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Ensure db directory exists
const dbDir = path.join(__dirname, '..', 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = require('./database');

// Auto-seed on first start
const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
if (categoryCount.count === 0) {
  require('./seed');
}

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

const productsRoute = require('./routes/products');
app.use('/api/products', productsRoute.router);
app.use('/api/categories', productsRoute.router);

app.use('/api/cart', require('./routes/cart'));

const ordersRoute = require('./routes/orders');
app.use('/api/orders', ordersRoute.router);

// Admin routes
app.use('/api/admin', productsRoute.adminRouter);
app.use('/api/admin', ordersRoute.adminRouter);

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`E-Commerce API running on port ${PORT}`);
});