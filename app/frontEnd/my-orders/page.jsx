"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaBox, FaShippingFast, FaCheckCircle, FaTimes, FaClock } from "react-icons/fa";
import './my-order.css'
export default function MyOrders() {
    const { isAuthenticated, getToken } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterStatus, setFilterStatus] = useState("");
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

    useEffect(() => {
        if (!isAuthenticated()) {
            toast.error("Please login to view your orders");
            router.push("/frontEnd/log_in");
            return;
        }
        fetchOrders();
    }, [currentPage, filterStatus]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const params = new URLSearchParams({
                page: currentPage.toString(),
                ...(filterStatus && { status: filterStatus })
            });

            const response = await fetch(
                `${API_BASE}api/my-orders?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (data.status) {
                setOrders(data.data.data);
                setTotalPages(data.data.last_page);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            placed: {
                class: "status-placed",
                icon: <FaClock />,
                text: "Placed"
            },
            confirmed: {
                class: "status-confirmed",
                icon: <FaBox />,
                text: "Confirmed"
            },
            shipped: {
                class: "status-shipped",
                icon: <FaShippingFast />,
                text: "Shipped"
            },
            delivered: {
                class: "status-delivered",
                icon: <FaCheckCircle />,
                text: "Delivered"
            },
            cancelled: {
                class: "status-cancelled",
                icon: <FaTimes />,
                text: "Cancelled"
            }
        };

        const config = statusConfig[status] || statusConfig.placed;

        return (
            <span className={`status-pill ${config.class}`}>
                {config.icon}
                {config.text}
            </span>
        );
    };


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="container my-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="container">

                {/* Header */}
                <div className="page-header d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">🛍 My Orders</h2>
                    <Link href="/" className="btn btn-outline-primary">
                        Continue Shopping
                    </Link>
                </div>

                {/* Filter */}
                <div className="filter-card">
                    <label className="fw-semibold mb-2">Filter by Status</label>
                    <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All Orders</option>
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Orders */}
                <div className="row">
                    {orders.map((order) => (
                        <div key={order.id} className="col-lg-4 col-md-6 mb-4">
                            <div className="order-card">

                                {/* Card Header */}
                                <div className="order-card-header d-flex justify-content-between">
                                    <div>
                                        <div className="order-number">{order.order_number}</div>
                                        <div className="order-date">{formatDate(order.created_at)}</div>
                                    </div>
                                        {getStatusBadge(order.status)}                                   
                                </div>

                                {/* Card Body */}
                                <div className="order-body">
                                    {order.order_items?.slice(0, 2).map((item, idx) => (
                                        <div key={idx} className="product-item">
                                            <img src={item.colorImage} alt={item.title} />
                                            <div>
                                                <div className="product-title">{item.title}</div>
                                                <div className="product-meta">
                                                    {item.size?.size && `Size: ${item.size.size} | `}
                                                    Qty: {item.qty}
                                                </div>
                                                <div className="product-price">
                                                    ৳{item.unitPrice}
                                                </div>

                                            </div>
                                        </div>
                                    ))}

                                    {order.order_items?.length > 2 && (
                                        <span className="more_item_text">
                                            +{order.order_items.length - 2} more items
                                        </span>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="order-footer">
                                    <div>
                                        <small className="text-muted">Total</small>
                                        <div className="total-amount">৳{order.total}</div>
                                    </div>
                                    {/* <Link
                                        href={`/frontEnd/orders/${order.order_number}`}
                                        className="btn-view"
                                    >
                                        View Details →
                                    </Link> */}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination unchanged */}
                {totalPages > 1 && (
                    <nav>
                        <ul className="pagination justify-content-center mt-4">
                            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                    Previous
                                </button>
                            </li>

                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className={`page-item ${currentPage === i + 1 && "active"}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </div>
    );
}