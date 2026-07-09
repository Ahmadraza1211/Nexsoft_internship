import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import CategoryFilter from './components/CategoryFilter';
import NewsCard from './components/NewsCard';

const API_BASE = '/api';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [categories, setCategories] = useState([]);
  const [fetchingNews, setFetchingNews] = useState(false);

  const limit = 12;

  const fetchArticles = useCallback(async (pageNum, category, query) => {
    setLoading(true);
    setError(null);

    try {
      let url;
      if (query && query.trim()) {
        url = `${API_BASE}/news/search?q=${encodeURIComponent(query.trim())}&page=${pageNum}&limit=${limit}`;
      } else if (category && category !== 'All') {
        url = `${API_BASE}/news/category/${encodeURIComponent(category)}?page=${pageNum}&limit=${limit}`;
      } else {
        url = `${API_BASE}/news?page=${pageNum}&limit=${limit}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      if (result.success) {
        if (pageNum === 1) {
          setArticles(result.data);
        } else {
          setArticles((prev) => [...prev, ...result.data]);
        }
        setTotalPages(result.pagination.totalPages);
        setTotalArticles(result.pagination.total);
      } else {
        throw new Error(result.error || 'Failed to fetch articles');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      const result = await response.json();
      if (result.success) {
        setCategories(result.data.map((c) => c.category));
      }
    } catch {
      // Categories are not critical, use defaults
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setPage(1);
    fetchArticles(1, activeCategory, searchQuery);
  }, [activeCategory, searchQuery, fetchArticles]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage, activeCategory, searchQuery);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleRefresh = async () => {
    setFetchingNews(true);
    try {
      const response = await fetch(`${API_BASE}/news/fetch`, { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        setPage(1);
        fetchArticles(1, activeCategory, searchQuery);
        fetchCategories();
      }
    } catch {
      // silently fail
    } finally {
      setFetchingNews(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="app">
      <Navbar onSearch={handleSearch} searchQuery={searchQuery} onRefresh={handleRefresh} fetchingNews={fetchingNews} />
      <main className="main-content">
        <div className="container">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          <div className="results-info">
            {searchQuery && (
              <span className="search-info">
                Showing results for "<strong>{searchQuery}</strong>"
                {totalArticles > 0 && <span> ({totalArticles} articles)</span>}
              </span>
            )}
            {!searchQuery && activeCategory !== 'All' && (
              <span className="search-info">
                Showing <strong>{activeCategory}</strong> news
                {totalArticles > 0 && <span> ({totalArticles} articles)</span>}
              </span>
            )}
            {!searchQuery && activeCategory === 'All' && totalArticles > 0 && (
              <span className="search-info">{totalArticles} articles</span>
            )}
          </div>

          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
              <p className="error-hint">Make sure the backend server is running on port 3001</p>
            </div>
          )}

          {loading && articles.length === 0 ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-badge"></div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                    <div className="skeleton-meta"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {articles.length > 0 ? (
                <div className="news-grid">
                  {articles.map((article) => (
                    <NewsCard key={article.id} article={article} formatDate={formatDate} />
                  ))}
                </div>
              ) : (
                !error && (
                  <div className="no-results">
                    <p>No articles found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
                    {searchQuery && (
                      <button className="clear-search-btn" onClick={() => handleSearch('')}>
                        Clear search
                      </button>
                    )}
                  </div>
                )
              )}

              {page < totalPages && articles.length > 0 && (
                <div className="load-more-container">
                  {loading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      <span>Loading more...</span>
                    </div>
                  ) : (
                    <button className="load-more-btn" onClick={handleLoadMore}>
                      Load More Articles
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} DailyNews — Aggregated from BBC News & NY Times RSS feeds</p>
        </div>
      </footer>
    </div>
  );
}

export default App;