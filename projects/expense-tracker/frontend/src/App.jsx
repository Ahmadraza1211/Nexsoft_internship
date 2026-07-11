import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import './App.css';

const INCOME_CATEGORIES = ['Salary', 'Freelance'];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0, byCategory: [] });
  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ month: '', category: '' });

  const currentYear = new Date().getFullYear();

  const fetchExpenses = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.month) params.set('month', filters.month);
      if (filters.category) params.set('category', filters.category);
      const res = await fetch(`/api/expenses?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch expenses');
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  }, [filters.month, filters.category]);

  const fetchSummary = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.month) params.set('month', filters.month);
      if (filters.category) params.set('category', filters.category);
      const res = await fetch(`/api/summary?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch summary');
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  }, [filters.month, filters.category]);

  const fetchMonthly = useCallback(async () => {
    try {
      const res = await fetch(`/api/monthly/${currentYear}`);
      if (!res.ok) throw new Error('Failed to fetch monthly data');
      const data = await res.json();
      setMonthly(data);
    } catch (err) {
      console.error('Error fetching monthly data:', err);
    }
  }, [currentYear]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchExpenses(), fetchSummary(), fetchMonthly(), fetchCategories()])
      .finally(() => setLoading(false));
  }, [fetchExpenses, fetchSummary, fetchMonthly, fetchCategories]);

  const addExpense = async (expense) => {
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.errors ? data.errors.join(', ') : 'Failed to add expense');
    }
    fetchExpenses();
    fetchSummary();
    fetchMonthly();
    fetchCategories();
  };

  const deleteExpense = async (id) => {
    const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete expense');
    fetchExpenses();
    fetchSummary();
    fetchMonthly();
    fetchCategories();
  };

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Dashboard
          expenses={expenses}
          summary={summary}
          monthly={monthly}
          categories={categories}
          loading={loading}
          filters={filters}
          setFilters={setFilters}
          onAddExpense={addExpense}
          onDeleteExpense={deleteExpense}
          incomeCategories={INCOME_CATEGORIES}
          currentYear={currentYear}
        />
      </main>
    </div>
  );
}

export default App;