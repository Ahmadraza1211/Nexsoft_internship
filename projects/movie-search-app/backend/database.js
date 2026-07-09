const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'movies.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS cached_movies (
    imdbID TEXT PRIMARY KEY,
    title TEXT,
    year TEXT,
    poster TEXT,
    type TEXT,
    rated TEXT,
    released TEXT,
    runtime TEXT,
    genre TEXT,
    director TEXT,
    actors TEXT,
    plot TEXT,
    language TEXT,
    country TEXT,
    awards TEXT,
    imdbRating TEXT,
    boxOffice TEXT,
    response TEXT,
    cached_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS favorites (
    imdbID TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    year TEXT,
    poster TEXT,
    type TEXT,
    added_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT NOT NULL,
    results_count INTEGER DEFAULT 0,
    searched_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
`);

// Create indexes
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_cached_movies_cached_at ON cached_movies(cached_at);
  CREATE INDEX IF NOT EXISTS idx_search_history_searched_at ON search_history(searched_at);
`);

module.exports = db;