"use client";
import { useState } from "react";

function CategoryFilter({ categories, selected, onChange }) {
  const [showAll, setShowAll] = useState(false);
  const SHOW = 8;
  const visible = showAll ? categories : categories.slice(0, SHOW);

  return (
    <div className="spf-category-list">
      {visible.map(cat => {
        const active = selected.includes(cat.id);
        return (
          <button
            key={cat.id}
            className={`spf-cat-item${active ? " active" : ""}`}
            onClick={() => onChange(cat.id)}
          >
            <span className="spf-cat-dot" />
            <span className="spf-cat-name">{cat.name}</span>
            {active && (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        );
      })}
      {categories.length > SHOW && (
        <button className="spf-show-more" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show less" : `+${categories.length - SHOW} more`}
        </button>
      )}
    </div>
  );
}

export default CategoryFilter;