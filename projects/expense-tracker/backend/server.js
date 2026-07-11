const express = require('express');
const cors = require('cors');
const path = require('path');

const expensesRouter = require('./routes/expenses');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Mount all API routes
app.use('/api', expensesRouter);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log('Expense Tracker API running on http://localhost:' + PORT);
});

module.exports = app;