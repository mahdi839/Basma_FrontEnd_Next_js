"use client"; // Mark this as a Client Component

import axios from "axios";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useDeleteItem from "@/app/hooks/useDeleteItem";
export default function SizeTable({ initialSizes }) {
  const [sizes, setSizes] = useState(initialSizes); // Manage state

  const {handleDeleteData} = useDeleteItem()
  async function handleDelete(id) {
    const url = process.env.BACKEND_URL + `api/sizes/${id}`
    handleDeleteData(url)
      // Remove deleted size from the state without page reload
      setSizes(sizes.filter((size) => size.id !== id));

  }

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th className="text-center">Id</th>
          <th className="text-center">Sizes</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {sizes.length === 0 ? (
          <tr>
            <td colSpan="3" className="text-center text-danger">
              No Sizes Available
            </td>
          </tr>
        ) : (
          sizes.map((size) => (
            <tr key={size.id}>
              <td className="text-center">{size.id}</td>
              <td className="text-center">{size.size}</td>
              <td className="text-center">
                <span className="d-flex gap-3 justify-content-center ">
                  <Link href={`/dashboard/sizes/edit/${size.id}`}>
                    <FaEdit className="text-dark"/>
                  </Link>
                  <FaTrash className="text-danger mt-2" onClick={() => handleDelete(size.id)} style={{cursor:'pointer'}}/>
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
