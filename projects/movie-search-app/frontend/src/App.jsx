import { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieDetail from './components/MovieDetail';
import Favorites from './components/Favorites';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      setFavorites(data);
    } catch {
      // silently fail
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setSearchHistory(data);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
    fetchHistory();
  }, [fetchFavorites, fetchHistory]);

  const searchMovies = useCallback(async (query, page = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setShowFavorites(false);
    setCurrentPage(page);
    setCurrentQuery(query);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${page}`);
      const data = await res.json();

      if (data.Response === 'False') {
        setMovies([]);
        setTotalResults(0);
        setError('No movies found. Try a different search term.');
      } else {
        setMovies(data.Search || []);
        setTotalResults(parseInt(data.totalResults, 10) || 0);
      }
    } catch {
      setError('Failed to search movies. Please try again.');
      setMovies([]);
    } finally {
      setLoading(false);
      fetchHistory();
    }
  }, []);

  const handlePageChange = (newPage) => {
    searchMovies(currentQuery, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openMovieDetail = async (imdbID) => {
    try {
      const res = await fetch(`/api/movie/${imdbID}`);
      const data = await res.json();
      if (data.Response === 'False') {
        setError(data.Error || 'Failed to load movie details.');
        return;
      }
      setSelectedMovie(data);
    } catch {
      setError('Failed to load movie details.');
    }
  };

  const closeMovieDetail = () => {
    setSelectedMovie(null);
  };

  const toggleFavorite = async (movie) => {
    const isFav = favorites.some(f => f.imdbID === movie.imdbID);

    try {
      if (isFav) {
        await fetch(`/api/favorites/${movie.imdbID}`, { method: 'DELETE' });
        setFavorites(prev => prev.filter(f => f.imdbID !== movie.imdbID));
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imdbID: movie.imdbID,
            title: movie.Title || movie.title,
            year: movie.Year || movie.year,
            poster: movie.Poster || movie.poster,
            type: movie.Type || movie.type,
          }),
        });
        setFavorites(prev => [
          ...prev,
          {
            imdbID: movie.imdbID,
            title: movie.Title || movie.title,
            year: movie.Year || movie.year,
            poster: movie.Poster || movie.poster,
            type: movie.Type || movie.type,
            added_at: Date.now(),
          },
        ]);
      }
    } catch {
      // silently fail
    }
  };

  const handleHistoryClick = (query) => {
    searchMovies(query, 1);
  };

  const isFavorited = (imdbID) => favorites.some(f => f.imdbID === imdbID);

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="app">
      <Navbar
        onFavoritesClick={() => {
          setShowFavorites(!showFavorites);
          if (!showFavorites) {
            setMovies([]);
            setError('');
            setCurrentQuery('');
          }
        }}
        showFavorites={showFavorites}
        favoritesCount={favorites.length}
      />

      <main className="main-content">
        {!showFavorites ? (
          <>
            <SearchBar
              onSearch={searchMovies}
              loading={loading}
            />

            {searchHistory.length > 0 && !currentQuery && (
              <div className="search-history">
                <span className="history-label">Recent:</span>
                <div className="history-chips">
                  {searchHistory.map((item) => (
                    <button
                      key={item.query + item.searched_at}
                      className="history-chip"
                      onClick={() => handleHistoryClick(item.query)}
                    >
                      {item.query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="loading-container">
                <div className="spinner" />
                <p>Searching movies...</p>
              </div>
            )}

            {error && !loading && (
              <div className="no-results">
                <span className="no-results-icon">🔍</span>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && movies.length > 0 && (
              <>
                <div className="results-info">
                  <p>Found <strong>{totalResults.toLocaleString()}</strong> results for "<strong>{currentQuery}</strong>"</p>
                </div>
                <div className="movie-grid">
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.imdbID}
                      movie={movie}
                      isFavorited={isFavorited(movie.imdbID)}
                      onToggleFavorite={() => toggleFavorite(movie)}
                      onClick={() => openMovieDetail(movie.imdbID)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-btn"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      ← Previous
                    </button>
                    <span className="page-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="page-btn"
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}

            {!loading && !error && !currentQuery && (
              <div className="welcome">
                <h1>🎬 Discover Movies</h1>
                <p>Search for any movie, TV show, or series</p>
              </div>
            )}
          </>
        ) : (
          <Favorites
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onMovieClick={openMovieDetail}
            onRefresh={fetchFavorites}
          />
        )}
      </main>

      {selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          isFavorited={isFavorited(selectedMovie.imdbID)}
          onToggleFavorite={() => toggleFavorite({
            imdbID: selectedMovie.imdbID,
            Title: selectedMovie.Title,
            Year: selectedMovie.Year,
            Poster: selectedMovie.Poster,
            Type: selectedMovie.Type,
          })}
          onClose={closeMovieDetail}
        />
      )}
    </div>
  );
}

export default App;