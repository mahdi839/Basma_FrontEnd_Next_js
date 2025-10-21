"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function InventoryTable({ stocks = [] }) {
  // Normalize: accept either an array or { data: [...] }
  const initial = Array.isArray(stocks) ? stocks : stocks?.data ?? [];
  const [items, setItems] = useState(initial);

  async function handleDelete(id) {
    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");

    const url =
      process.env.NEXT_PUBLIC_BACKEND_URL + `api/inventory-management/${id}`;

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
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        title: "Successfully Deleted",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      // Keep it an array
      setItems((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      toast.error(err?.message || "Delete failed");
    }
  }

  return (
    <>
      {/* Table for large screens */}
      <div className="d-none d-md-block">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Product</th>
              <th className="text-center">Stock</th>
              <th className="text-center">Variant</th>
              <th className="text-center">Purchase Price</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-danger">
                  No Inventory Available
                </td>
              </tr>
            ) : (
              items.map((stock, index) => (
                <tr key={stock.id}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{stock.product?.title}</td>
                  <td className="text-center">{stock.stock}</td>
                  <td className="text-center">{stock.variant.value ?? "N/A"}</td>
                  <td className="text-center">{stock.purchase_price}</td>
                  <td className="text-center">
                    <span className="d-flex gap-3 justify-content-center">
                      <Link href={`/dashboard/inventory/edit/${stock.id}`}>
                        <FaEdit className="text-dark" />
                      </Link>
                      <FaTrash
                        onClick={() => handleDelete(stock.id)}
                        className="text-danger mt-2"
                        style={{ cursor: "pointer" }}
                      />
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile screens */}
      <div className="d-block d-md-none">
        {items.length === 0 ? (
          <div className="text-center text-danger p-4">
            No Inventory Available
          </div>
        ) : (
          <div className="row">
            {items.map((stock, index) => (
              <div key={stock.id} className="col-12 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">
                        <strong>#</strong>
                        <p>{index + 1}</p>
                      </div>
                      <div className="col-6">
                        <strong>Product</strong>
                        <p className="text-truncate">{stock.product?.title}</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <strong>Stock</strong>
                        <p>{stock.stock}</p>
                      </div>
                      <div className="col-6">
                        <strong>Variant</strong>
                        <p>{stock.variant.value ?? "N/A"}</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <strong>Purchase Price</strong>
                        <p>{stock.purchase_price}</p>
                      </div>
                      <div className="col-6">
                        <strong>Actions</strong>
                        <div className="d-flex gap-3 mt-1">
                          <Link href={`/dashboard/inventory/edit/${stock.id}`}>
                            <FaEdit className="text-dark" />
                          </Link>
                          <FaTrash
                            onClick={() => handleDelete(stock.id)}
                            className="text-danger"
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}