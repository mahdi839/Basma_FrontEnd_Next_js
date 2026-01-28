"use client";

import React, { useEffect, useState } from "react";
import CategoryTable from "./components/CategoryTable";
import Button from "@/app/components/dashboard/components/button/Button";
import Link from "next/link";
import PageLoader from "@/app/components/loader/pageLoader";
import Pagination from "../orders/components/Pagination"; // reuse same component

export default function Page() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    setError("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await fetch(`${baseUrl}api/categories?page=${page}`, {
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
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  if (loading) return <PageLoader />;

  return (
    <div className="container-fluid my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Categories</h1>
        <Link href="/dashboard/category/add">
          <Button>Add Category</Button>
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {!error && (
        <>
          <CategoryTable categories={categories} />

          {pagination.last_page > 1 && (
            <Pagination
              page={page}
              setPage={setPage}
              pagination={pagination}
            />
          )}
        </>
      )}
    </div>
  );
}
