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
            {/* Action Buttons - Hidden in Print */}
            <div className="d-flex justify-content-between align-items-center mb-4 no-print">
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
            <div className="card shadow-lg invoice-card">
                <div className="card-body p-4 p-print-2">
                    {/* Header Section */}
                    <div className="row mb-4 border-bottom pb-4">
                        <div className="col-6">
                            {companyLogo && (
                                <img
                                    src={companyLogo}
                                    alt="Company Logo"
                                    className="mb-3 company-logo"
                                    style={{ maxHeight: "70px" }}
                                />
                            )}
                            <div className="company-info">
                                <h4 className="text-dark mb-1 fw-bold">INVOICE</h4>
                                {companyInfo.address && (
                                    <p className="mb-1 text-muted small">{companyInfo.address}</p>
                                )}
                                {companyInfo.phone && (
                                    <p className="mb-1 text-muted small">Phone: {companyInfo.phone}</p>
                                )}
                                {companyInfo.email && (
                                    <p className="mb-0 text-muted small">Email: {companyInfo.email}</p>
                                )}
                            </div>
                        </div>
                        <div className="col-6 text-end">
                            <div className="invoice-meta">
                                <h5 className="text-dark mb-3 fw-bold">Invoice Details</h5>
                                <p className="mb-1">
                                    <strong>Invoice No:</strong> #{order.order_number}
                                </p>
                                <p className="mb-1">
                                    <strong>Date:</strong> {formatDate(order.created_at)}
                                </p>
                                <p className="mb-0">
                                    <strong>Payment Method:</strong> {order.payment_method}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Billing & Shipping Information */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="billing-info">
                                <h6 className="fw-bold border-bottom pb-2 mb-3">Bill To:</h6>
                                <p className="mb-1 fw-semibold">{order.name}</p>
                                <p className="mb-1 text-muted">{order.address}</p>
                                <p className="mb-1 text-muted">{order.district}</p>
                                <p className="mb-0 text-muted">Phone: {order.phone}</p>
                                {order.delivery_notes && (
                                    <div className="mt-2">
                                        <small className="text-muted">
                                            <strong>Notes:</strong> {order.delivery_notes}
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="table-container">
                                <table className="table table-bordered invoice-table">
                                    <thead className="table-dark">
                                        <tr>
                                            <th width="5%">#</th>
                                            <th width="35%">Product Description</th>
                                            <th width="20%">Variant</th>
                                            <th width="10%" className="text-center">Qty</th>
                                            <th width="15%" className="text-end">Unit Price</th>
                                            <th width="15%" className="text-end">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.order_items?.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        {item.colorImage && (
                                                            <img
                                                                src={item.colorImage}
                                                                alt="Color"
                                                                width="40"
                                                                height="40"
                                                                className="rounded-circle border me-2"
                                                                style={{ objectFit: "cover" }}
                                                            />
                                                        )}
                                                        <span className="fw-medium">{item.title}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    {item.selected_variant && (
                                                        <div className="small">
                                                            {item.selected_variant.attribute}: {item.selected_variant.value}
                                                        </div>
                                                    )}
                                                    {item.size && (
                                                        <div className="small">
                                                            Size: {item.size.size}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="text-center">{item.qty}</td>
                                                <td className="text-end">{item.unitPrice} TK</td>
                                                <td className="text-end fw-semibold">{item.totalPrice} TK</td>
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
                            <div className="order-summary">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="fw-semibold">Subtotal:</td>
                                            <td className="text-end">{order.subtotal || order.total - order.shipping_cost} TK</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-semibold">Shipping Cost:</td>
                                            <td className="text-end">{order.shipping_cost} TK</td>
                                        </tr>
                                        <tr className="table-active">
                                            <td className="fw-bold">Total Amount:</td>
                                            <td className="text-end fw-bold">{order.total} TK</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="row mt-5 pt-3 border-top">
                        <div className="col-12 text-center">
                            <p className="text-muted mb-2 small">
                                Thank you for your business! For any questions, please contact us at {companyInfo.phone || companyInfo.email}
                            </p>
                            <p className="text-muted small mb-0">
                                This is a computer-generated invoice and does not require a physical signature.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Print Styles */}
            <style jsx global>{`
                @media print {
                    /* Hide unnecessary elements */
                    .no-print {
                        display: none !important;
                    }
                    
                    /* Reset body and container styles */
                    body {
                        background: white !important;
                        color: black !important;
                        font-size: 12pt;
                        line-height: 1.4;
                    }
                    
                    .container {
                        max-width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    
                    /* Invoice card styling */
                    .invoice-card {
                        border: none !important;
                        box-shadow: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    
                    .card-body {
                        padding: 20px 15px !important;
                    }
                    
                    /* Ensure proper spacing */
                    .row {
                        margin-left: -8px;
                        margin-right: -8px;
                    }
                    
                    .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, 
                    .col-7, .col-8, .col-9, .col-10, .col-11, .col-12 {
                        padding-left: 8px;
                        padding-right: 8px;
                    }
                    
                    /* Table styling for print */
                    .invoice-table {
                        font-size: 10pt;
                        width: 100%;
                    }
                    
                    .invoice-table th {
                        background-color: #f8f9fa !important;
                        color: #000 !important;
                        border-color: #dee2e6 !important;
                        padding: 8px 6px;
                    }
                    
                    .invoice-table td {
                        padding: 6px;
                        border-color: #dee2e6 !important;
                    }
                    
                    /* Remove background colors that don't print well */
                    .table-dark {
                        background-color: #f8f9fa !important;
                        color: #000 !important;
                    }
                    
                    .table-active {
                        background-color: #f8f9fa !important;
                    }
                    
                    /* Text colors for print */
                    .text-primary, .text-muted {
                        color: #000 !important;
                    }
                    
                    .text-muted {
                        color: #666 !important;
                    }
                    
                    /* Borders */
                    .border-bottom, .border-top {
                        border-color: #000 !important;
                    }
                    
                    /* Company logo sizing for print */
                    .company-logo {
                        max-height: 60px !important;
                    }
                    
                    /* Force page breaks */
                    .invoice-card {
                        page-break-inside: avoid;
                    }
                    
                    .table-container {
                        page-break-inside: avoid;
                    }
                    
                    /* Margins for the printed page */
                    @page {
                        margin: 1cm;
                    }
                }
                
                /* Screen styles */
                @media screen {
                    .invoice-table {
                        font-size: 14px;
                    }
                    
                    .company-logo {
                        max-height: 70px;
                    }
                }
                
                /* Additional responsive styles */
                @media (max-width: 768px) {
                    .card-body {
                        padding: 15px 10px !important;
                    }
                    
                    .invoice-table {
                        font-size: 12px;
                    }
                }
            `}</style>
        </div>
    );
}