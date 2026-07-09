import { useState } from 'react';

export default function Navbar({ onSearch, searchQuery, onRefresh, fetchingNews }) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  const handleChange = (e) => {
    setLocalQuery(e.target.value);
    if (e.target.value === '') {
      onSearch('');
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearch('');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-brand" onClick={(e) => { e.preventDefault(); handleClear(); }}>
          <span className="logo">📰</span>
          <h1>Daily<span>News</span></h1>
        </a>

        <form className="navbar-search" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search news..."
            value={localQuery}
            onChange={handleChange}
          />
          {localQuery && (
            <span className="search-icon" style={{ cursor: 'pointer', pointerEvents: 'auto', right: '36px' }} onClick={handleClear}>
              ✕
            </span>
          )}
          <span className="search-icon">🔍</span>
        </form>

        <div className="navbar-actions">
          <button className="refresh-btn" onClick={onRefresh} disabled={fetchingNews}>
            <span className={fetchingNews ? 'spin' : ''}>↻</span>
            {fetchingNews ? 'Fetching...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Mobile refresh button */}
      <div className="container" style={{ display: 'none' }}>
        <button className="refresh-btn-mobile" onClick={onRefresh} disabled={fetchingNews}>
          <span className={fetchingNews ? 'spin' : ''}>↻</span>
          {fetchingNews ? 'Fetching...' : 'Refresh'}
        </button>
      </div>
    </nav>
  );
}