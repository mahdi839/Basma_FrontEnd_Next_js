"use client";

import React, { useEffect, useState, useCallback } from "react";
import InventoryTable from "./components/InventoryTable";
import Button from "@/app/components/dashboard/components/button/Button";
import Link from "next/link";

export default function Page() {
  const [stocks, setStocks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const url = `${baseUrl}api/inventory-management`;
      // 🧠 Get token from localStorage
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }
      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) throw new Error(`Failed to load: ${res.status}`);

      const data = await res.json();
      setStocks(data || { data: [] });
    } catch (err) {
      setError(err.message || "Error loading inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);


  return (
    <div className="container-fluid my-5">
      <Link href="/dashboard/inventory/add">
        <Button className="mb-3">Add  Stock</Button>
      </Link>

      {loading && <p className="text-center">Loading...</p>}
      {!loading && error && <p className="text-center text-danger">{error}</p>}
      {!loading && !error && (
        <InventoryTable stocks={stocks || { data: [] }} />
      )}
    </div>
  );
}
