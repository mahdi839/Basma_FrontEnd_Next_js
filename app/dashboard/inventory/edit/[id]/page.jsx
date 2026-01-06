"use client";

import Button from "@/app/components/dashboard/components/button/Button";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
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
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const base = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 🧠 Fetch all products
  async function fetchProducts() {
    try {
      const res = await axios.get(`${base}api/products`);
      setProducts(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load products.");
    }
  }

  // 🧠 Fetch single stock info
  async function fetchStock() {
    try {
      const res = await axios.get(`${base}api/inventory-management/${id}`);
      const data = res.data;

      // Set stock data
      setStock({
        product_id: data.product_id?.toString() || "",
        purchase_price: data.purchase_price || "",
        product_variant_id: data.product_variant_id?.toString() || "",
        stock: data.stock || "",
      });
    } catch (err) {
      toast.error("Failed to load stock data.");
    }
  }

  // 🧩 Combined fetch flow
  useEffect(() => {
    (async () => {
      await fetchProducts();
      await fetchStock();
      setLoadingPage(false);
    })();
  }, []);

  // 🧠 Auto-select product when stock data changes
  useEffect(() => {
    if (products.length > 0 && stock.product_id) {
      const prod = products.find(
        (p) => p.id.toString() === stock.product_id.toString()
      );
      setSelectedProduct(prod || null);
    }
  }, [products, stock.product_id]);

  // 🧩 Update stock
  async function updateStock(e) {
    e.preventDefault();
    setLoading(true);

    const url = `${base}api/inventory-management/${id}`;
    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");

    try {
      await axios.put(url, stock, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Stock updated successfully!");
      router.push("/dashboard/inventory");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update stock.");
    } finally {
      setLoading(false);
    }
  }

  // 🧠 Handle product change manually
  function handleSelectProduct(e) {
    const prodId = e.target.value;
    const prod = products.find((p) => p.id.toString() === prodId);
    setSelectedProduct(prod || null);
    setStock({
      ...stock,
      product_id: prodId,
      product_variant_id: "", // reset variant if product changes
    });
  }

  if (loadingPage) return <DynamicLoader />;

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h4 className="text-center mb-4">Edit Stock</h4>

        <form onSubmit={updateStock}>
          {/* 🧾 Product Dropdown */}
          <div className="form-group mb-3">
            <label className="fw-bold">Select Product:</label>
            <select
              className="form-control"
              value={stock.product_id}
              onChange={handleSelectProduct}
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

          {/* 🧩 Variant Dropdown */}
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
                >
                  <option value="">-- Select a Variant --</option>
                  {selectedProduct.variants.map((variant, index) => (
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
            {loading ? "Updating..." : "Update Stock"}
          </button>
        </form>
      </div>
    </div>
  );
}
