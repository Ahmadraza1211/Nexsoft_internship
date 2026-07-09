const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./database');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve images statically
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
app.use('/images', express.static(imagesDir));

// RSS feed sources
const RSS_FEEDS = [
  {
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    source: 'BBC News',
    category: 'World',
  },
  {
    url: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
    source: 'BBC News',
    category: 'Technology',
  },
  {
    url: 'https://feeds.bbci.co.uk/news/business/rss.xml',
    source: 'BBC News',
    category: 'Business',
  },
  {
    url: 'https://feeds.bbci.co.uk/sport/rss.xml',
    source: 'BBC Sport',
    category: 'Sports',
  },
  {
    url: 'https://feeds.bbci.co.uk/news/health/rss.xml',
    source: 'BBC News',
    category: 'Health',
  },
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    source: 'NY Times',
    category: 'World',
  },
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
    source: 'NY Times',
    category: 'Technology',
  },
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
    source: 'NY Times',
    category: 'Business',
  },
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml',
    source: 'NY Times',
    category: 'Health',
  },
];

// Helper: extract image from RSS item
function extractImage(item) {
  // Try various common RSS image fields
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image')) {
    return item.enclosure.url;
  }
  if (item['media:content']?.$.url) {
    return item['media:content'].$.url;
  }
  if (item['media:thumbnail']?.$.url) {
    return item['media:thumbnail'].$.url;
  }
  // Try to extract from content/summary HTML
  const html = item['content:encoded'] || item.content || item.summary || item.description || '';
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) {
    return imgMatch[1];
  }
  return null;
}

// Helper: strip HTML tags from text
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

// Helper: fetch missing images from the article's actual URL using axios
async function fetchImageFromUrl(url) {
  if (!url) return null;
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: { 'User-Agent': 'DailyNews/1.0 (RSS News Aggregator)' }
    });
    const html = response.data;
    const $ = cheerio.load(html);
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) return ogImage;
    const twitterImage = $('meta[name="twitter:image"]').attr('content');
    if (twitterImage) return twitterImage;
    const firstImg = $('article img').attr('src') || $('main img').attr('src');
    if (firstImg) {
      if (firstImg.startsWith('http')) return firstImg;
      const urlObj = new URL(url);
      return urlObj.origin + (firstImg.startsWith('/') ? '' : '/') + firstImg;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Helper: download image binary and save locally
async function downloadImage(imageUrl) {
  if (!imageUrl) return null;
  try {
    const hash = crypto.createHash('md5').update(imageUrl).digest('hex');
    // Extract extension from URL, default to .jpg
    let ext = '.jpg';
    try {
      const parsed = new URL(imageUrl);
      const extMatch = parsed.pathname.match(/\.(jpg|jpeg|png|webp|gif)$/i);
      if (extMatch) ext = extMatch[0];
    } catch (e) {}
    
    const filename = `${hash}${ext}`;
    const filepath = path.join(__dirname, 'public', 'images', filename);
    
    // If it already exists, return local path
    if (fs.existsSync(filepath)) {
      return `/images/${filename}`;
    }

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 5000,
      headers: { 'User-Agent': 'DailyNews/1.0' }
    });
    
    fs.writeFileSync(filepath, response.data);
    return `/images/${filename}`;
  } catch (error) {
    return null;
  }
}

// Fetch and store news from all RSS feeds
async function fetchNews() {
  const imagesDir = path.join(__dirname, 'public', 'images');
  // Clear images dir to free space when we fetch data again
  if (fs.existsSync(imagesDir)) {
    fs.rmSync(imagesDir, { recursive: true, force: true });
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const parser = new Parser({
    timeout: 15000,
    headers: {
      'User-Agent': 'DailyNews/1.0 (RSS News Aggregator)',
    },
  });

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO articles (id, title, description, content, link, image_url, source, category, published_at, created_at)
    VALUES (
      (SELECT id FROM articles WHERE link = @link),
      @title, @description, @content, @link, @image_url, @source, @category, @published_at,
      COALESCE((SELECT created_at FROM articles WHERE link = @link), datetime('now'))
    )
  `);

  let totalNew = 0;

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`Fetching: ${feed.source} - ${feed.category} (${feed.url})`);
      const result = await parser.parseURL(feed.url);

      // Process items in batches concurrently
      const BATCH_SIZE = 5;
      for (let i = 0; i < result.items.length; i += BATCH_SIZE) {
        const batch = result.items.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (item) => {
          const description = stripHtml(item.contentSnippet || item.summary || item.description || '');
          const content = stripHtml(item['content:encoded'] || item.content || item.description || '');

          let externalImgUrl = extractImage(item);
          
          // Fallback to website metadata
          if (!externalImgUrl && item.link) {
            externalImgUrl = await fetchImageFromUrl(item.link);
          }

          let localImgUrl = null;
          if (externalImgUrl) {
            localImgUrl = await downloadImage(externalImgUrl);
          }

          const record = {
            title: stripHtml(item.title || 'Untitled'),
            description: description.length > 300 ? description.substring(0, 300) + '...' : description,
            content: content,
            link: item.link || '',
            image_url: localImgUrl,
            source: feed.source,
            category: feed.category,
            published_at: item.pubDate || item.isoDate || null,
          };

          try {
            const result = insertStmt.run(record);
            if (result.changes > 0) {
              totalNew++;
            }
          } catch (e) {
            // ignore db insert error
          }
        }));
      }

      console.log(`  → Got ${result.items.length} articles from ${feed.source} (${feed.category})`);
    } catch (error) {
      console.error(`  ✗ Failed to fetch ${feed.source} - ${feed.category}:`, error.message);
    }
  }

  console.log(`\nFetch complete. ${totalNew} items updated or added.`);
  return totalNew;
}

// Routes
app.get('/api/categories', (req, res) => {
  try {
    const categories = db
      .prepare(
        `SELECT category, COUNT(*) as count
         FROM articles
         WHERE category IS NOT NULL
         GROUP BY category
         ORDER BY count DESC`
      )
      .all();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// Note: /api/news/search and /api/news/category/:category routes are defined
// in the news router but GET /search must come before /:id to avoid conflicts.
// We handle them directly here.

// GET /api/news/search
app.get('/api/news/search', (req, res) => {
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

// GET /api/news/category/:category
app.get('/api/news/category/:category', (req, res) => {
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

// GET /api/news - Get all news with pagination
app.get('/api/news', (req, res) => {
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
    res.status(500).json({ success: false, error: 'Failed to fetch news: ' + error.message });
  }
});

// GET /api/news/:id - Get single article
app.get('/api/news/:id', (req, res) => {
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

// POST /api/news/fetch - Manually trigger RSS fetch
app.post('/api/news/fetch', async (req, res) => {
  try {
    const totalNew = await fetchNews();
    res.json({ success: true, message: `News fetched successfully. ${totalNew} new articles added.` });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch news' });
  }
});

// Start server
async function start() {
  // Fetch initial news on startup
  console.log('🚀 DailyNews API Server starting...');
  console.log('📡 Fetching initial news from RSS feeds...\n');
  await fetchNews();

  app.listen(PORT, () => {
    console.log(`\n✅ Server running on http://localhost:${PORT}`);
    console.log(`   API: http://localhost:${PORT}/api/news`);
    console.log(`\n🔄 Auto-refresh every 30 minutes`);
  });

  // Schedule periodic refresh every 30 minutes
  setInterval(async () => {
    console.log('\n🔄 Scheduled news refresh...');
    try {
      await fetchNews();
    } catch (error) {
      console.error('Scheduled fetch failed:', error.message);
    }
  }, 30 * 60 * 1000);
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Export for testing
module.exports = { app, fetchNews };
// Restart triggered