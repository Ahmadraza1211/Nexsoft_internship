# DailyNews — RSS News Aggregator

A clean, simple news aggregation website built with React (Vite) and Node.js (Express). Fetches news from BBC News and NY Times RSS feeds and stores them in SQLite.

## Features

- **RSS Feed Aggregation** — Automatically fetches news from 9+ RSS feeds on startup and every 30 minutes
- **Search** — Full-text search across article titles, descriptions, and content
- **Category Filtering** — Filter by World, Business, Technology, Sports, Health
- **Pagination** — Lazy-loading "Load More" for smooth browsing
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Manual Refresh** — Trigger a fresh RSS fetch with one click

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (no framework) |
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |
| RSS Parsing | rss-parser |

## Project Structure

```
blog-news-website/
├── backend/
│   ├── package.json
│   ├── server.js          # Express server + RSS fetcher
│   ├── database.js        # SQLite setup + schema
│   └── routes/
│       └── news.js        # API route module (referenced by server.js)
├── frontend/
│   ├── package.json
│   ├── vite.config.js     # Dev server with API proxy
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx         # Main app component
│       ├── App.css         # Global styles
│       └── components/
│           ├── Navbar.jsx
│           ├── NewsCard.jsx
│           ├── NewsCard.css
│           └── CategoryFilter.jsx
├── .gitignore
└── README.md
```

## Setup & Run

### Prerequisites

- Node.js 18+ installed
- npm (comes with Node.js)

### Backend Setup

```bash
cd backend
npm install
node server.js
```

The backend will:
1. Create an SQLite database at `db/news.db`
2. Fetch initial news from all RSS feeds
3. Start the API server on **http://localhost:3001**
4. Auto-refresh news every 30 minutes

### Frontend Setup (in another terminal)

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server starts on **http://localhost:5173** and proxies `/api` requests to the backend.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news` | Get all news (supports `?page=1&limit=10`) |
| GET | `/api/news/:id` | Get a single article by ID |
| GET | `/api/news/search?q=query` | Search news by title/description/content |
| GET | `/api/news/category/:category` | Filter news by category |
| GET | `/api/categories` | Get all categories with article counts |
| POST | `/api/news/fetch` | Manually trigger RSS feed refresh |

### Response Format

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 142,
    "totalPages": 15
  }
}
```

## RSS Sources

News is fetched from these free RSS feeds:

- **BBC News** — World, Technology, Business, Sports, Health
- **NY Times** — World, Technology, Business, Health

No API keys or paid services required.

## License

MIT