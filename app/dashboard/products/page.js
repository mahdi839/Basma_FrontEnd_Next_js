"use client";

import { useEffect, useState } from "react";
import ProductTable from "./components/ProductTable";
import Link from "next/link";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductIndexPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "";

  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [productData, setProductData] = useState([]);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // ----- Fetch products immediately -----
  useEffect(() => {
    fetchProducts();
  }, []); // initial load

  // ----- Fetch immediately when status changes -----
  useEffect(() => {
    fetchProducts();
    updateURL();
  }, [status]);

  // ----- Fetch with debounce when search changes -----
  useEffect(() => {
    if (search.length === 0) {
      fetchProducts(); // optional: fetch all if search cleared
      updateURL();
      return;
    }

    const delay = setTimeout(() => {
      fetchProducts();
      updateURL();
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  // Fetch products from Laravel API
  async function fetchProducts() {
    try {
      const response = await axios.get(
        `${baseUrl}api/products?search=${search}&status=${status}`
      );
      setProductData(response.data.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  }

  // Update URL query
  function updateURL() {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    router.push(`/dashboard/products?${query.toString()}`);
  }

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
          placeholder="Search product..."
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

      <ProductTable productData={productData} />
    </div>
  );
}
