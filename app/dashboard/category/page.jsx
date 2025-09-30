"use client";

import React, { useEffect, useState, useCallback } from "react";
import CategoryTable from "./components/CategoryTable";
import Button from "@/app/components/dashboard/components/button/Button";
import Link from "next/link";

export default function Page() {
  const [categories, setCategories] = useState(null); // null = not loaded yet
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const url = `${baseUrl}api/categories`;

      const res = await fetch(url, {
        cache: "no-store", // prevent stale cache in client
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Failed to load categories: ${res.status}`);
      }

      const data = await res.json();
      setCategories(data || { data: [] });
    } catch (err) {
      setError(err.message || "Error loading categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="container-fluid my-5">
      <Link href="/dashboard/category/add">
        <Button className="mb-3">Add Category</Button>
      </Link>

      {loading && <p className="text-center">Loading...</p>}
      {!loading && error && (
        <p className="text-center text-danger">{error}</p>
      )}
      {!loading && !error && (
        // Pass the loaded categories into your client table
        <CategoryTable categories={categories || { data: [] }} />
      )}
    </div>
  );
}
