"use client";

import React, { useEffect, useState } from "react";
import CategoryTable from "./components/CategoryTable";
import Link from "next/link";
import PageLoader from "@/app/components/loader/pageLoader";
import Pagination from "../orders/components/Pagination";
import { FaSearch } from "react-icons/fa";

export default function Page() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const url = searchQuery
        ? `${baseUrl}api/categories?page=${page}&search=${encodeURIComponent(searchQuery)}`
        : `${baseUrl}api/categories?page=${page}`;

      const res = await fetch(url, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load categories");

      const data = await res.json();

      setCategories(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery !== "") {
        setPage(1); // Reset to first page on new search
        setIsSearching(true);
        fetchCategories();
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(1);
    setIsSearching(true);
    setTimeout(() => {
      fetchCategories();
    }, 0);
  };

  if (loading && !isSearching) return <PageLoader />;

  return (
    <div className="container-fluid my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Categories</h1>
        <Link href="/dashboard/category/add">
          <button className="btn btn-success btn-md">
            <i className="fas fa-plus me-2"></i>
            Add Category
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search categories by name..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
                {searchQuery && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleClearSearch}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              <small className="text-muted">
                {isSearching && <i className="fas fa-spinner fa-spin me-1"></i>}
                {searchQuery && !isSearching && (
                  <span>
                    Showing results for "<strong>{searchQuery}</strong>"
                  </span>
                )}
              </small>
            </div>
            <div className="col-md-4 text-end">
              <div className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Total: <strong>{categories.length}</strong> categories
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!error && (
        <>
          {isSearching ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Searching...</span>
              </div>
              <p className="mt-3 text-muted">Searching categories...</p>
            </div>
          ) : (
            <>
              {searchQuery && categories.length === 0 ? (
                <div className="alert alert-warning text-center">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  No categories found matching "<strong>{searchQuery}</strong>"
                  <button
                    className="btn btn-link"
                    onClick={handleClearSearch}
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <CategoryTable categories={categories} />
              )}

              {pagination.last_page > 1 && (
                <Pagination
                  page={page}
                  setPage={setPage}
                  pagination={pagination}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}