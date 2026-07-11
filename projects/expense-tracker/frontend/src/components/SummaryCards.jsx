import React from 'react';
import './SummaryCards.css';

export default function SummaryCards({ summary, loading }) {
  const { totalIncome, totalExpenses, balance } = summary;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="summary-cards">
        {[1, 2, 3].map((i) => (
          <div key={i} className="summary-card skeleton">
            <div className="skeleton-line skeleton-label" />
            <div className="skeleton-line skeleton-value" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="summary-cards">
      <div className="summary-card income">
        <span className="summary-label">Total Income</span>
        <span className="summary-value income-value">+{formatCurrency(totalIncome)}</span>
      </div>
      <div className="summary-card expense">
        <span className="summary-label">Total Expenses</span>
        <span className="summary-value expense-value">-{formatCurrency(totalExpenses)}</span>
      </div>
      <div className="summary-card balance">
        <span className="summary-label">Balance</span>
        <span className={`summary-value ${balance >= 0 ? 'positive-value' : 'negative-value'}`}>
          {formatCurrency(balance)}
        </span>
      </div>
    </div>
  );
}