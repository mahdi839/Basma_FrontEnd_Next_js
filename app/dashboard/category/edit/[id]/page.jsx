"use client"
import Button from '@/app/components/dashboard/components/button/Button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function Page({ params }) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = params;
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + `api/categories/${id}`;
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
                toast.error(err.message);
            }
        }
        if (id) fetchCategory();
    }, [id]);

    function handleChange(e) {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    async function editCategory(e) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.put(
                url,
                {
                    name: data?.name,
                    home_category: data?.home_category,
                    priority: parseInt(data?.priority) || 0,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Updated Successfully!");
            router.push("/dashboard/category");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: "400px" }}>
                <h4 className="text-center mb-4">Update ({data?.name})</h4>

                {data && (
                    <form onSubmit={editCategory}>
                        {/* Category Name */}
                        <div className="form-group">
                            <label htmlFor="name" className="fw-bold">Category:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                placeholder="Enter category"
                                value={data?.name || ""}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Home Category Dropdown */}
                        <div className="form-group mt-3">
                            <label htmlFor="home_category" className="fw-bold">Home Category:</label>
                            <select
                                className="form-select"
                                id="home_category"
                                name="home_category"
                                value={String(data?.home_category ?? "")}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="1">On</option>
                                <option value="0">Off</option>
                            </select>
                        </div>

                        {/* Priority Field */}
                        <div className="form-group mt-3">
                            <label htmlFor="priority" className="fw-bold">Priority:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="priority"
                                name="priority"
                                placeholder="Enter priority"
                                value={data?.priority ?? 0}
                                onChange={handleChange}
                            />
                        </div>

                        <Button type="submit" className="btn-primary w-100 mt-3">
                            {isLoading ? "...Updating" : "Update"}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
