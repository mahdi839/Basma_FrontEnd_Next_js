"use client"
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react'
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";

export default function CategoryTable({ categories }) {
    const [getCategories, setGetCategories] = useState(categories);

    async function handleDelete(id) {
        let token = null;

        if (typeof window !== "undefined") {
            token = localStorage.getItem("token");
        }
        const url = process.env.NEXT_PUBLIC_BACKEND_URL + `api/categories/${id}`
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete",
        });

        if (!result.isConfirmed) return;
        try {
            await axios.delete(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            Swal.fire({
                title: "Successfully Deleted",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
            // Update state to remove deleted category
            setGetCategories(prev => ({
                ...prev,
                data: prev.data.filter(category => category.id !== id)
            }));
        } catch (err) {
            toast.error(err.message || "Failed to delete category")
        }
    }

    // Mobile Card View
    const MobileCategoryCard = ({ category }) => (
        <div className="category-card mb-3 p-3 border rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h6 className="fw-bold mb-1">{category.name}</h6>
                    <small className="text-muted">ID: {category.id}</small>
                </div>
                <div className="d-flex gap-2">
                    <Link href={`/dashboard/category/edit/${category.id}`}>
                        <button className="btn btn-sm btn-outline-primary">
                            <FaEdit />
                        </button>
                    </Link>
                    <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(category.id)}
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
            
            <div className="row small">
                <div className="col-6">
                    <strong>Slug:</strong>
                    <div className="text-truncate">{category.slug}</div>
                </div>
                <div className="col-6">
                    <strong>Priority:</strong>
                    <div>{category.priority}</div>
                </div>
            </div>
            
            <div className="mt-2">
                <strong>Home Category:</strong>
                <span className={`badge ${category.home_category ? "bg-info" : "bg-danger"} ms-2`}>
                    {category.home_category ? "On" : "Off"}
                </span>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Table View - Hidden on mobile */}
            <div className="d-none d-lg-block">
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="">
                            <tr>
                                <th className="text-center">ID</th>
                                <th className="text-center">Category Name</th>
                                <th className="text-center">Slug</th>
                                <th className="text-center">Home Category</th>
                                <th className="text-center">Priority</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getCategories?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-danger py-4">
                                        <div className="py-3">
                                            <i className="fas fa-inbox fa-2x mb-2 text-muted"></i>
                                            <p className="mb-0">No Categories Available</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                getCategories?.data?.map((category) => (
                                    <tr key={category.id}>
                                        <td className="text-center align-middle">{category.id}</td>
                                        <td className="text-center align-middle fw-semibold">
                                            {category.name}
                                        </td>
                                        <td className="text-center align-middle">
                                            <code>{category.slug}</code>
                                        </td>
                                        <td className="text-center align-middle">
                                            <span className={`badge ${category.home_category ? "bg-info" : "bg-danger"}`}>
                                                {category.home_category ? "On" : "Off"}
                                            </span>
                                        </td>
                                        <td className="text-center align-middle">
                                            <span className="badge bg-secondary">{category.priority}</span>
                                        </td>
                                        <td className="text-center align-middle">
                                            <div className="d-flex gap-2 justify-content-center">
                                                <Link href={`/dashboard/category/edit/${category.id}`}>
                                                    <button className="btn btn-sm btn-outline-primary">
                                                        <FaEdit className="me-1" />
                                                        Edit
                                                    </button>
                                                </Link>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(category.id)}
                                                >
                                                    <FaTrash className="me-1" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View - Hidden on desktop */}
            <div className="d-block d-lg-none">
                {getCategories?.data?.length === 0 ? (
                    <div className="text-center text-danger py-5">
                        <i className="fas fa-inbox fa-3x mb-3 text-muted"></i>
                        <p className="fs-5">No Categories Available</p>
                    </div>
                ) : (
                    getCategories?.data?.map((category) => (
                        <MobileCategoryCard key={category.id} category={category} />
                    ))
                )}
            </div>

            {/* Add some custom styles */}
            <style jsx>{`
                .category-card {
                    background: #fff;
                    transition: all 0.3s ease;
                }
                .category-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                @media (max-width: 576px) {
                    .category-card {
                        margin-left: -10px;
                        margin-right: -10px;
                        border-radius: 0;
                        border-left: none;
                        border-right: none;
                    }
                }
            `}</style>
        </>
    );
}