"use client";
import React, { useEffect, useState } from "react";
import Button from "@/app/components/dashboard/components/button/Button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    attribute: "",
    value: "",
    price: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadAll() {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL;

        // fetch products for dropdown
        const prodRes = await axios.get(`${base}api/products`);
        const prodItems = prodRes.data?.data ?? prodRes.data ?? [];
        setProducts(prodItems);

        // fetch variant
        const vRes = await axios.get(`${base}api/product-variants/${id}`);
        const v = vRes.data?.data ?? vRes.data;
        setForm({
          product_id: v.product_id,
          attribute: v.attribute,
          value: v.value,
          price: v.price ?? "",
        });
      } catch (err) {
        toast.error("Failed to load variant");
      }
    }
    if (id) loadAll();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL;
      const token = localStorage.getItem("token");
      await axios.put(
        `${base}api/product-variants/${id}`,
        {
          product_id: Number(form.product_id),
          attribute: form.attribute,
          value: form.value,
          price: form.price === "" ? null : Number(form.price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Updated Successfully");
      router.push("/dashboard/sizes");
    } catch (err) {
      toast.error(err.response?.data?.message || "An Error Occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "480px" }}>
        <h4 className="text-center mb-4">Update Variant ({id})</h4>

        <form onSubmit={handleUpdate}>
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
            <label className="fw-bold">Attribute:</label>
            <input
              type="text"
              className="form-control"
              name="attribute"
              value={form.attribute}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="fw-bold">Value:</label>
            <input
              type="text"
              className="form-control"
              name="value"
              value={form.value}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-2">
            <label className="fw-bold">Price (optional):</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              placeholder="Leave blank to use base_price"
            />
          </div>

          <Button type="submit" className="btn btn-primary w-100 mt-3">
            {isLoading ? "...Updating" : "Update"}
          </Button>
        </form>
      </div>
    </div>
  );
}
