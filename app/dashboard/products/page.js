"use client";

import { useEffect, useState } from "react";
import ProductTable from "./components/ProductTable";
import Link from "next/link";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "../orders/components/Pagination";

export default function ProductIndexPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- State ---
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [productData, setProductData] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // --- Build API URL ---
  const buildUrl = () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (page) params.append("page", page);
    return `${baseUrl}api/products?${params.toString()}`;
  };

  // --- Fetch Products ---
  const fetchProducts = async () => {
    setLoading(true);
    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");

    try {
      const response = await axios.get(buildUrl(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Paginated data from Laravel
      setProductData(response.data.data.data || []);
      setPagination({
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
      });
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Update URL query without reloading ---
  const updateURL = () => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    if (page) query.set("page", page);
    router.push(`/dashboard/products?${query.toString()}`);
  };

  // --- Effects ---
  useEffect(() => {
    fetchProducts();
    updateURL();
  }, [page, status]);

  // --- Debounce search ---
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1); // Reset page when search changes
      fetchProducts();
      updateURL();
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 fw-bold text-gray-800">Products</h1>
          <p className="text-muted mb-0">Manage your product catalog</p>
        </div>
        <Link href="/dashboard/products/add_product">
          <button className="btn btn-primary px-4 py-2 fw-semibold">
            <i className="fas fa-plus me-2"></i>
            Add Product
          </button>
        </Link>
      </div>

      {/* SEARCH + STATUS */}
      <div className="d-flex gap-2 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by product name or SKU"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="in-stock">In Stock</option>
          <option value="prebook">Prebook</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {/* Product Table */}
      <ProductTable productData={productData} loading={loading} />

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <Pagination page={page} setPage={setPage} pagination={pagination} />
      )}
    </div>
  );
}
