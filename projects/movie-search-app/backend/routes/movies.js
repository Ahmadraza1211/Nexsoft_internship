const express = require('express');
const router = express.Router();
const db = require('../database');

const OMDB_API = 'https://www.omdbapi.com/';
const API_KEY = 'trilogy';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in ms

// Helper: fetch from OMDB
async function fetchFromOmdb(params) {
  const url = new URL(OMDB_API);
  url.searchParams.set('apikey', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  const data = await res.json();
  return data;
}

// Helper: check if cache is fresh
function isCacheFresh(cachedAt) {
  return (Date.now() - cachedAt) < CACHE_TTL;
}

// GET /api/search?q=movie_name&page=1
router.get('/search', async (req, res) => {
  try {
    const { q, page = '1' } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const trimmedQuery = q.trim();

    // Fetch from OMDB (search results are not cached individually — we cache movie details)
    const data = await fetchFromOmdb({ s: trimmedQuery, page });

    if (data.Response === 'False') {
      // Record search history even for no results
      const insertHistory = db.prepare(
        'INSERT INTO search_history (query, results_count) VALUES (?, 0)'
      );
      insertHistory.run(trimmedQuery);

      return res.json({ Search: [], totalResults: '0', Response: 'False' });
    }

    const results = data.Search || [];

    // Cache each movie from search results
    const upsert = db.prepare(`
      INSERT INTO cached_movies (imdbID, title, year, poster, type, cached_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(imdbID) DO UPDATE SET
        title = excluded.title,
        year = excluded.year,
        poster = excluded.poster,
        type = excluded.type,
        cached_at = excluded.cached_at
    `);

    const cacheMovies = db.transaction((movies) => {
      for (const movie of movies) {
        upsert.run(movie.imdbID, movie.Title, movie.Year, movie.Poster, movie.Type, Date.now());
      }
    });
    cacheMovies(results);

    // Record search history
    const insertHistory = db.prepare(
      'INSERT INTO search_history (query, results_count) VALUES (?, ?)'
    );
    insertHistory.run(trimmedQuery, results.length);

    res.json({
      Search: results.map(m => ({
        imdbID: m.imdbID,
        Title: m.Title,
        Year: m.Year,
        Poster: m.Poster,
        Type: m.Type
      })),
      totalResults: data.totalResults,
      Response: data.Response
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

// GET /api/movie/:imdbID
router.get('/movie/:imdbID', async (req, res) => {
  try {
    const { imdbID } = req.params;

    // Check cache first
    const cached = db.prepare('SELECT * FROM cached_movies WHERE imdbID = ?').get(imdbID);

    if (cached && isCacheFresh(cached.cached_at)) {
      // Check if we have full details (plot, director, etc.)
      if (cached.plot && cached.director) {
        return res.json({
          imdbID: cached.imdbID,
          Title: cached.title,
          Year: cached.year,
          Poster: cached.poster,
          Type: cached.type,
          Rated: cached.rated,
          Released: cached.released,
          Runtime: cached.runtime,
          Genre: cached.genre,
          Director: cached.director,
          Actors: cached.actors,
          Plot: cached.plot,
          Language: cached.language,
          Country: cached.country,
          Awards: cached.awards,
          imdbRating: cached.imdbRating,
          BoxOffice: cached.boxOffice,
          Response: cached.response,
          fromCache: true
        });
      }
    }

    // Fetch from OMDB
    const data = await fetchFromOmdb({ i: imdbID, plot: 'full' });

    if (data.Response === 'False') {
      return res.status(404).json({ error: data.Error || 'Movie not found' });
    }

    // Cache full details
    const upsert = db.prepare(`
      INSERT INTO cached_movies (
        imdbID, title, year, poster, type, rated, released, runtime,
        genre, director, actors, plot, language, country, awards,
        imdbRating, boxOffice, response, cached_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(imdbID) DO UPDATE SET
        title = excluded.title,
        year = excluded.year,
        poster = excluded.poster,
        type = excluded.type,
        rated = excluded.rated,
        released = excluded.released,
        runtime = excluded.runtime,
        genre = excluded.genre,
        director = excluded.director,
        actors = excluded.actors,
        plot = excluded.plot,
        language = excluded.language,
        country = excluded.country,
        awards = excluded.awards,
        imdbRating = excluded.imdbRating,
        boxOffice = excluded.boxOffice,
        response = excluded.response,
        cached_at = excluded.cached_at
    `);

    upsert.run(
      data.imdbID, data.Title, data.Year, data.Poster, data.Type,
      data.Rated, data.Released, data.Runtime, data.Genre, data.Director,
      data.Actors, data.Plot, data.Language, data.Country, data.Awards,
      data.imdbRating, data.BoxOffice, data.Response, Date.now()
    );

    res.json({ ...data, fromCache: false });
  } catch (err) {
    console.error('Movie detail error:', err);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// GET /api/favorites
router.get('/favorites', (req, res) => {
  try {
    const favorites = db.prepare(
      'SELECT * FROM favorites ORDER BY added_at DESC'
    ).all();
    res.json(favorites);
  } catch (err) {
    console.error('Get favorites error:', err);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

// POST /api/favorites
router.post('/favorites', (req, res) => {
  try {
    const { imdbID, title, poster, year, type } = req.body;

    if (!imdbID || !title) {
      return res.status(400).json({ error: 'imdbID and title are required' });
    }

    const insert = db.prepare(`
      INSERT INTO favorites (imdbID, title, year, poster, type, added_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(imdbID) DO NOTHING
    `);

    const result = insert.run(imdbID, title, year, poster, type, Date.now());

    if (result.changes === 0) {
      return res.status(409).json({ error: 'Movie already in favorites' });
    }

    res.status(201).json({ message: 'Added to favorites', imdbID });
  } catch (err) {
    console.error('Add favorite error:', err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// DELETE /api/favorites/:imdbID
router.delete('/favorites/:imdbID', (req, res) => {
  try {
    const { imdbID } = req.params;
    const del = db.prepare('DELETE FROM favorites WHERE imdbID = ?');
    const result = del.run(imdbID);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites', imdbID });
  } catch (err) {
    console.error('Remove favorite error:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// GET /api/history
router.get('/history', (req, res) => {
  try {
    const history = db.prepare(`
      SELECT query, results_count, searched_at
      FROM search_history
      GROUP BY query
      ORDER BY searched_at DESC
      LIMIT 20
    `).all();

    res.json(history);
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({ error: 'Failed to get search history' });
  }
});

module.exports = router;