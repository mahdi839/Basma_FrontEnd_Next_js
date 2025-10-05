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
    <table className="table table-bordered">
      <thead>
        <tr>
          <th className="text-center">Id</th>
          <th className="text-center">Product</th>
          <th className="text-center">Stock</th>
          <th className="text-center">Purchase Price</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center text-danger">
              No Inventory Available
            </td>
          </tr>
        ) : (
          items.map((stock) => (
            <tr key={stock.id}>
              <td className="text-center">{stock.id}</td>
              <td className="text-center">{stock.product?.title}</td>
              <td className="text-center">{stock.stock}</td>
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
  );
}
