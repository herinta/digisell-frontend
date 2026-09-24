import React from 'react';

export default function CategoryFilter({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="category-bar">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
