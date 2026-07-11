import React, { useState } from 'react';
import './ExpenseList.css';

const INCOME_CATEGORIES = ['Salary', 'Freelance'];

const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Transport: '#3b82f6',
  Shopping: '#ec4899',
  Bills: '#8b5cf6',
  Entertainment: '#f97316',
  Health: '#ef4444',
  Education: '#06b6d4',
  Salary: '#16a34a',
  Freelance: '#10b981',
  Other: '#6b7280',
};

export default function ExpenseList({ expenses, loading, onDelete, incomeCategories }) {
  const [deleting, setDeleting] = useState(null);

  const isIncome = (category) => {
    return (incomeCategories || INCOME_CATEGORIES).includes(category);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = async (id) => {
    if (deleting) return;
    setDeleting(id);
    try {
      await onDelete(id);
    } catch (err) {
      alert('Failed to delete expense.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="expense-list-container">
        <div className="expense-list-header">
          <h2 className="section-title">Transactions</h2>
        </div>
        <div className="expense-list">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="expense-row skeleton-row">
              <div className="skeleton-box" style={{ width: '140px', height: '16px' }} />
              <div className="skeleton-box" style={{ width: '80px', height: '22px' }} />
              <div className="skeleton-box" style={{ width: '90px', height: '14px' }} />
              <div className="skeleton-box" style={{ width: '32px', height: '32px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="expense-list-container">
        <div className="expense-list-header">
          <h2 className="section-title">Transactions</h2>
        </div>
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48" opacity="0.3">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="empty-text">No transactions found</p>
          <p className="empty-subtext">Click "Add Transaction" to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list-container">
      <div className="expense-list-header">
        <h2 className="section-title">
          Transactions
          <span className="expense-count">{expenses.length}</span>
        </h2>
      </div>
      <div className="expense-list">
        {expenses.map((expense) => {
          const income = isIncome(expense.category);
          const color = CATEGORY_COLORS[expense.category] || '#6b7280';
          return (
            <div key={expense.id} className="expense-row">
              <div className="expense-info">
                <span className="expense-title">{expense.title}</span>
                <span
                  className="expense-category-badge"
                  style={{ background: color + '15', color: color }}
                >
                  {expense.category}
                </span>
              </div>
              <span className={`expense-amount ${income ? 'amount-income' : 'amount-expense'}`}>
                {income ? '+' : '-'}{formatCurrency(expense.amount)}
              </span>
              <span className="expense-date">{formatDate(expense.date)}</span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(expense.id)}
                disabled={deleting === expense.id}
                aria-label="Delete transaction"
                title="Delete"
              >
                {deleting === expense.id ? (
                  <span className="spinner" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}