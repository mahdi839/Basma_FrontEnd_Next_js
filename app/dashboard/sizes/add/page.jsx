"use client";
import React, { useEffect, useState } from "react";
import Button from "@/app/components/dashboard/components/button/Button";
import useStoreData from "@/app/hooks/useStoreData";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    attribute: "",
    value: "",
    price: "",
  });

  const { storeData, loading } = useStoreData();
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await axios.get(`${base}api/products`);
        // assuming your product index returns { data: [...] } or just array
        const items = res.data?.data ?? res.data ?? [];
        setProducts(items);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    }
    fetchProducts();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "api/product-variants";
    const payload = {
      product_id: Number(form.product_id),
      attribute: form.attribute,
      value: form.value,
      price: form.price === "" ? null : Number(form.price),
    };
    await storeData(url, payload, "Variant added successfully");
    router.push("/dashboard/sizes");
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "480px" }}>
        <h4 className="text-center mb-4">Add Product Variant</h4>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="fw-bold">Product:</label>
            <select
              className="form-control"
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-3">
            <label className="fw-bold">Attribute (e.g. size, weight, color):</label>
            <input
              type="text"
              className="form-control"
              name="attribute"
              placeholder="size / weight / color"
              value={form.attribute}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="fw-bold">Value (e.g. M, 1kg, Red):</label>
            <input
              type="text"
              className="form-control"
              name="value"
              placeholder="M / 1kg / Red"
              value={form.value}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-2">
            <label className="fw-bold">Price (optional, overrides base_price):</label>
            <input
              type="number"
              className="form-control"
              name="price"
              placeholder="Leave blank to use base_price"
              value={form.price}
              onChange={handleChange}
              min="0"
            />
          </div>

          <Button type="submit" className="btn btn-primary w-100 mt-3">
            {loading ? "Adding..." : "Add Variant"}
          </Button>
        </form>
      </div>
    </div>
  );
}
