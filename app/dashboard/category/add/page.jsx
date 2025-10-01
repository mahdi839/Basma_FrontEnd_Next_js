"use client"
import Button from "@/app/components/dashboard/components/button/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
    const [category, setCategory] = useState({
        name: "",
        home_category: "",
        priority: 0
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function storeCategory(e) {
        e.preventDefault();
        setLoading(true);

        const url = process.env.NEXT_PUBLIC_BACKEND_URL + "api/categories";
        let token = null;

        if (typeof window !== "undefined") {
            token = localStorage.getItem("token");
        }

        try {
            const res = await axios.post(
                url,
                { 
                    name: category.name, 
                    home_category: category.home_category, 
                    priority: category.priority 
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Category successfully added!");
            router.push("/dashboard/category");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: "400px" }}>
                <h4 className="text-center mb-4">Add Category</h4>

                <form onSubmit={storeCategory}>
                    {/* Category Name */}
                    <div className="form-group mb-3">
                        <label htmlFor="name" className="fw-bold">Category:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            placeholder="Enter category"
                            value={category.name}
                            onChange={(e) =>
                                setCategory({ ...category, name: e.target.value })
                            }
                        />
                    </div>

                    {/* Home Category Dropdown */}
                    <div className="form-group mb-3">
                        <label htmlFor="home_category" className="fw-bold">Home Category:</label>
                        <select
                            className="form-select"
                            id="home_category"
                            name="home_category"
                            value={category.home_category}
                            onChange={(e) =>
                                setCategory({ ...category, home_category: e.target.value })
                            }
                        >
                            <option value="">Select</option>
                            <option value="1">On</option>
                            <option value="0">Off</option>
                        </select>
                    </div>

                    {/* Priority */}
                    <div className="form-group mb-3">
                        <label htmlFor="priority" className="fw-bold">Priority:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="priority"
                            name="priority"
                            placeholder="Enter priority (e.g. 1, 2, 3)"
                            value={category.priority}
                            onChange={(e) =>
                                setCategory({ ...category, priority: parseInt(e.target.value) || 0 })
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        className="dashboard-btn w-100 mt-3"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Category"}
                    </button>
                </form>
            </div>
        </div>
    );
}
