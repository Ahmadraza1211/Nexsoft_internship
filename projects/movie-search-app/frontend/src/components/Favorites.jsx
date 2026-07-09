import MovieCard from './MovieCard';
import './Favorites.css';

export default function Favorites({ favorites, onToggleFavorite, onMovieClick }) {
  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h2 className="favorites-title">❤️ Your Favorites</h2>
        <p className="favorites-count">
          {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <span className="empty-icon">💔</span>
          <p>No favorites yet</p>
          <p className="empty-hint">Click the heart icon on any movie to add it here</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={{
                imdbID: movie.imdbID,
                Title: movie.title,
                Year: movie.year,
                Poster: movie.poster,
                Type: movie.type,
              }}
              isFavorited={true}
              onToggleFavorite={() => onToggleFavorite({
                imdbID: movie.imdbID,
                Title: movie.title,
                Year: movie.year,
                Poster: movie.poster,
                Type: movie.type,
              })}
              onClick={() => onMovieClick(movie.imdbID)}
            />
          ))}
        </div>
      )}
    </div>
  );
}