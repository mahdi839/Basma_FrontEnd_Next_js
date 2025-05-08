"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaArrowRight } from "react-icons/fa";

export default function ProductTable({ productData }) {
    const [products, setProducts] = useState(productData);
    

    let token = localStorage.getItem('token')
    function formatCreatedAt(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' }).toLowerCase();
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
    }

    
    async function handleDelete(id) {
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
            const baseUrl = process.env.BACKEND_URL;
            await axios.delete(`${baseUrl}api/products/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            });
            setProducts(products.filter((product) => product.id !== id));

            Swal.fire({
                title: "Successfully Deleted",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "An Error Occurred");
        }
    }

    return (
        <div className="card">
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th>Thumbnail</th>
                                <th>Product Info</th>
                                <th>Size/Price</th>
                                <th>FAQ</th>
                                <th>Video URL</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        {product.images?.length > 0 ? (
                                            <img
                                                src={`${process.env.BACKEND_URL}${product.images[0].image}`}
                                                alt="Product thumbnail"
                                                className="img-thumbnail"
                                                style={{ width: "80px", height: "80px", objectFit: "cover" }}

                                            />
                                        ) : (
                                            <div className="text-muted">No Image</div>
                                        )}
                                    </td>
                                    <td>
                                        <h6>{product.title}</h6>
                                        <small className="text-muted">{product.sub_title}</small>
                                        <small className="text-muted d-block mt-1">
                                            Created: {formatCreatedAt(product.created_at)}
                                        </small>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-1 flex-wrap">
                                            {product.sizes && product.sizes.map((size) => (
                                                <span key={size.id} className="badge bg-secondary">
                                                    Size: {size.size} <FaArrowRight /> Price:{size.pivot.price}
                                                </span>
                                            ))}
                                            {
                                                product.price && (
                                                    <div className="">
                                                        <span className="badge bg-success mr-3">
                                                            Size: One Size
                                                        </span>
                                                        <span className="badge bg-info">
                                                            Price:{product.price}
                                                        </span>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </td>

                                    <td>
                                        {product.faqs?.map((faq, index) => (
                                            <div key={index} className="mb-2">
                                                <strong>Q: {faq.question}</strong>
                                                <div className="text-muted">A: {faq.answer.slice(0, 20)}....</div>
                                            </div>
                                        ))}
                                    </td>

                                    <td>
                                        {
                                            product.video_url && (<span  >
                                                {product.video_url}
                                            </span>)
                                        }
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link href={`/dashboard/products/edit/${product.id}`}>
                                                <FaEdit className="text-dark" />
                                            </Link>
                                            <FaTrash
                                                className="text-danger mt-2"
                                                onClick={() => handleDelete(product.id)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}