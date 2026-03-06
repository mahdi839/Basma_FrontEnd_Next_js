"use client";
import AccordionSection from "./AccordionSection";
import CategoryFilter from "./CategoryFilter";
import SizeFilter from "./SizeFilter";
import PriceFilter from "./PriceFilter";

function FilterPanel({
  activeCount,
  clearFilters,
  searchInput,
  setSearchInput,
  filters,
  filterOptions,
  toggleCategory,
  toggleSize,
  priceInput,
  setPriceInput,
}) {
  return (
    <div className="spf-panel">
      <div className="spf-panel-header">
        <span className="spf-panel-title">Filters</span>
        {activeCount > 0 && (
          <button className="spf-clear-all" onClick={clearFilters}>
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <AccordionSection title="Search" defaultOpen>
        <div className="spf-search-wrap">
          <svg className="spf-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="spf-search-input"
            placeholder="Search products…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button className="spf-search-clear" onClick={() => setSearchInput("")}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        {searchInput.length > 0 && searchInput.length < 3 && (
          <p className="spf-hint">Type at least 3 characters</p>
        )}
      </AccordionSection>

      <AccordionSection title="Category" count={filters.categories.length} defaultOpen>
        <CategoryFilter
          categories={filterOptions.categories}
          selected={filters.categories}
          onChange={toggleCategory}
        />
      </AccordionSection>

      <AccordionSection title="Size" count={filters.sizes.length} defaultOpen={false}>
        <SizeFilter sizes={filterOptions.sizes} selected={filters.sizes} onChange={toggleSize} />
      </AccordionSection>

      <AccordionSection title="Price" defaultOpen={false}>
        <PriceFilter
          priceInput={priceInput}
          onChange={(min, max) => setPriceInput({ min, max })}
          priceRange={filterOptions.price_range}
        />
      </AccordionSection>
    </div>
  );
}

export default FilterPanel;