// app/dashboard/orders/components/OrderTable.jsx
"use client";
import PageLoader from "@/app/components/loader/pageLoader";
import District from "@/app/frontEnd/checkout/components/District";
import React, { useState } from "react";
import ProductFilter from "./ProductFilter";
import axios from "axios";
import { toast } from "react-toastify";

export default function OrderTable({
  loading,
  orders,
  filters,
  onApplyFilters,
  onResetFilters,
}) {
  const [draftFilters, setDraftFilters] = useState(filters);

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
        process.env.BACKEND_URL + `api/order_status/${orderId}`,
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

  return (
    <div className="card">
      {/* Filter Section */}
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
              <option value="completed">placed</option>
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

      {/* Table Section */}
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="bg-light">
              <tr>
                <th>#</th>
                <th>Customer Info</th>
                <th>Ordered Products</th>
                <th>Order Summary</th>
                <th>Status</th>
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
                      <h6 className="mb-0">Name: {order.name || "N/A"}</h6>
                      <small>
                        {" "}
                        <strong>Order Date:</strong> {order.created_at || "N/A"}
                      </small>{" "}
                      <br />
                      <small>
                        {" "}
                        <strong>Phone:</strong> {order.phone || "N/A"}
                      </small>{" "}
                      <br />
                      <small>
                        {" "}
                        <strong>Address:</strong> {order.address || "N/A"}
                      </small>{" "}
                      <br />
                      <small>
                        {" "}
                        <strong>District:</strong> {order.district || "N/A"}
                      </small>
                    </td>
                    <td>
                      {order.order_items?.map((item, itemIndex) => (
                        <div key={item.id}>
                          <strong> {`${itemIndex + 1}.`} </strong>
                          {item.title} (qty:{item.qty} x Price: {item.unitPrice}{" "}
                          = {item.totalPrice} )
                        </div>
                      ))}
                    </td>
                    <td>
                      <p>
                        {" "}
                        <strong>Shipping Cost:</strong> {order.shipping_cost}{" "}
                      </p>
                      <p>
                        {" "}
                        <strong>Payment Method:</strong> {order.payment_method}{" "}
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
                      <button className="btn btn-sm btn-primary">View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
