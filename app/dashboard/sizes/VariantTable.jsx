"use client";

import { useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import useDeleteItem from "@/app/hooks/useDeleteItem";

export default function VariantTable({ initialVariants }) {
  const [variants, setVariants] = useState(initialVariants);
  const { handleDeleteData } = useDeleteItem();

  async function handleDelete(id) {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + `api/product-variants/${id}`;
    await handleDeleteData(url);
    setVariants((prev) => prev.filter((v) => v.id !== id));
  }

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th className="text-center">ID</th>
          <th className="text-center">Product</th>
          <th className="text-center">Attribute</th>
          <th className="text-center">Value</th>
          <th className="text-center">Price</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {variants.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center text-danger">
              No Variants Available
            </td>
          </tr>
        ) : (
          variants.map((v) => (
            <tr key={v.id}>
              <td className="text-center">{v.id}</td>
              <td className="text-center">{v.product?.title ?? "-"}</td>
              <td className="text-center">{v.attribute}</td>
              <td className="text-center">{v.value}</td>
              <td className="text-center">{v.price ?? "— (uses base_price)"}</td>
              <td className="text-center">
                <span className="d-flex gap-3 justify-content-center">
                  <Link href={`/dashboard/sizes/edit/${v.id}`}>
                    <FaEdit className="text-dark" />
                  </Link>
                  <FaTrash
                    className="text-danger mt-2"
                    onClick={() => handleDelete(v.id)}
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
