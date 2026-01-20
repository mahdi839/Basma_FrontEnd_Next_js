"use client";

import Button from "@/app/components/dashboard/components/button/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page({ params }) {
  const { id } = params;
  const router = useRouter();

  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = `${baseUrl}api/categories/${id}`;
  const categoriesUrl = `${baseUrl}api/categories`;

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!id) return;

    async function fetchCategory() {
      try {
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data.data ?? res.data);
      } catch (err) {
        toast.error("Failed to load category");
      }
    }

    async function fetchCategories() {
      try {
        const res = await axios.get(categoriesUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCategory();
    fetchCategories();
  }, [id]);

  /* ================= HANDLE CHANGE ================= */
  function handleChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: name === "priority" ? parseInt(value) || 0 : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  /* ================= UPDATE CATEGORY ================= */
  async function editCategory(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await axios.put(
        url,
        {
          name: data.name,
          parent_id: data.parent_id || null,
          home_category: data.home_category, 
          priority: parseInt(data.priority) || 0,
          size_guide_type: data.size_guide_type || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // 🔥 invalidate cache
      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tags: ["products"],
        }),
      });

      toast.success("Category updated successfully!");
      router.push("/dashboard/category");
      router.refresh();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        const firstKey = Object.keys(err.response.data.errors)[0];
        toast.error(err.response.data.errors[firstKey][0]);
      } else {
        toast.error("Failed to update category");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!data) return null;

  return (
    <div className="container-fluid px-4">
      <h1 className="h3 mb-4">Edit Category</h1>

      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={editCategory}>
            {/* NAME */}
            <div className="mb-3">
              <label className="form-label fw-bold">Category Name</label>
              <input
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                name="name"
                value={data.name || ""}
                onChange={handleChange}
              />
              {errors.name && (
                <div className="invalid-feedback d-block">
                  {errors.name[0]}
                </div>
              )}
            </div>

            {/* PARENT */}
            <div className="mb-3">
              <label className="form-label fw-bold">Parent Category</label>
              <select
                className="form-select"
                name="parent_id"
                value={data.parent_id || ""}
                onChange={handleChange}
              >
                <option value="">Root Category</option>
                {categories
                  .filter((c) => c.id !== data.id && !c.parent_id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* SIZE GUIDE TYPE */}
            <div className="mb-3">
              <label className="form-label fw-bold">
                Size Guide Type
              </label>

              <select
                className={`form-select ${errors.size_guide_type ? "is-invalid" : ""}`}
                name="size_guide_type"
                value={data.size_guide_type || ""}
                onChange={handleChange}
              >
                <option value="">-- No Size Guide --</option>
                <option value="shoe">Shoe Size Guide</option>
                <option value="dress">Dress Size Guide</option>
              </select>

              {errors.size_guide_type && (
                <div className="invalid-feedback d-block">
                  {errors.size_guide_type[0]}
                </div>
              )}

              <small className="text-muted">
                Select size guide only if category needs sizing
              </small>
            </div>


            {/* PRIORITY */}
            <div className="mb-3">
              <label className="form-label fw-bold">Priority</label>
              <input
                type="number"
                className="form-control"
                name="priority"
                value={data.priority ?? 0}
                onChange={handleChange}
              />
            </div>

            {/* HOME CATEGORY */}
            <div className="mb-4">
              <label className="form-label fw-bold d-block">
                Homepage Display
              </label>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-check card p-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="home_category"
                      value="1"
                      checked={String(data.home_category) === "1"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label fw-bold">
                      Show on Homepage
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-check card p-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="home_category"
                      value="0"
                      checked={String(data.home_category) === "0"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label fw-bold">
                      Hide from Homepage
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => router.push("/dashboard/category")}
              >
                Cancel
              </button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Category"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
