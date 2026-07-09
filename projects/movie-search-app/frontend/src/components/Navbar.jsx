import './Navbar.css';

export default function Navbar({ onFavoritesClick, showFavorites, favoritesCount }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand" onClick={() => showFavorites && onFavoritesClick()}>
          <span className="navbar-icon">🎬</span>
          <span className="navbar-title">MovieFinder</span>
        </div>
        <button
          className={`nav-fav-btn ${showFavorites ? 'active' : ''}`}
          onClick={onFavoritesClick}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={showFavorites ? '#f5c518' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>Favorites</span>
          {favoritesCount > 0 && (
            <span className="fav-badge">{favoritesCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}