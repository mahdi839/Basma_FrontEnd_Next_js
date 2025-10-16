"use client";
import useIndexData from "@/app/hooks/useIndexData";
import React, { useEffect, useState } from "react";

export default function IncompleteOrder() {
  const { indexData, loading, data } = useIndexData();
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}api/abandoned-checkouts`;

    // 🧩 Add date filters as query params
    const params = [];
    if (filters.start_date) params.push(`start_date=${filters.start_date}`);
    if (filters.end_date) params.push(`end_date=${filters.end_date}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    indexData(url);
  };

  // 🧠 Helper to format date/time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

          <button className="btn btn-primary" onClick={fetchData}>
            Filter
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Cart Items</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((order, index) => {
                  let cartItems = [];
                  try {
                    cartItems = JSON.parse(order.cart_items || "[]");
                  } catch (error) {
                    console.error("Invalid cart_items JSON:", error);
                  }

                  return (
                    <tr key={order.id}>
                      <td>{index + 1}</td>
                      <td>{order.name}</td>
                      <td>{order.phone}</td>
                      <td>{order.address}</td>
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
                                      Qty: {item.qty} | Price: ৳{item.unitPrice}
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
                      <td>{formatDate(order.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
