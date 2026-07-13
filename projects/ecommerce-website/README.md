# ShopEasy — E-Commerce Website

A complete e-commerce web application built with **React** (Vite), **Node.js/Express**, and **SQLite**.

## Features

- **User Authentication** — Register, login, JWT-based auth with role-based access (Admin & Buyer)
- **Product Catalog** — Browse products with category filtering, search, and sorting
- **Product Details** — Full product info with quantity selection and add-to-cart
- **Shopping Cart** — Add/remove items, adjust quantities, real-time total
- **Checkout** — Cash on delivery order placement with shipping info
- **Order Tracking** — View order history with status badges
- **Admin Dashboard** — Overview stats (products, orders, revenue, pending)
- **Admin Product Management** — Create, edit, delete products via modal form
- **Admin Order Management** — View all orders, update order status via dropdown

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Plain CSS |
| Backend | Node.js, Express 4 |
| Database | SQLite via better-sqlite3 |
| Auth | JWT (jsonwebtoken), bcryptjs |
| API | REST API |

## Project Structure

```
ecommerce-website/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── database.js
│   ├── seed.js
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── auth.js
│       ├── products.js
│       ├── cart.js
│       └── orders.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── context/
│       │   └── AuthContext.jsx
│       └── components/
│           ├── Navbar.jsx / .css
│           ├── Login.jsx / .css
│           ├── Register.jsx / .css
│           ├── ProductList.jsx / .css
│           ├── ProductCard.jsx / .css
│           ├── ProductDetail.jsx / .css
│           ├── Cart.jsx / .css
│           ├── Checkout.jsx / .css
│           ├── AdminDashboard.jsx / .css
│           ├── AdminProducts.jsx / .css
│           └── AdminOrders.jsx / .css
├── db/                    (auto-created at runtime)
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm (comes with Node.js)

### Installation

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../frontend
npm install
```

### Running

Open **two terminal windows**:

```bash
# Terminal 1 — Start backend (port 3004)
cd backend
npm run dev

# Terminal 2 — Start frontend (port 5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

The database is auto-seeded on first backend start.

### Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@shop.com` | `admin123` |
| Buyer | `buyer@test.com` | `buyer123` |

### Seed Data

- **4 Categories**: Electronics, Clothing, Books, Home & Kitchen
- **13 Products** with real Unsplash images
- **2 Users** (admin + test buyer)

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new buyer |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Get current user (auth required) |

### Products (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (`?category=id`, `?search=q`, `?sort=price_asc\|price_desc\|newest`) |
| GET | `/api/products/:id` | Product detail |
| GET | `/api/categories` | List categories |

### Cart (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add to cart (`{product_id, quantity}`) |
| PUT | `/api/cart/:id` | Update quantity (`{quantity}`) |
| DELETE | `/api/cart/:id` | Remove item |

### Orders (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order (`{shipping_address, phone}`) |
| GET | `/api/orders` | User's orders |
| GET | `/api/orders/:id` | Order detail with items |

### Admin (Auth + Admin Role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |
| GET | `/api/admin/orders` | All orders |
| PUT | `/api/admin/orders/:id/status` | Update status (`{status}`) |

## License

MIT