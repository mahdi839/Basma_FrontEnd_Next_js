"use client";

import React from "react";

export default function ColorFilterSidebar({
  colors = [],
  selectedColors = [],
  inStockOnly = false,
  onToggleColor,
  onToggleInStock,
  onClear,
}) {
  const colorList = Array.isArray(colors) ? colors : Object.values(colors || {});
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const activeCount = selectedColors.length + (inStockOnly ? 1 : 0);

  if (colorList.length === 0) return null;

  return (
    <aside className="color-side">
      <div className="color-side-head">
        <span className="color-side-title">Colour</span>
        {activeCount > 0 && (
          <button type="button" className="color-side-clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      <button
        type="button"
        className={`color-side-stock ${inStockOnly ? "active" : ""}`}
        onClick={onToggleInStock}
      >
        In stock only
      </button>

      <div className="color-side-list">
        {colorList.map((color) => {
          const active = selectedColors.includes(color.name);
          const soldOut = color.available <= 0;
          const imageSrc = color.image
            ? color.image.startsWith("http")
              ? color.image
              : `${baseUrl}${color.image}`
            : null;

          return (
            <button
              key={color.name}
              type="button"
              className={`color-mini ${active ? "active" : ""} ${soldOut ? "sold-out" : ""}`}
              onClick={() => onToggleColor(color.name)}
              aria-pressed={active}
            >
              <span
                className="color-mini-swatch"
                style={imageSrc ? undefined : { background: color.code || "#d0d5dd" }}
              >
                {imageSrc && <img src={imageSrc} alt="" />}
              </span>
              <span className="color-mini-copy">
                <span className="color-mini-name">{color.name}</span>
                <span className="color-mini-meta">
                  {soldOut ? "Sold out" : `${color.available} available`}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .color-side {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 16px 14px;
          position: sticky;
          top: 80px;
        }
        .color-side-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .color-side-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #111;
        }
        .color-side-clear {
          border: none;
          background: none;
          padding: 0;
          font-size: 11px;
          font-weight: 700;
          color: #b42318;
          cursor: pointer;
        }
        .color-side-stock {
          width: 100%;
          margin-bottom: 12px;
          padding: 7px 10px;
          border: 1.5px solid #e8e8e8;
          border-radius: 4px;
          background: #fafafa;
          font-size: 12px;
          font-weight: 700;
          color: #555;
          cursor: pointer;
          text-align: left;
        }
        .color-side-stock.active {
          background: #111;
          border-color: #111;
          color: #fff;
        }
        .color-side-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }
        .color-mini {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          min-width: 0;
          padding: 8px;
          border: 1.5px solid #f0f0f0;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .color-mini:hover {
          border-color: #ccc;
        }
        .color-mini.active {
          border-color: #111;
          box-shadow: inset 0 0 0 1px #111;
        }
        .color-mini.sold-out {
          opacity: 0.48;
        }
        .color-mini-swatch {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(16, 24, 40, 0.08);
        }
        .color-mini-swatch :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .color-mini-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .color-mini-name {
          font-size: 13px;
          font-weight: 700;
          color: #111;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .color-mini-meta {
          font-size: 11px;
          font-weight: 600;
          color: #98a2b3;
        }
        .color-mini.sold-out .color-mini-meta {
          color: #b42318;
        }

        @media (max-width: 991.98px) {
          .color-side {
            position: static;
            padding: 12px;
            margin-bottom: 16px;
          }
        }
      `}</style>
    </aside>
  );
}
