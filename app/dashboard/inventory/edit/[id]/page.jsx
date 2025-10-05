"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Button from "@/app/components/dashboard/components/button/Button";
import DynamicLoader from "@/app/components/loader/dynamicLoader";

export default function Page() {
  const { id } = useParams(); // stock row id from the URL
  const router = useRouter();

  const [form, setForm] = useState({
    product_id: "",
    purchase_price: "",
    stock: "",
  });
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingStock, setLoadingStock] = useState(true);
  const [saving, setSaving] = useState(false);

  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = localStorage.getItem('token')
  // Load all products for the dropdown
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`${base}api/products`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        if (!mounted) return;
        setProducts(res.data?.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products.");
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [base]);

  // Load the existing stock by ID
  useEffect(() => {
    if (!id) return;
    let mounted = true;

    (async () => {
      try {
        // Using index and filtering to avoid needing a new backend show-by-id right now
        const res = await axios.get(`${base}api/inventory-management`,{
             headers:{
                Authorization: `Bearer ${token}`
            }
        });
        if (!mounted) return;

        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const existing = list.find((s) => String(s.id) === String(id));

        if (!existing) {
          toast.error("Stock not found.");
          router.back();
          return;
        }

        setForm({
          product_id: existing.product_id ?? existing.product?.id ?? "",
          purchase_price: existing.purchase_price ?? "",
          stock: existing.stock ?? "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load stock.");
        router.back();
      } finally {
        if (mounted) setLoadingStock(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [base, id, router]);

  const isLoading = useMemo(
    () => loadingProducts || loadingStock,
    [loadingProducts, loadingStock]
  );

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);

    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");

    try {
      await axios.put(
        `${base}api/inventory-management/${id}`,
        {
          // send only fields we allow to be updated
          product_id: form.product_id,
          purchase_price: Number(form.purchase_price),
          stock: parseInt(form.stock, 10),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Stock updated successfully!");
      router.push("/dashboard/inventory");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Update failed.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) return <DynamicLoader />;

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: 420 }}>
        <h4 className="text-center mb-4">Edit Stock (ID: {id})</h4>

        <form onSubmit={handleUpdate}>
          {/* Product Dropdown */}
          <div className="form-group mb-3">
            <label className="fw-bold">Select Product:</label>
            <select
              className="form-control"
              value={form.product_id}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, product_id: e.target.value }))
              }
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

          {/* Purchase Price */}
          <div className="form-group mb-3">
            <label className="fw-bold">Purchase Price:</label>
            <input
              type="number"
              className="form-control"
              value={form.purchase_price}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  purchase_price: e.target.value,
                }))
              }
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Stock Quantity */}
          <div className="form-group mb-3">
            <label className="fw-bold">Stock Quantity:</label>
            <input
              type="number"
              className="form-control"
              value={form.stock}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, stock: e.target.value }))
              }
              min="0"
              step="1"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-100 mt-3"
            disabled={saving}
            text={saving ? "Updating..." : "Update Stock"}
          />
        </form>
      </div>
    </div>
  );
}
