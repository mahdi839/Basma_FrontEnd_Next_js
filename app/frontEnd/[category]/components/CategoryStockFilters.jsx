"use client";

import React, { useState } from "react";
import Image from "next/image";

/**
 * Colour and size availability filters. Only rendered for stock categories,
 * because they are the only ones with real numbers behind them.
 */
export default function CategoryStockFilters({
  sizes = [],
  colors = [],
  selectedSizes = [],
  selectedColors = [],
  inStockOnly = false,
  onToggleSize,
  onToggleColor,
  onToggleInStock,
  onClear,
  loading = false,
  resultCount,
}) {
  const [open, setOpen] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  const activeCount =
    selectedSizes.length + selectedColors.length + (inStockOnly ? 1 : 0);

  if (sizes.length === 0 && colors.length === 0) return null;

  return (
    <div className="cat-filters">
      <div className="cat-filters-bar">
        <button
          className={`cat-filters-toggle ${open ? "open" : ""}`}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          <span className="cat-filters-icon">☰</span>
          Filter
          {activeCount > 0 && (
            <span className="cat-filters-count">{activeCount}</span>
          )}
        </button>

        <button
          className={`cat-chip ${inStockOnly ? "active" : ""}`}
          onClick={onToggleInStock}
        >
          In stock only
        </button>

        {activeCount > 0 && (
          <button className="cat-filters-clear" onClick={onClear}>
            Clear all
          </button>
        )}

        <span className="cat-filters-result">
          {loading
            ? "Updating…"
            : typeof resultCount === "number"
            ? `${resultCount} product${resultCount === 1 ? "" : "s"}`
            : ""}
        </span>
      </div>

      <div className={`cat-filters-panel ${open ? "open" : ""}`}>
        {colors.length > 0 && (
          <div className="cat-filter-group">
            <div className="cat-filter-label">Colour</div>
            <div className="cat-swatch-row">
              {colors.map((color) => {
                const active = selectedColors.includes(color.name);
                const soldOut = color.available <= 0;

                return (
                  <button
                    key={color.name}
                    className={`cat-swatch ${active ? "active" : ""} ${soldOut ? "sold-out" : ""}`}
                    onClick={() => onToggleColor(color.name)}
                    title={
                      soldOut
                        ? `${color.name} — sold out`
                        : `${color.name} — ${color.available} available`
                    }
                  >
                    {color.image ? (
                      <Image
                        src={`${baseUrl}${color.image}`}
                        alt={color.name}
                        width={34}
                        height={34}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <span
                        className="cat-swatch-solid"
                        style={{ background: color.code || "#ddd" }}
                      />
                    )}
                    <span className="cat-swatch-name">{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {sizes.length > 0 && (
          <div className="cat-filter-group">
            <div className="cat-filter-label">Size</div>
            <div className="cat-chip-row">
              {sizes.map((size) => {
                const active = selectedSizes.includes(size.id);
                const soldOut = size.available <= 0;

                return (
                  <button
                    key={size.id}
                    className={`cat-chip ${active ? "active" : ""} ${soldOut ? "sold-out" : ""}`}
                    onClick={() => onToggleSize(size.id)}
                    title={soldOut ? "Sold out" : `${size.available} available`}
                  >
                    {size.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .cat-filters {
          margin: 6px 0 18px;
          border-bottom: 1px solid #eaecf0;
          padding-bottom: 14px;
        }
        .cat-filters-bar {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }
        .cat-filters-toggle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          border: 1.5px solid #111;
          background: #fff;
          border-radius: 3px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .cat-filters-toggle:hover,
        .cat-filters-toggle.open {
          background: #111;
          color: #fff;
        }
        .cat-filters-icon {
          font-size: 12px;
          line-height: 1;
        }
        .cat-filters-count {
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          border-radius: 999px;
          background: var(--primary-color, #7d0ba7);
          color: #fff;
          font-size: 9.5px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .cat-filters-clear {
          border: none;
          background: none;
          font-size: 11.5px;
          font-weight: 700;
          color: #b42318;
          text-decoration: underline;
          cursor: pointer;
          padding: 0 4px;
        }
        .cat-filters-result {
          margin-left: auto;
          font-size: 12px;
          color: #98a2b3;
          font-weight: 600;
        }

        .cat-filters-panel {
          display: grid;
          grid-template-rows: 0fr;
          overflow: hidden;
          transition: grid-template-rows 0.24s ease;
        }
        .cat-filters-panel.open {
          grid-template-rows: 1fr;
        }
        .cat-filters-panel > .cat-filter-group:first-child {
          margin-top: 16px;
        }
        .cat-filter-group {
          min-height: 0;
          margin-bottom: 14px;
        }
        .cat-filter-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #98a2b3;
          margin-bottom: 9px;
        }

        .cat-chip-row,
        .cat-swatch-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .cat-chip {
          min-width: 44px;
          padding: 8px 14px;
          border: 1.5px solid #d7dbe2;
          background: #fff;
          border-radius: 3px;
          font-size: 12px;
          font-weight: 700;
          color: #344054;
          cursor: pointer;
          transition: all 0.16s ease;
        }
        .cat-chip:hover {
          border-color: #111;
        }
        .cat-chip.active {
          background: #111;
          border-color: #111;
          color: #fff;
        }
        .cat-chip.sold-out {
          opacity: 0.4;
          text-decoration: line-through;
        }

        .cat-swatch {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 12px 5px 5px;
          border: 1.5px solid #d7dbe2;
          background: #fff;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.16s ease;
        }
        .cat-swatch:hover {
          border-color: #111;
        }
        .cat-swatch.active {
          border-color: #111;
          box-shadow: inset 0 0 0 1px #111;
        }
        .cat-swatch.sold-out {
          opacity: 0.42;
        }
        .cat-swatch :global(img),
        .cat-swatch-solid {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: inline-block;
          border: 1px solid rgba(16, 24, 40, 0.12);
        }
        .cat-swatch-name {
          font-size: 11.5px;
          font-weight: 700;
          color: #344054;
        }

        @media (max-width: 575.98px) {
          .cat-filters-result {
            margin-left: 0;
            width: 100%;
          }
          .cat-swatch-name {
            display: none;
          }
          .cat-swatch {
            padding: 5px;
          }
        }
      `}</style>
    </div>
  );
}
