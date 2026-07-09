import './NewsCard.css';

export default function NewsCard({ article, formatDate }) {
  const { title, description, link, image_url, source, category, published_at } = article;

  return (
    <article className="news-card">
      <a href={link} target="_blank" rel="noopener noreferrer" className="news-card-link">
        {image_url ? (
          <div className="news-card-image">
            <img src={image_url} alt={title} loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        ) : (
          <div className="news-card-image news-card-image-placeholder">
            <span>📰</span>
          </div>
        )}

        <div className="news-card-body">
          {category && (
            <span className="news-card-category">{category}</span>
          )}
          <h3 className="news-card-title">{title}</h3>
          {description && (
            <p className="news-card-description">{description}</p>
          )}
          <div className="news-card-meta">
            <span className="news-card-source">{source}</span>
            {published_at && (
              <>
                <span className="news-card-sep">·</span>
                <span className="news-card-date">{formatDate(published_at)}</span>
              </>
            )}
          </div>
          <span className="news-card-read-more">Read More →</span>
        </div>
      </a>
    </article>
  );
}