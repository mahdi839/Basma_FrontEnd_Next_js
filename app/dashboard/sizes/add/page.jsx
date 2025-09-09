"use client"
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Button from "@/app/components/dashboard/components/button/Button";
import useStoreData from "@/app/hooks/useStoreData";
export default function Page() {
  const [size, setSize] = useState("");
  const router = useRouter();
  const { storeData, loading } = useStoreData();


  async function storeSize(e) {
    e.preventDefault();
    const sizeUrl = process.env.NEXT_PUBLIC_BACKEND_URL + 'api/sizes';
    storeData(sizeUrl, { size }, "Size added successfully");
  }


  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h4 className="text-center mb-4">Add Size</h4>

        <form onSubmit={storeSize}>
          <div className="form-group">
            <label htmlFor="size" className="fw-bold">Size:</label>
            <input type="text" className="form-control" id="size" name="size" placeholder="Enter size" onChange={(e) => setSize(e.target.value)} />
          </div>
          <Button type="submit" className="btn btn-primary w-100 mt-3">{loading ? "Adding..." : "Add Size"}</Button>
        </form>
      </div>
    </div>
  );
}
