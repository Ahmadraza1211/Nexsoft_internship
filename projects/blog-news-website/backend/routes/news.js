const express = require('express');
const db = require('../database');

const router = express.Router();

// GET /api/news - Get all news with pagination
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const offset = (page - 1) * limit;

    const articles = db
      .prepare(
        `SELECT id, title, description, link, image_url, source, category, published_at, created_at
         FROM articles
         ORDER BY COALESCE(published_at, created_at) DESC
         LIMIT ? OFFSET ?`
      )
      .all(limit, offset);

    const { count } = db.prepare('SELECT COUNT(*) as count FROM articles').get();

    res.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch news' });
  }
});

// GET /api/news/:id - Get single news article
router.get('/:id', (req, res) => {
  try {
    const article = db
      .prepare('SELECT * FROM articles WHERE id = ?')
      .get(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }

    res.json({ success: true, data: article });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch article' });
  }
});

// GET /api/news/search?q=query - Search news
router.get('/search', (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const offset = (page - 1) * limit;
    const searchTerm = `%${query.trim()}%`;

    const articles = db
      .prepare(
        `SELECT id, title, description, link, image_url, source, category, published_at, created_at
         FROM articles
         WHERE title LIKE ? OR description LIKE ? OR content LIKE ?
         ORDER BY COALESCE(published_at, created_at) DESC
         LIMIT ? OFFSET ?`
      )
      .all(searchTerm, searchTerm, searchTerm, limit, offset);

    const { count } = db
      .prepare(
        `SELECT COUNT(*) as count FROM articles
         WHERE title LIKE ? OR description LIKE ? OR content LIKE ?`
      )
      .get(searchTerm, searchTerm, searchTerm);

    res.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error searching news:', error);
    res.status(500).json({ success: false, error: 'Failed to search news' });
  }
});

// GET /api/news/category/:category - Filter by category
router.get('/category/:category', (req, res) => {
  try {
    const category = req.params.category;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const offset = (page - 1) * limit;

    const articles = db
      .prepare(
        `SELECT id, title, description, link, image_url, source, category, published_at, created_at
         FROM articles
         WHERE category = ?
         ORDER BY COALESCE(published_at, created_at) DESC
         LIMIT ? OFFSET ?`
      )
      .all(category, limit, offset);

    const { count } = db
      .prepare('SELECT COUNT(*) as count FROM articles WHERE category = ?')
      .get(category);

    res.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch category' });
  }
});

// POST /api/news/fetch - Manually trigger RSS fetch
router.post('/fetch', async (req, res) => {
  try {
    const { fetchNews } = require('../server');
    await fetchNews();
    res.json({ success: true, message: 'News fetched successfully' });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch news' });
  }
});

module.exports = router;