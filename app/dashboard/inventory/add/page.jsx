"use client";

import Button from "@/app/components/dashboard/components/button/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DynamicLoader from "@/app/components/loader/dynamicLoader";

export default function Page() {
  const [stock, setStock] = useState({
    product_id: "",
    purchase_price: "",
    product_variant_id: "",
    stock: "",
  });
  const [products, setProducts] = useState([]); // all products for dropdown
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const router = useRouter();

  // 🧠 Fetch all products for dropdown
  async function fetchProducts() {
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await axios.get(`${base}api/products`); // your product list API
      setProducts(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products.");
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🧩 Store stock
  async function storeStock(e) {
    e.preventDefault();
    setLoading(true);

    const url =
      process.env.NEXT_PUBLIC_BACKEND_URL + "api/inventory-management";
    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");

    try {
      await axios.post(url, stock, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Stock successfully added/updated!");
      router.push("/dashboard/inventory");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectProduct(e) {
    const prodId = e.target.value;
    const prod = products.find((p) => p.id.toString() === prodId);
    setSelectedProduct(prod || null);
    setStock({ ...stock, product_id: prodId });
  }

  if (loadingProducts) return <DynamicLoader />;

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h4 className="text-center mb-4">Add / Update Stock</h4>

        <form onSubmit={storeStock}>
          {/* 🧾 Product Dropdown */}
          <div className="form-group mb-3">
            <label className="fw-bold">Select Product:</label>
            <select
              className="form-control"
              value={stock.product_id}
              onChange={(e) => handleSelectProduct(e)}
              required
            >
              <option value="">-- Select a Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* product variant */}
          {selectedProduct &&
            selectedProduct.variants &&
            selectedProduct.variants.length > 0 && (
              <div className="form-group mb-3">
                <label className="fw-bold">Select Product Variant:</label>
                <select
                  className="form-control"
                  value={stock.product_variant_id}
                  onChange={(e) =>
                    setStock({ ...stock, product_variant_id: e.target.value })
                  }
                  required
                >
                  <option value="">-- Select a Variant --</option>
                  {selectedProduct.variants.map((variant,index) => (
                    <option key={index} value={variant.id}>
                      {variant.value}
                    </option>
                  ))}
                </select>
              </div>
            )}

          {/* 💰 Purchase Price */}
          <div className="form-group mb-3">
            <label className="fw-bold">Purchase Price:</label>
            <input
              type="number"
              className="form-control"
              value={stock.purchase_price}
              onChange={(e) =>
                setStock({ ...stock, purchase_price: e.target.value })
              }
              required
            />
          </div>

          {/* 📦 Stock Quantity */}
          <div className="form-group mb-3">
            <label className="fw-bold">Stock Quantity:</label>
            <input
              type="number"
              className="form-control"
              value={stock.stock}
              onChange={(e) => setStock({ ...stock, stock: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="dashboard-btn w-100 mt-3"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add / Update Stock"}
          </button>
        </form>
      </div>
    </div>
  );
}
