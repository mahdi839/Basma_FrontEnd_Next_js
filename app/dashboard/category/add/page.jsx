"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    parent_id: "",
    home_category: "0",
    priority: 0,
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const url = process.env.NEXT_PUBLIC_BACKEND_URL + "api/categories";
        const res = await fetch(url);
        const data = await res.json();
        setCategories(data.data || []);
      } catch (error) {
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (form.name.length > 100) {
      newErrors.name = "Category name must be less than 100 characters";
    }
    
    if (form.priority < 0 || form.priority > 999) {
      newErrors.priority = "Priority must be between 0 and 999";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "api/categories";

    try {
      await axios.post(
        url,
        {
          name: form.name.trim(),
          parent_id: form.parent_id || null,
          home_category: form.home_category,
          priority: Number(form.priority),
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      toast.success("Category created successfully!");
      router.push("/dashboard/category");
      router.refresh();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to create category";
      toast.error(errorMessage);
      
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="container-fluid px-4 py-3">
      {/* Header Section */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <button
          onClick={() => router.push("/dashboard/category")}
          className="btn btn-outline-secondary"
        >
          <i className="fas fa-arrow-left me-2"></i>
          Back to Categories
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-primary text-uppercase mb-1">
                    Total Categories
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{categories.length}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-folder fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-success text-uppercase mb-1">
                    Root Categories
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {categories.filter(cat => !cat.parent_id).length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-sitemap fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Main Form Card */}
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 fw-bold text-primary">
                <i className="fas fa-plus-circle me-2"></i>
                Category Information
              </h6>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                {/* Category Name */}
                <div className="row mb-4">
                  <div className="col-md-12">
                    <label htmlFor="categoryName" className="form-label fw-bold">
                      <i className="fas fa-tag me-2"></i>
                      Category Name
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-font"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        id="categoryName"
                        placeholder="Enter a descriptive category name"
                        value={form.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                      {errors.name && (
                        <div className="invalid-feedback">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.name}
                        </div>
                      )}
                    </div>
                 
                  </div>
                </div>

                {/* Parent Category & Priority */}
                <div className="row mb-4">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label htmlFor="parentCategory" className="form-label fw-bold">
                      <i className="fas fa-sitemap me-2"></i>
                      Parent Category
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-level-up-alt"></i>
                      </span>
                      <select
                        className="form-select"
                        id="parentCategory"
                        value={form.parent_id}
                        onChange={(e) => handleInputChange("parent_id", e.target.value)}
                        disabled={isSubmitting || loading}
                      >
                        <option value="">-- Select Parent Category (Optional) --</option>
                        {categories
                          .filter(cat => !cat.parent_id)
                          .map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <small className="form-text text-muted">
                      Leave empty to create a root category
                    </small>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="priority" className="form-label fw-bold">
                      <i className="fas fa-sort-numeric-down me-2"></i>
                      Display Priority
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-sort-amount-up"></i>
                      </span>
                      <input
                        type="number"
                        className={`form-control ${errors.priority ? "is-invalid" : ""}`}
                        id="priority"
                        min="0"
                        max="999"
                        value={form.priority}
                        onChange={(e) => handleInputChange("priority", e.target.value)}
                        disabled={isSubmitting}
                      />
                      {errors.priority && (
                        <div className="invalid-feedback">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.priority}
                        </div>
                      )}
                    </div>
                    <small className="form-text text-muted">
                      Higher number = higher display priority (0-999)
                    </small>
                  </div>
                </div>

                {/* Homepage Display */}
                <div className="row mb-4">
                  <div className="col-md-12">
                    <label className="form-label fw-bold d-block">
                      <i className="fas fa-home me-2"></i>
                      Homepage Display Settings
                    </label>
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 mb-3 mb-md-0">
                            <div className="form-check card border p-3 h-100">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="home_category"
                                id="showOnHomepage"
                                value="1"
                                checked={form.home_category === "1"}
                                onChange={(e) => handleInputChange("home_category", e.target.value)}
                                disabled={isSubmitting}
                              />
                              <label className="form-check-label fw-bold" htmlFor="showOnHomepage">
                                <i className="fas fa-eye text-success me-2"></i>
                                Show on Homepage
                              </label>
                              <small className="text-muted d-block mt-1">
                                Category will be featured prominently on the homepage
                              </small>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-check card border p-3 h-100">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="home_category"
                                id="hideFromHomepage"
                                value="0"
                                checked={form.home_category === "0"}
                                onChange={(e) => handleInputChange("home_category", e.target.value)}
                                disabled={isSubmitting}
                              />
                              <label className="form-check-label fw-bold" htmlFor="hideFromHomepage">
                                <i className="fas fa-eye-slash text-secondary me-2"></i>
                                Hide from Homepage
                              </label>
                              <small className="text-muted d-block mt-1">
                                Category will only appear in category listings
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="row mt-5">
                  <div className="col-md-12">
                    <div className="d-flex justify-content-between border-top pt-4">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => router.push("/dashboard/category")}
                        disabled={isSubmitting}
                      >
                        <i className="fas fa-times me-2"></i>
                        Cancel
                      </button>
                      <div className="d-flex gap-3">
                        <button
                          type="submit"
                          className="btn px-5"
                          disabled={isSubmitting || !form.name.trim()}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Creating...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i>
                              Create Category
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar - Help & Guidelines */}
        <div className="col-lg-4">
          {/* Help Card */}
          <div className="card shadow mb-4">
            <div className="card-header py-3 bg-info">
              <h6 className="m-0 fw-bold text-white">
                <i className="fas fa-lightbulb me-2"></i>
                Category Guidelines
              </h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6 className="fw-bold text-primary mb-2">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Best Practices
                </h6>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <i className="fas fa-chevron-right text-primary me-2"></i>
                    Use clear, descriptive names
                  </li>
                 
                  <li className="mb-2">
                    <i className="fas fa-chevron-right text-primary me-2"></i>
                    Feature popular categories
                  </li>
                  <li>
                    <i className="fas fa-chevron-right text-primary me-2"></i>
                    Use priority for important categories
                  </li>
                </ul>
              </div>
              
              <div className="mb-3">
                <h6 className="fw-bold text-primary mb-2">
                  <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                  Things to Avoid
                </h6>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <i className="fas fa-times text-danger me-2"></i>
                    Avoid duplicate category names
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-times text-danger me-2"></i>
                    Don't create too many levels
                  </li>
                  <li>
                    <i className="fas fa-times text-danger me-2"></i>
                    Avoid vague category names
                  </li>
                </ul>
              </div>
              
              <div className="alert alert-warning">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Tip:</strong> Categories with higher priority will appear first in listings.
              </div>
            </div>
          </div>

          {/* Recent Categories */}
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 fw-bold text-primary">
                <i className="fas fa-history me-2"></i>
                Recent Categories
              </h6>
            </div>
            <div className="card-body">
              {categories.slice(0, 5).map((category) => (
                <div key={category.id} className="d-flex align-items-center mb-3">
                  <div className="flex-shrink-0">
                    <i className="fas fa-folder text-primary"></i>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="fw-medium">{category.name}</div>
                    <small className="text-muted">
                      {category.parent_id ? "Sub-category" : "Root category"}
                    </small>
                  </div>
                  <span className="badge bg-light text-dark">
                    {category.priority}
                  </span>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="text-center text-muted py-3">
                  <i className="fas fa-folder-open fa-2x mb-2"></i>
                  <p>No categories yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-25 z-3">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-primary fw-bold">Loading categories...</p>
          </div>
        </div>
      )}
    </div>
  );
}