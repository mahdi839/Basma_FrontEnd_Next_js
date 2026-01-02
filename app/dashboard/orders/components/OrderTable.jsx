// app/dashboard/orders/components/OrderTable.jsx
"use client";
import PageLoader from "@/app/components/loader/pageLoader";
import District from "@/app/frontEnd/checkout/components/District";
import React, { useState } from "react";
import ProductFilter from "./ProductFilter";
import axios from "axios";
import { toast } from "react-toastify";
import useFormatDate from "@/app/hooks/useFormatDate";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { FaPrint } from "react-icons/fa";
import './orderTable.css'
import Link from "next/link";
export default function OrderTable({
  loading,
  orders,
  filters,
  onApplyFilters,
  onResetFilters,
}) {
  const [draftFilters, setDraftFilters] = useState(filters);
  const [loadingStates, setLoadingStates] = useState({});
  const { formatDate } = useFormatDate();

  // Sync with parent filters when they change
  React.useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDraftFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApplyFilters(draftFilters);
  };

  const handleReset = () => {
    onResetFilters();
  };

  // Special handler for react-select components
  const handleSelectChange = (name) => (selectedOption) => {
    setDraftFilters((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  async function handleStatus(e, orderId) {
    let token = null;

    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }

    if (!token) {
      toast.error("No auth token found");
      return;
    }
    let updatedStatus = e.target.value;
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + `api/order_status/${orderId}`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Successfully Updated!");
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  async function handleCourierEntry(orderId, courierType) {
    if (!courierType) return;

    setLoadingStates(prev => ({ ...prev, [orderId]: true }));

    let token = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }

    if (!token) {
      toast.error("No auth token found");
      setLoadingStates(prev => ({ ...prev, [orderId]: false }));
      return;
    }

    try {
      if (courierType === "pathao") {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/pathao/orders/${orderId}/create`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          toast.success("Pathao courier entry created successfully!");
          // Update the order in the local state
          window.location.reload(); // Or update state properly
        } else {
          toast.error(data.message || "Failed to create courier entry");
        }
      } else if (courierType === "steadfast") {
        // Steadfast logic here (keep your existing code)
        toast.info("Steadfast integration coming soon");
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || "Failed to create courier entry";
      toast.error(msg);
    } finally {
      setLoadingStates(prev => ({ ...prev, [orderId]: false }));
    }
  }

  return (
    <div className="card">
      {/* Filter Section - Same for all screens */}
      <div className="card-header bg-light py-3">
        <div className="row g-3">
          {/* Search Input */}
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search name/phone..."
              name="search"
              value={draftFilters.search}
              onChange={handleFilterChange}
            />
          </div>

          {/* Min/Max Amount */}
          <div className="col-md-3">
            <div className="input-group">
              <span className="input-group-text">৳</span>
              <input
                type="number"
                className="form-control"
                placeholder="Min"
                name="min"
                value={draftFilters.min}
                onChange={handleFilterChange}
              />
              <span className="input-group-text">-</span>
              <input
                type="number"
                className="form-control"
                placeholder="Max"
                name="max"
                value={draftFilters.max}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="col-md-3">
            <div className="input-group">
              <input
                type="date"
                className="form-control"
                name="start_date"
                value={draftFilters.start_date}
                onChange={handleFilterChange}
              />
              <span className="input-group-text">to</span>
              <input
                type="date"
                className="form-control"
                name="end_date"
                value={draftFilters.end_date}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="col-md-3">
            <select
              className="form-select"
              name="status"
              value={draftFilters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="placed">Placed</option>
              <option value="cancelled">Cancelled</option>
              <option value="processing">Processing</option>
            </select>
          </div>

          {/* District Filter */}
          <div className="col-md-3 mt-2">
            <label className="form-label small mb-1">District</label>
            <District
              value={draftFilters.district}
              onChange={handleSelectChange("district")}
            />
          </div>

          {/* Product Filter */}
          <div className="col-md-3 mt-2">
            <label className="form-label small mb-1">Product</label>
            <ProductFilter
              value={draftFilters.product_title}
              onChange={handleSelectChange("product_title")}
            />
          </div>

          {/* Action Buttons */}
          <div className="col-md-3 d-flex align-items-end">
            <button className="btn btn-primary me-2" onClick={handleApply}>
              <i className="bi bi-funnel me-1"></i> Apply Filters
            </button>
            <button className="btn btn-outline-secondary" onClick={handleReset}>
              <i className="bi bi-arrow-repeat me-1"></i> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table for Large Screens */}
      <div className="card-body d-none d-md-block">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="bg-light">
              <tr>
                <th>#</th>
                <th>Customer Info</th>
                <th>Ordered Products</th>
                <th>Order Summary</th>
                <th>Status</th>
                <th>Courier Entry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className={`${index + 1 !== orders.length ? "border" : ""}`}
                  >
                    <td>{index + 1}</td>
                    <td>
                      <h6 className="mb-0">
                        Name: {order.name || "N/A"}{" "}
                        <span
                          className={`badge ${order.customer_type === "Repeat Customer"
                            ? "bg-warning"
                            : "bg-info"
                            } text-dark`}
                        >
                          {order.customer_type}
                        </span>
                      </h6>
                      <small>
                        <strong>Order Date:</strong> {formatDate(order.created_at || "")}
                      </small>
                      <br />
                      <small>
                        <strong>Phone:</strong> {order.phone || "N/A"}
                      </small>
                      <br />
                      <small>
                        <strong>Address:</strong> {order.address || "N/A"}
                      </small>
                      <br />
                      <small>
                        <strong>District:</strong> {order.district || "N/A"}
                      </small>
                    </td>
                    <td>
                      {order.order_items?.map((item, itemIndex) => (
                        <div key={item.id}>
                          <strong>{`${itemIndex + 1}.`}</strong> {item.title} (qty:
                          {item.qty} x Price: {item.unitPrice} = {item.totalPrice}) -
                          {item.selected_variant && (
                            <div>
                              <strong>
                                {item?.selected_variant?.attribute ?? ""}:
                              </strong>{" "}
                              {item?.selected_variant?.value ?? ""}
                            </div>
                          )}
                          {item.colorImage && (
                            <div className="d-flex gap-2">
                              <strong className="mt-3">Color Image:</strong>
                              <Zoom>
                                <img
                                  width={50}
                                  height={50}
                                  src={item?.colorImage ?? ""}
                                  alt=""
                                  className="rounded-circle border"
                                  style={{ objectFit: 'cover' }}
                                />
                              </Zoom>
                            </div>
                          )}
                          {item.size && (
                            <div className="d-flex gap-2">
                              <strong>Size:</strong>
                              <span>{item?.size?.size ?? "no size found"}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </td>
                    <td>
                      <p>
                        <strong>Shipping Cost:</strong> {order.shipping_cost}
                      </p>
                      <p>
                        <strong>Payment Method:</strong> {order.payment_method}
                      </p>
                      <p>
                        <strong>Total:</strong> {order.total} TK
                      </p>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={order.status}
                        onChange={(e) => handleStatus(e, order.id)}
                        name="status"
                      >
                        <option value="cancel">Cancel</option>
                        <option value="delivered">Delivered</option>
                        <option value="placed">Placed</option>
                        <option value="pending">Pending</option>
                      </select>
                    </td>
                    <td>
                      {order.courier_entry ? (
                        <span className="badge bg-success">Success</span>
                      ) : (
                        <select
                          className="form-select form-select-sm"
                          onChange={(e) => handleCourierEntry(order.id, e.target.value)}
                          disabled={loadingStates[order.id]}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            {loadingStates[order.id] ? "Processing..." : "Select Courier"}
                          </option>
                          <option value="pathao">Entry Pathao</option>
                          {/* <option value="steadfast">Entry Steadfast</option> */}
                        </select>
                      )}
                    </td>

                    <td className="d-flex gap-2">
                      {/* <button className="btn btn-sm btn-primary">View</button> */}
                      <Link href={`/dashboard/orders/invoice/${order.id}`}>
                        <button
                          className="order_print_btn"
                          style={{ border: 'none', outline: 'none', background: 'none' }}
                          title="Print Invoice"
                        >
                          <FaPrint className="order_print_btn_icon" size={22} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards for Mobile Screens */}
      <div className="card-body d-block d-md-none">
        {orders.length > 0 ? (
          <div className="row">
            {orders.map((order, index) => (
              <div key={order.id} className="col-12 mb-3">
                <div className="card border">
                  <div className="card-header bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Order #{index + 1}</h6>
                      <span
                        className={`badge ${order.customer_type === "Repeat Customer"
                          ? "bg-warning"
                          : "bg-info"
                          } text-dark`}
                      >
                        {order.customer_type}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    {/* Customer Info */}
                    <div className="mb-3">
                      <h6 className="border-bottom pb-2">Customer Information</h6>
                      <p className="mb-1">
                        <strong>Name:</strong> {order.name || "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>Phone:</strong> {order.phone || "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>Address:</strong> {order.address || "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>District:</strong> {order.district || "N/A"}
                      </p>
                      <p className="mb-0">
                        <strong>Order Date:</strong> {formatDate(order.created_at || "")}
                      </p>
                    </div>

                    {/* Ordered Products */}
                    <div className="mb-3">
                      <h6 className="border-bottom pb-2">Ordered Products</h6>
                      {order.order_items?.map((item, itemIndex) => (
                        <div key={item.id} className="mb-2 p-2 border rounded">
                          <strong>
                            {itemIndex + 1}. {item.title}
                          </strong>
                          <div className="small">
                            Qty: {item.qty} × {item.unitPrice} = {item.totalPrice}
                          </div>
                          {item.selected_variant && (
                            <div className="small">
                              <strong>{item?.selected_variant?.attribute ?? ""}:</strong>{" "}
                              {item?.selected_variant?.value ?? ""}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mb-3">
                      <h6 className="border-bottom pb-2">Order Summary</h6>
                      <p className="mb-1">
                        <strong>Shipping Cost:</strong> {order.shipping_cost}
                      </p>
                      <p className="mb-1">
                        <strong>Payment Method:</strong> {order.payment_method}
                      </p>
                      <p className="mb-0">
                        <strong>Total:</strong> {order.total} TK
                      </p>
                    </div>

                    {/* Status, Courier Entry and Actions */}
                    <div className="row">
                      <div className="col-6 mb-2">
                        <strong>Status</strong>
                        <select
                          className="form-select form-select-sm mt-1"
                          value={order.status}
                          onChange={(e) => handleStatus(e, order.id)}
                          name="status"
                        >
                          <option value="cancel">Cancel</option>
                          <option value="delivered">Delivered</option>
                          <option value="placed">Placed</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                      <div className="col-6 mb-2">
                        <strong>Courier Entry</strong>
                        <div className="mt-1">
                          {order.courier_entry ? (
                            <span className="badge bg-success w-100">Success</span>
                          ) : (
                            <select
                              className="form-select form-select-sm"
                              onChange={(e) => handleCourierEntry(order.id, e.target.value)}
                              disabled={loadingStates[order.id]}
                              defaultValue=""
                            >
                              <option value="" disabled>
                                {loadingStates[order.id] ? "Processing..." : "Select"}
                              </option>
                              <option value="pathao">Pathao</option>
                              <option value="steadfast">Steadfast</option>
                            </select>
                          )}
                        </div>
                      </div>
                      // In the mobile cards:
                      <div className="d-flex gap-5">
                        <div className="col-6">
                          <button className="btn btn-sm btn-primary w-100">View</button>
                        </div>
                        <div className="col-6">
                          <Link href={`/dashboard/orders/invoice/${order.id}`}>
                            <button
                              className="order_print_btn w-100"
                              style={{ border: 'none', outline: 'none', background: 'none' }}
                            >
                              <FaPrint className="order_print_btn_icon" size={22} />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">No orders found</div>
        )}
      </div>
    </div>
  );
}