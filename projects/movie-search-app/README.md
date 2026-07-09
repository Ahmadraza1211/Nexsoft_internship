# 🎬 MovieFinder - Movie Search Application

A full-stack movie search app with caching, favorites, and dark UI. Powered by the "IMDb API"

## ✨ Features

- **Movie Search** — Search any movie, TV show, or series with real-time results
- **Movie Details** — View detailed information including plot, cast, ratings, awards
- **Favorites** — Save your favorite movies locally in SQLite
- **Search History** — Quick access to recent searches
- **Caching** — SQLite caching for faster repeat searches (24-hour TTL)
- **Dark Theme** — Clean, modern IMDB-inspired dark UI
- **Responsive** — Works great on mobile, tablet, and desktop
- **Pagination** — Browse through thousands of results

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |
| API | OMDB API (free tier) |

## 📁 Project Structure

```
movie-search-app/
├── backend/
│   ├── package.json
│   ├── server.js          # Express server
│   ├── database.js         # SQLite setup & schema
│   └── routes/
│       └── movies.js       # API routes
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       └── components/
│           ├── Navbar.jsx / .css
│           ├── SearchBar.jsx / .css
│           ├── MovieCard.jsx / .css
│           ├── MovieDetail.jsx / .css
│           ├── Favorites.jsx / .css
├── README.md
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (uses built-in `fetch`)
- **npm** or **bun**

### 1. Install Backend Dependencies

```bash
cd backend
npm install
# or: bun install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
# or: bun install
```

### 3. Start the Backend (port 3003)

```bash
cd backend
npm start
# or: npm run dev  (auto-restart on changes)
```

### 4. Start the Frontend (port 5173)

In a new terminal:

```bash
cd frontend
npm run dev
```

### 5. Open in Browser

Visit **http://localhost:5173**

The Vite dev server proxies `/api` requests to the backend on port 3003.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=query&page=1` | Search movies (OMDB proxy + cache) |
| GET | `/api/movie/:imdbID` | Get movie details by IMDB ID |
| GET | `/api/favorites` | Get all favorites |
| POST | `/api/favorites` | Add to favorites |
| DELETE | `/api/favorites/:imdbID` | Remove from favorites |
| GET | `/api/history` | Get recent search history |

### Example API Usage

```bash
# Search for Batman
curl http://localhost:3003/api/search?q=batman

# Get movie details
curl http://localhost:3003/api/movie/tt0372784

# Add favorite
curl -X POST http://localhost:3003/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"imdbID":"tt0372784","title":"Batman Begins","year":"2005","poster":"...","type":"movie"}'

# Get favorites
curl http://localhost:3003/api/favorites
```

## 💾 Database

SQLite database is stored at `backend/data/movies.db`. Tables:

- **cached_movies** — Cached OMDB results (24-hour TTL)
- **favorites** — User's saved movies
- **search_history** — Recent search queries

To reset the database, simply delete the `backend/data/` folder and restart the server.

## 🎨 Design

- **Dark theme** inspired by IMDB
- **Color scheme**: `#0f0f1a` (bg), `#16213e` (cards), `#f5c518` (accent)
- **Font**: Inter (Google Fonts)
- **Responsive grid**: 2 → 3 → 4 columns

## 📝 Notes

- Uses the OMDB API free demo key (`apikey=trilogy`) — 1000 requests/day limit
- Cached results are served from local SQLite for faster repeat access
- The database is created automatically on first run