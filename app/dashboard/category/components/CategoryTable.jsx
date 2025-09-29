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
            confirmButtonText: " Delete",
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
        } catch (err) {
            toast.error(err.message)
        }
        // Update state to remove deleted category
        setGetCategories(prev => ({
            ...prev,
            data: prev.data.filter(category => category.id !== id)
        }));
    }


    return (
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th className="text-center">Id</th>
                    <th className="text-center">Category Name</th>
                    <th className="text-center">Slug</th>
                    <th className="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {getCategories?.data?.length === 0 ? (
                    <tr>
                        <td colSpan="3" className="text-center text-danger">
                            No Categories Available
                        </td>
                    </tr>
                ) : (
                    getCategories?.data?.map((category) => (
                        <tr key={category.id}>
                            <td className="text-center">{category.id}</td>
                            <td className="text-center">{category.name}</td>
                            <td className="text-center">{category.slug}</td>
                            <td className="text-center">
                                <span className="d-flex gap-3 justify-content-center ">
                                    <Link href={`/dashboard/category/edit/${category.id}`}>
                                        <FaEdit className="text-dark" />
                                    </Link>
                                    <FaTrash className="text-danger mt-2" onClick={() => handleDelete(category.id)} style={{ cursor: 'pointer' }} />
                                </span>
                            </td>

                        </tr>
                    ))
                )}
            </tbody>
        </table>
    )
}
