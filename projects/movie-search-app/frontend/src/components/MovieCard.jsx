import './MovieCard.css';

export default function MovieCard({ movie, isFavorited, onToggleFavorite, onClick }) {
  const title = movie.Title || movie.title;
  const year = movie.Year || movie.year;
  const poster = movie.Poster || movie.poster;
  const type = movie.Type || movie.type;
  const imdbID = movie.imdbID;

  return (
    <div className="movie-card" onClick={() => onClick(imdbID)}>
      <div className="card-poster-wrapper">
        {poster && poster !== 'N/A' ? (
          <img
            src={poster}
            alt={title}
            className="card-poster"
            loading="lazy"
          />
        ) : (
          <div className="card-poster-placeholder">
            <span>🎬</span>
          </div>
        )}
        <button
          className={`card-fav-btn ${isFavorited ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorited ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#f5c518" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          )}
        </button>
        {type && (
          <span className="card-type-badge">{type}</span>
        )}
      </div>
      <div className="card-info">
        <h3 className="card-title">{title}</h3>
        <p className="card-year">{year}</p>
      </div>
    </div>
  );
}