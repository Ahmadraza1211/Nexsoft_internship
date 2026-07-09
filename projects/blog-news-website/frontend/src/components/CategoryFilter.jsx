import { useEffect, useRef } from 'react';

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  const defaultCategories = ['World', 'Business', 'Technology', 'Sports', 'Health'];
  const allCategories = ['All', ...new Set([...defaultCategories, ...categories])];
  const scrollRef = useRef(null);

  // Auto-scroll to active category on mobile
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('.category-pill.active');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeCategory]);

  return (
    <div className="category-filter" ref={scrollRef}>
      {allCategories.map((cat) => (
        <button
          key={cat}
          className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
          onClick={() => onCategoryChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}