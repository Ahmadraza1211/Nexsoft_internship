const express = require('express');
const { db, CATEGORIES, INCOME_CATEGORIES, getAllCategories } = require('../database');

const router = express.Router();

// --- Validation ---

function validateExpense(body, required = true) {
  const errors = [];
  if (required && (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0)) {
    errors.push('Title is required and must be a non-empty string.');
  }
  if (required && (body.amount === undefined || body.amount === null)) {
    errors.push('Amount is required.');
  } else if (body.amount !== undefined) {
    const amount = Number(body.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.push('Amount must be a positive number.');
    }
  }
  if (required && (!body.category || typeof body.category !== 'string')) {
    errors.push('Category is required.');
  } else if (body.category && !CATEGORIES.includes(body.category)) {
    errors.push('Invalid category. Must be one of: ' + CATEGORIES.join(', '));
  }
  if (required && (!body.date || typeof body.date !== 'string')) {
    errors.push('Date is required.');
  } else if (body.date && isNaN(Date.parse(body.date))) {
    errors.push('Date must be a valid date string.');
  }
  if (body.notes !== undefined && typeof body.notes !== 'string') {
    errors.push('Notes must be a string.');
  }
  return errors;
}

function buildFilters(query) {
  const { month, category, from, to } = query;
  let where = '1=1';
  const params = [];
  if (month) { where += ' AND strftime("%Y-%m", date) = ?'; params.push(month); }
  if (category) { where += ' AND category = ?'; params.push(category); }
  if (from) { where += ' AND date >= ?'; params.push(from); }
  if (to) { where += ' AND date <= ?'; params.push(to); }
  return { where, params };
}

// ============================
// GET /api/summary
// ============================
router.get('/summary', (req, res) => {
  try {
    const { where, params } = buildFilters(req.query);
    const incPH = INCOME_CATEGORIES.map(() => '?').join(',');
    const incomeResult = db.prepare(
      `SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE ${where} AND category IN (${incPH})`
    ).get(...params, ...INCOME_CATEGORIES);
    const expenseResult = db.prepare(
      `SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE ${where} AND category NOT IN (${incPH})`
    ).get(...params, ...INCOME_CATEGORIES);
    const byCategory = db.prepare(
      `SELECT category, SUM(amount) as total, COUNT(*) as count FROM expenses WHERE ${where} GROUP BY category ORDER BY total DESC`
    ).all(...params);
    res.json({
      totalIncome: incomeResult.total,
      totalExpenses: expenseResult.total,
      balance: incomeResult.total - expenseResult.total,
      byCategory
    });
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// ============================
// GET /api/categories
// ============================
router.get('/categories', (req, res) => {
  try {
    const categories = getAllCategories();
    const counts = db.prepare('SELECT category, COUNT(*) as count FROM expenses GROUP BY category').all();
    const countMap = {};
    counts.forEach(c => { countMap[c.category] = c.count; });
    res.json(categories.map(cat => ({ ...cat, count: countMap[cat.name] || 0 })));
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ============================
// GET /api/monthly/:year
// ============================
router.get('/monthly/:year', (req, res) => {
  try {
    const year = req.params.year;
    if (!/^\d{4}$/.test(year)) return res.status(400).json({ error: 'Year must be a 4-digit number' });
    const monthlyData = db.prepare(`
      SELECT strftime('%Y-%m', date) as month,
        SUM(CASE WHEN category IN ('Salary','Freelance') THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN category NOT IN ('Salary','Freelance') THEN amount ELSE 0 END) as expenses
      FROM expenses WHERE strftime('%Y', date) = ?
      GROUP BY strftime('%Y-%m', date) ORDER BY month
    `).all(year);
    const allMonths = [];
    for (let m = 1; m <= 12; m++) {
      const ms = year + '-' + String(m).padStart(2, '0');
      const found = monthlyData.find(d => d.month === ms);
      allMonths.push({ month: ms, income: found ? found.income : 0, expenses: found ? found.expenses : 0 });
    }
    res.json(allMonths);
  } catch (err) {
    console.error('Error fetching monthly data:', err);
    res.status(500).json({ error: 'Failed to fetch monthly data' });
  }
});

// ============================
// GET /api/expenses
// ============================
router.get('/expenses', (req, res) => {
  try {
    const { where, params } = buildFilters(req.query);
    const query = `SELECT * FROM expenses WHERE ${where} ORDER BY date DESC, created_at DESC`;
    res.json(db.prepare(query).all(...params));
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// ============================
// GET /api/expenses/:id
// ============================
router.get('/expenses/:id', (req, res) => {
  try {
    const expense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    console.error('Error fetching expense:', err);
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
});

// ============================
// POST /api/expenses
// ============================
router.post('/expenses', (req, res) => {
  try {
    const errors = validateExpense(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });
    const { title, amount, category, date, notes } = req.body;
    const result = db.prepare(
      'INSERT INTO expenses (title, amount, category, date, notes) VALUES (?, ?, ?, ?, ?)'
    ).run(title.trim(), Number(amount), category, date, notes || null);
    const expense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(expense);
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// ============================
// PUT /api/expenses/:id
// ============================
router.put('/expenses/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Expense not found' });
    const errors = validateExpense(req.body, false);
    if (errors.length > 0) return res.status(400).json({ errors });
    const { title, amount, category, date, notes } = req.body;
    db.prepare(
      `UPDATE expenses SET
        title = COALESCE(?, title), amount = COALESCE(?, amount),
        category = COALESCE(?, category), date = COALESCE(?, date), notes = ?
      WHERE id = ?`
    ).run(
      title ? title.trim() : null,
      amount !== undefined ? Number(amount) : null,
      category || null, date || null,
      notes !== undefined ? notes : existing.notes,
      req.params.id
    );
    res.json(db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id));
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// ============================
// DELETE /api/expenses/:id
// ============================
router.delete('/expenses/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM expenses WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

module.exports = router;