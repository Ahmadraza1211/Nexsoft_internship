const db = require('./database');
const cheerio = require('cheerio');

async function fetchImageFromUrl(url) {
  if (!url) return null;
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: { 'User-Agent': 'DailyNews/1.0 (RSS News Aggregator)' }
    });
    if (!response.ok) return null;
    const html = await response.text();
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

async function run() {
  const articles = db.prepare('SELECT id, link FROM articles WHERE image_url IS NULL').all();
  console.log(`Found ${articles.length} articles without images.`);
  
  const updateStmt = db.prepare('UPDATE articles SET image_url = ? WHERE id = ?');
  let updatedCount = 0;
  
  const BATCH_SIZE = 10;
  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (article) => {
      const imgUrl = await fetchImageFromUrl(article.link);
      if (imgUrl) {
        updateStmt.run(imgUrl, article.id);
        updatedCount++;
      }
    }));
    console.log(`Processed batch ${i / BATCH_SIZE + 1}. Total updated so far: ${updatedCount}`);
  }
  
  console.log(`Finished updating images. Successfully found images for ${updatedCount} articles.`);
}

run().catch(console.error);
