// app/components/navbar/client/MobileSearchBar.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const MIN_QUERY_LEN = 3;

export default function MobileSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Debounced search — avoids firing on every keystroke
  useEffect(() => {
    if (query.length < MIN_QUERY_LEN) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}api/product-search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.data ?? []);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query, baseUrl]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="position-relative w-100">
      <div className="input-group shadow-sm w-100">
        <span className="input-group-text bg-white border-end-0">
          <i className="bi bi-search" aria-hidden="true" />
        </span>
        <input
          type="search"
          className="form-control border-start-0"
          placeholder="Search Products By Name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search products"
          autoComplete="off"
        />
      </div>

      {isOpen && (
        <ul
          className="list-group position-absolute w-100 shadow"
          style={{ top: "100%", zIndex: 1050, maxHeight: "300px", overflowY: "auto" }}
          role="listbox"
        >
          {loading && (
            <li className="list-group-item text-center text-muted py-3">
              <span className="spinner-border spinner-border-sm me-2" />
              Searching…
            </li>
          )}

          {!loading && results.length > 0 &&
            results.map((product) => (
              <li key={product.id} className="list-group-item p-0">
                <Link
                  href={`/frontEnd/product-page/${product.id}`}
                  className="d-flex align-items-center px-3 py-2 text-decoration-none text-dark"
                  onClick={() => setIsOpen(false)}
                >
                  <Image
                    src={baseUrl + product.images?.[0]?.image}
                    alt={product.title}
                    width={45}
                    height={45}
                    className="rounded me-3 object-fit-cover"
                    loading="lazy"
                  />
                  <div>
                    <strong className="d-block">{product.title}</strong>
                    {product.sizes?.length > 0 && (
                      <small className="text-muted">
                        Sizes: {product.sizes.map((s) => s.size).join(", ")}
                      </small>
                    )}
                  </div>
                </Link>
              </li>
            ))
          }

          {!loading && query.length >= MIN_QUERY_LEN && results.length === 0 && (
            <li className="list-group-item text-center text-muted">No products found</li>
          )}
        </ul>
      )}
    </div>
  );
}