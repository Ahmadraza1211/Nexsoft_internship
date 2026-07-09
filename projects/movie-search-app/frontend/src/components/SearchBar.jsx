import { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search for movies, TV shows, series..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setQuery('')}
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className="search-btn"
        disabled={!query.trim() || loading}
      >
        {loading ? (
          <span className="search-spinner" />
        ) : (
          'Search'
        )}
      </button>
    </form>
  );
}