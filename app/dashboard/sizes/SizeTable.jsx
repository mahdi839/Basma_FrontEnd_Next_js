"use client";
import { useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import useDeleteItem from "@/app/hooks/useDeleteItem";

export default function SizeTable({ initialSizes }) {
  const [sizes, setSizes] = useState(initialSizes);
  const { handleDeleteData } = useDeleteItem();

  async function handleDelete(id) {
    const url =
      process.env.NEXT_PUBLIC_BACKEND_URL + `api/sizes/${id}`;

    const success = await handleDeleteData(url);
    if (success) {
      setSizes((prev) => prev.filter((s) => s.id !== id));
    }
  }

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th className="text-center">ID</th>
          <th className="text-center">Size</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {sizes.length === 0 ? (
          <tr>
            <td colSpan="3" className="text-center text-danger">
              No Sizes Found
            </td>
          </tr>
        ) : (
          sizes.map((size) => (
            <tr key={size.id}>
              <td className="text-center">{size.id}</td>
              <td className="text-center fw-bold">{size.size}</td>

              <td className="text-center">
                <div className="d-flex gap-3 justify-content-center">
                  <Link href={`/dashboard/sizes/edit/${size.id}`}>
                    <FaEdit style={{ cursor: "pointer" }} />
                  </Link>

                  <FaTrash
                    className="text-danger mt-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(size.id)}
                  />
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
