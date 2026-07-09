import './MovieDetail.css';

export default function MovieDetail({ movie, isFavorited, onToggleFavorite, onClose }) {
  if (!movie) return null;

  const m = {
    title: movie.Title || movie.title || 'Unknown',
    year: movie.Year || movie.year || 'N/A',
    rated: movie.Rated || 'N/A',
    released: movie.Released || 'N/A',
    runtime: movie.Runtime || 'N/A',
    genre: movie.Genre || 'N/A',
    director: movie.Director || 'N/A',
    actors: movie.Actors || 'N/A',
    plot: movie.Plot || 'No plot available.',
    language: movie.Language || 'N/A',
    country: movie.Country || 'N/A',
    awards: movie.Awards || 'N/A',
    imdbRating: movie.imdbRating || 'N/A',
    boxOffice: movie.BoxOffice || 'N/A',
    poster: movie.Poster || movie.poster || '',
    type: movie.Type || movie.type || '',
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-body">
          <div className="modal-poster">
            {m.poster && m.poster !== 'N/A' ? (
              <img src={m.poster} alt={m.title} />
            ) : (
              <div className="modal-poster-placeholder">🎬</div>
            )}
          </div>

          <div className="modal-info">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{m.title}</h2>
                <div className="modal-meta">
                  <span className="modal-year">{m.year}</span>
                  {m.type && <span className="modal-type">{m.type}</span>}
                  {m.rated !== 'N/A' && <span className="modal-rated">{m.rated}</span>}
                </div>
              </div>
              <button
                className={`modal-fav-btn ${isFavorited ? 'favorited' : ''}`}
                onClick={onToggleFavorite}
              >
                {isFavorited ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#f5c518" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                )}
              </button>
            </div>

            {m.imdbRating !== 'N/A' && (
              <div className="modal-rating">
                <span className="rating-star">⭐</span>
                <span className="rating-value">{m.imdbRating}</span>
                <span className="rating-label">/10</span>
              </div>
            )}

            <p className="modal-plot">{m.plot}</p>

            <div className="modal-details-grid">
              {[
                ['Released', m.released],
                ['Runtime', m.runtime],
                ['Genre', m.genre],
                ['Director', m.director],
                ['Actors', m.actors],
                ['Language', m.language],
                ['Country', m.country],
                ['Box Office', m.boxOffice],
              ].map(([label, value]) =>
                value && value !== 'N/A' ? (
                  <div className="detail-item" key={label}>
                    <span className="detail-label">{label}</span>
                    <span className="detail-value">{value}</span>
                  </div>
                ) : null
              )}
            </div>

            {m.awards && m.awards !== 'N/A' && (
              <div className="modal-awards">
                <span className="awards-icon">🏆</span>
                <span>{m.awards}</span>
              </div>
            )}

            {movie.fromCache && (
              <div className="cache-badge">⚡ Cached</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}