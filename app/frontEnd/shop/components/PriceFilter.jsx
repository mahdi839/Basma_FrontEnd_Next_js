"use client";
import { useState, useEffect, useRef } from "react";

function PriceFilter({ priceInput, onChange, priceRange }) {
  // Local state so typing never triggers parent re-render / focus loss
  const [localMin, setLocalMin] = useState(priceInput.min);
  const [localMax, setLocalMax] = useState(priceInput.max);
  const debounceRef = useRef(null);

  // Sync if parent resets (e.g. clearFilters)
  useEffect(() => {
    setLocalMin(priceInput.min);
    setLocalMax(priceInput.max);
  }, [priceInput.min, priceInput.max]);

  const scheduleCommit = (min, max) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(min, max);
    }, 2000);
  };

  const handleMinChange = (e) => {
    const val = e.target.value;
    setLocalMin(val);
    scheduleCommit(val, localMax);
  };

  const handleMaxChange = (e) => {
    const val = e.target.value;
    setLocalMax(val);
    scheduleCommit(localMin, val);
  };

  // Also commit immediately on blur so leaving the field always applies
  const handleBlur = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onChange(localMin, localMax);
  };

  return (
    <div className="spf-price-wrap">
      <div className="spf-price-row">
        <div className="spf-price-field">
          <label className="spf-price-label">Min</label>
          <div className="spf-price-input-wrap">
            <span className="spf-currency">৳</span>
            <input
              type="number"
              className="spf-price-input"
              value={localMin}
              min={priceRange.min}
              max={priceRange.max}
              onChange={handleMinChange}
              onBlur={handleBlur}
              placeholder={priceRange.min}
            />
          </div>
        </div>
        <div className="spf-price-divider">–</div>
        <div className="spf-price-field">
          <label className="spf-price-label">Max</label>
          <div className="spf-price-input-wrap">
            <span className="spf-currency">৳</span>
            <input
              type="number"
              className="spf-price-input"
              value={localMax}
              min={priceRange.min}
              max={priceRange.max}
              onChange={handleMaxChange}
              onBlur={handleBlur}
              placeholder={priceRange.max}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceFilter;