const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'expenses.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create expenses table
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

// Pre-seed categories as a reference (stored in-memory, used for validation)
const CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment',
  'Health', 'Education', 'Salary', 'Freelance', 'Other'
];

const INCOME_CATEGORIES = ['Salary', 'Freelance'];

function isIncomeCategory(category) {
  return INCOME_CATEGORIES.includes(category);
}

function getAllCategories() {
  return CATEGORIES.map(cat => ({
    name: cat,
    type: isIncomeCategory(cat) ? 'income' : 'expense'
  }));
}

module.exports = { db, CATEGORIES, INCOME_CATEGORIES, isIncomeCategory, getAllCategories };