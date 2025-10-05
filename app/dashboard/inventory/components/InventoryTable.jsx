"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function InventoryTable({ stocks }) {
  const [getStocks, setGetStocks] = useState(stocks);

  async function handleDelete(id) {
    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");

    const url = process.env.NEXT_PUBLIC_BACKEND_URL + `api/inventory-management/${id}`;
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
      await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
      Swal.fire({
        title: "Successfully Deleted",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      setGetStocks((prev) => ({
        ...prev,
        data: prev.data.filter((stock) => stock.id !== id),
      }));
    } catch (err) {
      toast.error(err.message);
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
        {getStocks?.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center text-danger">
              No Inventory Available
            </td>
          </tr>
        ) : (
          getStocks?.map((stock) => (
            <tr key={stock.id}>
              <td className="text-center">{stock.id}</td>
              <td className="text-center">{stock.product?.title}</td>
              <td className="text-center">{stock.stock}</td>
              <td className="text-center">{stock.purchase_price}</td>
              <td className="text-center">
                <span className="d-flex gap-3 justify-content-center">
                  <Link href={`/dashboard/inventory/edit/${stock.id}`}>Edit</Link>
                  <span onClick={() => handleDelete(stock.id)} style={{ cursor: "pointer", color: "red" }}>Delete</span>
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
