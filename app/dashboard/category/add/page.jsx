"use client"
import Button from "@/app/components/dashboard/components/button/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from 'react'
import { toast } from "react-toastify";

export default function page() {
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    async function storeCategory(e) {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL + 'api/categories'
        let token = null;

        if (typeof window !== "undefined") {
            token = localStorage.getItem("token");
        }
        e.preventDefault();
        setLoading(true)
        try {
            const res = await axios.post(url, { name: category }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            toast.success("successfully added")
             router.push("/dashboard/category");
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: "400px" }}>
                <h4 className="text-center mb-4">Add Category</h4>

                <form onSubmit={storeCategory}>
                    <div className="form-group">
                        <label htmlFor="size" className="fw-bold">Size:</label>
                        <input type="text" className="form-control" id="category" name="category" placeholder="Enter category" onChange={(e) => setCategory(e.target.value)} />
                    </div>
                    <button type="submit" className="dashboard-btn w-100 mt-3">{loading ? "Adding..." : "Add category"}</button>
                </form>
            </div>
        </div>
    )
}
