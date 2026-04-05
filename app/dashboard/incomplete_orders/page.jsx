"use client";
import useFormatDate from "@/app/hooks/useFormatDate";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "../orders/components/Pagination";
import PageLoader from "@/app/components/loader/pageLoader";

export default function IncompleteOrder() {
  const [loading, setLoading] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
  });

  useEffect(() => {
    fetchData();
  }, [page]);

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const fetchData = async () => {
    const token = getToken();

    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}api/abandoned-checkouts?page=${page}`;

    const params = [];
    if (filters.start_date) params.push(`start_date=${filters.start_date}`);
    if (filters.end_date) params.push(`end_date=${filters.end_date}`);
    if (filters.status) params.push(`status=${filters.status}`);
    if (params.length > 0) url += `&${params.join("&")}`;

    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data) {
        setData(response.data.data.data || []);
        setPagination({
          current_page: response.data.data.current_page || 1,
          last_page: response.data.data.last_page || 1,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchData();
  };

  const handleResetFilters = () => {
    setFilters({
      start_date: "",
      end_date: "",
      status: "",
    });
    setPage(1);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const token = getToken();

    setStatusLoadingId(orderId);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/dashboard/abandoned-checkouts/${orderId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData((prev) =>
        prev.map((item) =>
          item.id === orderId ? { ...item, status: newStatus } : item
        )
      );

      toast.success(response.data.message || "Status updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setStatusLoadingId(null);
    }
  };

  const { formatDate } = useFormatDate();

  return (
    <div className="container-fluid py-4">
      <div className="card mb-3 p-3">
        <div className="d-flex gap-3 align-items-end flex-wrap">
          <div>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={filters.start_date}
              onChange={(e) =>
                setFilters({ ...filters, start_date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={filters.end_date}
              onChange={(e) =>
                setFilters({ ...filters, end_date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="placed">Placed</option>
              <option value="cancelled">Cancelled</option>
              <option value="processing">Processing</option>
              <option value="returned">Returned</option>
              <option value="first_call">1st Call Done</option>
              <option value="second_call">2nd Call Done</option>
              <option value="third_call">3rd Call Done</option>
              <option value="stock_sold">Stock Sold</option>
              <option value="shipped_to_you">Shipped To You</option>
              <option value="received_in_bd">Received In BD</option>
              <option value="order_sent_to_china">Order Sent To China</option>
              <option value="file_completed">File Completed</option>
              <option value="order_confirmed">Order Confirmed</option>
            </select>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleApplyFilters}
            disabled={loading}
          >
            {loading ? "Loading..." : "Filter"}
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleResetFilters}
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <PageLoader />
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Cart Items</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((order, index) => {
                        let cartItems = [];
                        try {
                          cartItems = JSON.parse(order.cart_items || "[]");
                        } catch (error) {
                          console.error("Invalid cart_items JSON:", error);
                        }

                        return (
                          <tr key={order.id}>
                            <td>
                              {(pagination.current_page - 1) * 20 + index + 1}
                            </td>
                            <td>{order.name || "-"}</td>
                            <td>{order.phone || "-"}</td>
                            <td>{order.address || "-"}</td>
                            <td>
                              {cartItems.length > 0 ? (
                                <ul className="m-0 p-0 list-unstyled">
                                  {cartItems.map((item, i) => (
                                    <li key={i} className="mb-2">
                                      <div className="d-flex align-items-center gap-2">
                                        <img
                                          src={item.image}
                                          alt={item.title}
                                          width="40"
                                          height="40"
                                          style={{
                                            borderRadius: "5px",
                                            objectFit: "cover",
                                          }}
                                        />
                                        <div>
                                          <strong>{item.title}</strong>
                                          <div className="small text-muted">
                                            Qty: {item.qty} | Price: ৳
                                            {item.unitPrice}
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-muted">No items</span>
                              )}
                            </td>
                            <td style={{ minWidth: "180px" }}>
                              <select
                                className="form-select"
                                value={order.status || "pending"}
                                disabled={statusLoadingId === order.id}
                                onChange={(e) =>
                                  handleStatusChange(order.id, e.target.value)
                                }
                              >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="placed">Placed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="processing">Processing</option>
                                <option value="returned">Returned</option>
                                <option value="first_call">1st Call Done</option>
                                <option value="second_call">2nd Call Done</option>
                                <option value="third_call">3rd Call Done</option>
                                <option value="stock_sold">Stock Sold</option>
                                <option value="shipped_to_you">Shipped To You</option>
                                <option value="received_in_bd">Received In BD</option>
                                <option value="order_sent_to_china">Order Sent To China</option>
                                <option value="file_completed">File Completed</option>
                                <option value="order_confirmed">Order Confirmed</option>
                              </select>
                              {statusLoadingId === order.id && (
                                <small className="text-muted">
                                  Updating...
                                </small>
                              )}
                            </td>
                            <td>{formatDate(order.created_at)}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          No incomplete orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {pagination.last_page > 1 && (
                <Pagination
                  page={page}
                  setPage={setPage}
                  pagination={pagination}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}