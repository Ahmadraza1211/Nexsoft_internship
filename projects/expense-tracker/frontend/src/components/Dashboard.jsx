import React, { useState } from 'react';
import './Dashboard.css';
import SummaryCards from './SummaryCards';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

export default function Dashboard({
  expenses,
  summary,
  monthly,
  categories,
  loading,
  filters,
  setFilters,
  onAddExpense,
  onDeleteExpense,
  incomeCategories,
  currentYear,
}) {
  const [showForm, setShowForm] = useState(false);

  const getMonthOptions = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = d.toISOString().slice(0, 7);
      const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      months.push({ value, label });
    }
    return months;
  };

  const monthOptions = getMonthOptions();
  const maxMonthlyValue = Math.max(...monthly.map(m => Math.max(m.income, m.expenses)), 1);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatBarValue = (amount) => {
    if (amount >= 1000) return (amount / 1000).toFixed(1) + 'k';
    return amount.toFixed(0);
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="dashboard">
      <SummaryCards summary={summary} loading={loading} />

      <div className="actions-bar">
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Transaction
        </button>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="filter-month" className="filter-label">Month</label>
            <select
              id="filter-month"
              className="filter-select"
              value={filters.month}
              onChange={(e) => setFilters(f => ({ ...f, month: e.target.value }))}
            >
              <option value="">All Time</option>
              {monthOptions.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-category" className="filter-label">Category</label>
            <select
              id="filter-category"
              className="filter-select"
              value={filters.category}
              onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name} ({cat.count})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="section-title-chart">Monthly Overview — {currentYear}</h2>
        <div className="chart">
          <div className="chart-bars">
            {monthly.map((m) => (
              <div key={m.month} className="chart-bar-group">
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar income-bar"
                    style={{ height: (m.income / maxMonthlyValue) * 100 + '%' }}
                    title={`Income: ${formatCurrency(m.income)}`}
                  >
                    {m.income > 0 && (
                      <span className="chart-tooltip">{formatBarValue(m.income)}</span>
                    )}
                  </div>
                  <div
                    className="chart-bar expense-bar"
                    style={{ height: (m.expenses / maxMonthlyValue) * 100 + '%' }}
                    title={`Expenses: ${formatCurrency(m.expenses)}`}
                  >
                    {m.expenses > 0 && (
                      <span className="chart-tooltip">{formatBarValue(m.expenses)}</span>
                    )}
                  </div>
                </div>
                <span className="chart-label">{monthNames[parseInt(m.month.split('-')[1]) - 1]}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot legend-income" />
              Income
            </span>
            <span className="legend-item">
              <span className="legend-dot legend-expense" />
              Expenses
            </span>
          </div>
        </div>
      </div>

      <ExpenseList
        expenses={expenses}
        loading={loading}
        onDelete={onDeleteExpense}
        incomeCategories={incomeCategories}
      />

      {showForm && (
        <ExpenseForm
          onAddExpense={onAddExpense}
          onClose={() => setShowForm(false)}
          categories={categories}
        />
      )}
    </div>
  );
}