# ExpenseTracker

A clean, simple, and full-featured expense tracking application built with React, Node.js, Express, and SQLite.

## Features

- **Income & Expense Tracking** — Log both income and expenses with categories
- **Summary Dashboard** — See total income, expenses, and balance at a glance
- **Category Management** — 10 pre-defined categories with color-coded badges
- **Filtering** — Filter transactions by month or category
- **Monthly Bar Chart** — Visual overview of income vs expenses per month (pure CSS, no libraries)
- **Responsive Design** — Works on desktop, tablet, and mobile
- **SQLite Database** — Lightweight, file-based storage with zero setup

## Tech Stack

- **Frontend**: React 18 + Vite (plain CSS, minimal dependencies)
- **Backend**: Node.js + Express
- **Database**: SQLite via `better-sqlite3`

## Project Structure

```
expense-tracker/
├── backend/
│   ├── package.json
│   ├── server.js          # Express server (port 3002)
│   ├── database.js        # SQLite setup & schema
│   └── routes/
│       └── expenses.js    # All API routes
├── frontend/
│   ├── package.json
│   ├── vite.config.js     # Vite config with /api proxy
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       └── components/
│           ├── Navbar.jsx / .css
│           ├── Dashboard.jsx / .css
│           ├── ExpenseForm.jsx / .css
│           ├── ExpenseList.jsx / .css
│           └── SummaryCards.jsx / .css
├── README.md
└── .gitignore
```

## Setup & Running

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ (or [Bun](https://bun.sh/))
- npm, yarn, or bun

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Start the Backend

```bash
cd backend
npm start
```

The API server starts on **http://localhost:3002**.

### 3. Start the Frontend (in a new terminal)

```bash
cd frontend
npm run dev
```

The Vite dev server starts on **http://localhost:5173** and proxies `/api` requests to the backend.

### 4. Open in Browser

Visit **http://localhost:5173** to use the app.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | List all expenses (query: `?month=2024-01`, `?category=Food`, `?from=...&to=...`) |
| GET | `/api/expenses/:id` | Get a single expense |
| POST | `/api/expenses` | Create a new expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |
| GET | `/api/summary` | Get summary (income, expenses, balance, category breakdown) |
| GET | `/api/categories` | Get all categories with transaction counts |
| GET | `/api/monthly/:year` | Get monthly income/expenses for a year (12 months) |

## Categories

### Expense Categories
Food, Transport, Shopping, Bills, Entertainment, Health, Education, Other

### Income Categories
Salary, Freelance

## Database

The SQLite database file (`expenses.db`) is created automatically in the `backend/` directory on first run. No additional database setup is required.

## License

MIT