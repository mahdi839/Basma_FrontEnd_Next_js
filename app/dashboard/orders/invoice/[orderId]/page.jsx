"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import PageLoader from "@/app/components/loader/pageLoader";
import useFormatDate from "@/app/hooks/useFormatDate";
import { FaPrint, FaArrowLeft } from "react-icons/fa";

export default function InvoicePage() {
    const params = useParams();
    const orderId = params.orderId;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [companyLogo, setCompanyLogo] = useState("");
    const [companyInfo, setCompanyInfo] = useState({});
    const { formatDate } = useFormatDate();

    useEffect(() => {
        fetchOrderDetails();
        fetchCompanyInfo();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}api/orders/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setOrder(data.order);
        } catch (error) {
            console.error("Error fetching order:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanyInfo = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}api/footer-settings/1`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCompanyInfo({
                description: data.company_description,
                address: data.company_address,
                email: data.company_email,
                phone: data.company_phone,
            });

            if (data.logo_path) {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL.endsWith("/")
                    ? process.env.NEXT_PUBLIC_BACKEND_URL.slice(0, -1)
                    : process.env.NEXT_PUBLIC_BACKEND_URL;
                setCompanyLogo(backendUrl + data.logo_path);
            }
        } catch (error) {
            console.error("Error fetching company info:", error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        window.history.back();
    };

    if (loading) {
        return <PageLoader />;
    }

    if (!order) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">Order not found</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {/* Action Buttons */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-outline-primary" onClick={handleBack}>
                    <FaArrowLeft className="me-2" />
                    Back to Orders
                </button>
                <button className="btn btn-primary" onClick={handlePrint}>
                    <FaPrint className="me-2" />
                    Print Invoice
                </button>
            </div>

            {/* Invoice Card */}
            <div className="card shadow-lg">
                <div className="card-body p-4">
                    {/* Header with Logo and Company Info */}
                    <div className="row mb-4 border-bottom pb-4">
                        <div className="col-md-6">
                            {companyLogo && (
                                <img
                                    src={companyLogo}
                                    alt="Company Logo"
                                    className="mb-3"
                                    style={{ maxHeight: "80px" }}
                                />
                            )}
                            <h4 className="text-primary mb-2">INVOICE</h4>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <h5 className="mb-3">Order Details</h5>
                            <p className="mb-1">
                                <strong>Order ID:</strong> #{order.id}
                            </p>
                            <p className="mb-1">
                                <strong>Order Date:</strong> {formatDate(order.created_at)}
                            </p>
                            <p className="mb-0">
                                <strong>Payment Method:</strong> {order.payment_method}
                            </p>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <h5 className="border-bottom pb-2">Customer Information</h5>
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="mb-1">
                                        <strong>Name:</strong> {order.name}
                                    </p>
                                    <p className="mb-1">
                                        <strong>Phone:</strong> {order.phone}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-1">
                                        <strong>Address:</strong> {order.address}
                                    </p>
                                    <p className="mb-0">
                                        <strong>District:</strong> {order.district}
                                    </p>
                                    {order.delivery_notes && (
                                        <p className="text-muted mt-2">
                                            <strong>Delivery Notes:</strong> {order.delivery_notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <h5 className="border-bottom pb-2">Order Items</h5>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Product Name</th>
                                            <th>Variant</th>
                                            <th>Quantity</th>
                                            <th>Unit Price</th>
                                            <th>Total Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.order_items?.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <strong>{item.title}</strong>
                                                    {item.colorImage && (
                                                        <div className="mt-1">
                                                            <img
                                                                src={item.colorImage}
                                                                alt="Color"
                                                                width="30"
                                                                height="30"
                                                                className="rounded-circle border"
                                                                style={{ objectFit: "cover" }}
                                                            />
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    {item.selected_variant && (
                                                        <div>
                                                            <small>
                                                                {item.selected_variant.attribute}:{" "}
                                                                {item.selected_variant.value}
                                                            </small>
                                                        </div>
                                                    )}
                                                    {item.size && (
                                                        <div>
                                                            <small>Size: {item.size.size}</small>
                                                        </div>
                                                    )}
                                                </td>
                                                <td>{item.qty}</td>
                                                <td>{item.unitPrice} TK</td>
                                                <td>{item.totalPrice} TK</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="row">
                        <div className="col-md-6 offset-md-6">
                            <div className="card bg-light">
                                <div className="card-body">
                                    <h5 className="card-title border-bottom pb-2">
                                        Order Summary
                                    </h5>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Subtotal:</span>
                                        <span>{order.subtotal || order.total - order.shipping_cost} TK</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Shipping Cost:</span>
                                        <span>{order.shipping_cost} TK</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2 border-top pt-2">
                                        <strong>Total Amount:</strong>
                                        <strong>{order.total} TK</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Notes */}
                    <div className="row mt-4">
                        <div className="col-12 text-center">
                            <p className="text-muted mb-0">
                                Thank you for your business!
                            </p>

                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
        @media print {
          .btn {
            display: none !important;
          }
          .card {
            border: none !important;
            box-shadow: none !important;
          }
          body {
            background: white !important;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
          }
        }
      `}</style>
        </div>
    );
}