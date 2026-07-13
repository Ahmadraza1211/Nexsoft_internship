const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Ensure db directory exists
const dbDir = path.join(__dirname, '..', 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = require('./database');

function seed() {
  // Check if already seeded
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (categoryCount.count > 0) {
    console.log('Database already seeded. Skipping.');
    return;
  }

  console.log('Seeding database...');

  // Insert users
  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  );

  const adminPassword = bcrypt.hashSync('admin123', 10);
  const buyerPassword = bcrypt.hashSync('buyer123', 10);

  const admin = insertUser.run('Admin User', 'admin@shop.com', adminPassword, 'admin');
  const buyer = insertUser.run('Test Buyer', 'buyer@test.com', buyerPassword, 'buyer');

  console.log(`Created admin (id: ${admin.lastInsertRowid}) and buyer (id: ${buyer.lastInsertRowid})`);

  // Insert categories
  const insertCategory = db.prepare(
    'INSERT INTO categories (name, description) VALUES (?, ?)'
  );

  const categories = [
    { name: 'Electronics', description: 'Latest gadgets and tech accessories' },
    { name: 'Clothing', description: 'Trendy fashion for everyone' },
    { name: 'Books', description: 'Bestsellers and classic reads' },
    { name: 'Home & Kitchen', description: 'Essentials for your home' },
  ];

  const categoryIds = {};
  for (const cat of categories) {
    const result = insertCategory.run(cat.name, cat.description);
    categoryIds[cat.name] = result.lastInsertRowid;
  }

  console.log(`Created ${categories.length} categories`);

  // Insert products
  const insertProduct = db.prepare(
    'INSERT INTO products (name, description, price, stock, image_url, category_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  const products = [
    // Electronics
    {
      name: 'Wireless Headphones',
      description: 'Premium wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
      price: 79.99,
      stock: 35,
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      category: 'Electronics',
    },
    {
      name: 'Smart Watch',
      description: 'Feature-rich smartwatch with health tracking, GPS, and a beautiful AMOLED display. Stay connected on the go.',
      price: 199.99,
      stock: 25,
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      category: 'Electronics',
    },
    {
      name: 'Bluetooth Speaker',
      description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design. Great for outdoor adventures.',
      price: 49.99,
      stock: 40,
      image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
      category: 'Electronics',
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with HDMI, USB 3.0 ports, and SD card reader. Essential for laptop users.',
      price: 34.99,
      stock: 50,
      image_url: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop',
      category: 'Electronics',
    },
    // Clothing
    {
      name: 'Denim Jacket',
      description: 'Classic denim jacket with a modern fit. Made from premium cotton with a comfortable inner lining.',
      price: 89.99,
      stock: 20,
      image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop',
      category: 'Clothing',
    },
    {
      name: 'Running Shoes',
      description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Ideal for daily training.',
      price: 119.99,
      stock: 30,
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      category: 'Clothing',
    },
    {
      name: 'Cotton T-Shirt',
      description: 'Soft 100% organic cotton t-shirt available in multiple colors. A wardrobe essential for everyday wear.',
      price: 24.99,
      stock: 60,
      image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      category: 'Clothing',
    },
    // Books
    {
      name: 'The Great Novel',
      description: 'A captivating story of adventure and self-discovery. One of the most acclaimed novels of the year.',
      price: 14.99,
      stock: 45,
      image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
      category: 'Books',
    },
    {
      name: 'Science Explorer',
      description: 'An engaging introduction to the wonders of science. Perfect for curious minds of all ages.',
      price: 19.99,
      stock: 30,
      image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop',
      category: 'Books',
    },
    {
      name: 'Programming Guide',
      description: 'Comprehensive programming guide covering modern development practices. From beginner to advanced concepts.',
      price: 39.99,
      stock: 25,
      image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
      category: 'Books',
    },
    // Home & Kitchen
    {
      name: 'Coffee Maker',
      description: 'Programmable coffee maker with 12-cup capacity and built-in grinder. Wake up to fresh coffee every morning.',
      price: 64.99,
      stock: 20,
      image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop',
      category: 'Home & Kitchen',
    },
    {
      name: 'Desk Lamp',
      description: 'Adjustable LED desk lamp with touch dimming and USB charging port. Perfect for study and work spaces.',
      price: 29.99,
      stock: 35,
      image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop',
      category: 'Home & Kitchen',
    },
    {
      name: 'Plant Pot Set',
      description: 'Set of 3 minimalist ceramic plant pots in different sizes. Add a touch of green to any room.',
      price: 22.99,
      stock: 40,
      image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
      category: 'Home & Kitchen',
    },
  ];

  for (const p of products) {
    insertProduct.run(
      p.name,
      p.description,
      p.price,
      p.stock,
      p.image_url,
      categoryIds[p.category],
      admin.lastInsertRowid
    );
  }

  console.log(`Created ${products.length} products`);
  console.log('Seeding complete!');
}

seed();