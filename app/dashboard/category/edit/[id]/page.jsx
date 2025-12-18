"use client"
import Button from '@/app/components/dashboard/components/button/Button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function Page({ params }) {
    const [data, setData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const { id } = params;
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + `api/categories/${id}`;
    const categoriesUrl = process.env.NEXT_PUBLIC_BACKEND_URL + 'api/categories';
    const router = useRouter();

    let token = null;
    if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
    }

    useEffect(() => {
        async function fetchCategory() {
            try {
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(res.data);
            } catch (err) {
                toast.error(err.response?.data?.message || err.message);
            }
        }
        
        async function fetchCategories() {
            try {
                const res = await axios.get(categoriesUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Filter out current category and its children to prevent circular reference
                const filteredCategories = res.data.data || res.data || [];
                setCategories(filteredCategories);
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        }
        
        if (id) {
            fetchCategory();
            fetchCategories();
        }
    }, [id]);

    function handleChange(e) {
        const { name, value } = e.target;
        setData(prev => ({ 
            ...prev, 
            [name]: name === 'priority' ? parseInt(value) || 0 : value 
        }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    }

    async function editCategory(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        
        try {
            const res = await axios.put(
                url,
                {
                    name: data?.name,
                    parent_id: data?.parent_id || null,
                    priority: parseInt(data?.priority) || 0,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Category updated successfully!");
            router.push("/dashboard/category");
            router.refresh();
        } catch (err) {
            console.error("Update error:", err);
            
            // Handle Laravel validation errors
            if (err.response?.data?.errors) {
                const apiErrors = err.response.data.errors;
                setErrors(apiErrors);
                
                // Show first error in toast
                const firstErrorKey = Object.keys(apiErrors)[0];
                if (apiErrors[firstErrorKey] && apiErrors[firstErrorKey][0]) {
                    toast.error(apiErrors[firstErrorKey][0]);
                }
            } else {
                const errorMessage = err.response?.data?.message || 
                                  err.response?.data?.error || 
                                  "Failed to update category";
                toast.error(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container-fluid px-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center pt-3 pb-3">
                <div>
                    <h1 className="h3 mb-0 text-gray-800">Edit Category</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent p-0 mb-0">
                            <li className="breadcrumb-item">
                                <a href="/dashboard" className="text-decoration-none">Dashboard</a>
                            </li>
                            <li className="breadcrumb-item">
                                <a href="/dashboard/category" className="text-decoration-none">Categories</a>
                            </li>
                            <li className="breadcrumb-item active">Edit: {data?.name}</li>
                        </ol>
                    </nav>
                </div>
                <button
                    onClick={() => router.push("/dashboard/category")}
                    className="btn btn-outline-secondary"
                >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Categories
                </button>
            </div>

            <div className="row mt-4">
                <div className="col-xl-8 col-lg-12">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">
                                <i className="fas fa-edit me-2"></i>
                                Edit Category: {data?.name}
                            </h6>
                        </div>
                        <div className="card-body">
                            {data && (
                                <form onSubmit={editCategory}>
                                    {/* Category Name */}
                                    <div className="mb-4">
                                        <label htmlFor="name" className="form-label font-weight-bold">
                                            <i className="fas fa-tag me-2"></i>
                                            Category Name
                                            <span className="text-danger"> *</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                            id="name"
                                            name="name"
                                            placeholder="Enter category name"
                                            value={data?.name || ""}
                                            onChange={handleChange}
                                            maxLength={255}
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback d-block">
                                                <i className="fas fa-exclamation-circle me-1"></i>
                                                {Array.isArray(errors.name) ? errors.name[0] : errors.name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Parent Category */}
                                    <div className="mb-4">
                                        <label htmlFor="parent_id" className="form-label font-weight-bold">
                                            <i className="fas fa-sitemap me-2"></i>
                                            Parent Category
                                        </label>
                                        <select
                                            className={`form-select ${errors.parent_id ? "is-invalid" : ""}`}
                                            id="parent_id"
                                            name="parent_id"
                                            value={data?.parent_id || ""}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        >
                                            <option value="">No Parent (Root Category)</option>
                                            {categories
                                                .filter(cat => cat.id !== id && !cat.parent_id) // Filter out current category and only show root categories
                                                .map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                        </select>
                                        {errors.parent_id && (
                                            <div className="invalid-feedback d-block">
                                                <i className="fas fa-exclamation-circle me-1"></i>
                                                {Array.isArray(errors.parent_id) ? errors.parent_id[0] : errors.parent_id}
                                            </div>
                                        )}
                                        <small className="form-text text-muted">
                                            Cannot select itself as parent. Only root categories are available.
                                        </small>
                                    </div>

                                    {/* Priority */}
                                    <div className="mb-4">
                                        <label htmlFor="priority" className="form-label font-weight-bold">
                                            <i className="fas fa-sort-amount-up me-2"></i>
                                            Display Priority
                                        </label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.priority ? "is-invalid" : ""}`}
                                            id="priority"
                                            name="priority"
                                            placeholder="Enter priority"
                                            value={data?.priority ?? 0}
                                            onChange={handleChange}
                                            min="0"
                                        />
                                        {errors.priority && (
                                            <div className="invalid-feedback d-block">
                                                <i className="fas fa-exclamation-circle me-1"></i>
                                                {Array.isArray(errors.priority) ? errors.priority[0] : errors.priority}
                                            </div>
                                        )}
                                        <small className="form-text text-muted">
                                            Higher number = higher display priority
                                        </small>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex justify-content-between pt-3 border-top">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => router.push("/dashboard/category")}
                                            disabled={isSubmitting}
                                        >
                                            <i className="fas fa-times me-2"></i>
                                            Cancel
                                        </button>
                                        <Button 
                                            type="submit" 
                                            className="btn-primary"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save me-2"></i>
                                                    Update Category
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="col-xl-4 col-lg-12">
                    <div className="card shadow">
                        <div className="card-header py-3 bg-info">
                            <h6 className="m-0 font-weight-bold text-white">
                                <i className="fas fa-info-circle me-2"></i>
                                Category Details
                            </h6>
                        </div>
                        <div className="card-body">
                            {data && (
                                <>
                                    <div className="mb-3">
                                        <h6 className="font-weight-bold text-primary">Current Status</h6>
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="badge bg-primary me-2">
                                                <i className="fas fa-sort-amount-up me-1"></i>
                                                Priority: {data.priority}
                                            </span>
                                            <span className={`badge ${data.parent_id ? "bg-warning" : "bg-success"}`}>
                                                <i className={`fas ${data.parent_id ? "fa-level-down-alt" : "fa-layer-group"} me-1`}></i>
                                                {data.parent_id ? "Sub-category" : "Root Category"}
                                            </span>
                                        </div>
                                        <small className="text-muted">
                                            Slug: {data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : ''}
                                        </small>
                                    </div>
                                    
                                    <div className="alert alert-warning">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        <strong>Note:</strong> Changing the parent category may affect the hierarchy.
                                    </div>
                                    
                                    <div className="alert alert-info">
                                        <i className="fas fa-lightbulb me-2"></i>
                                        <strong>Tip:</strong> Use priority to control display order. Higher numbers appear first.
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}