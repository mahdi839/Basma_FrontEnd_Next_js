"use client";
import { useState } from "react";
import Button from "@/app/components/dashboard/components/button/Button";
import useStoreData from "@/app/hooks/useStoreData";
import { useRouter } from "next/navigation";

export default function Page() {
  const [size, setSize] = useState("");
  const { storeData, loading } = useStoreData();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "api/sizes";

    await storeData(
      url,
      { size },
      "Size created successfully"
    );

    router.push("/dashboard/sizes");
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "420px" }}>
        <h4 className="text-center mb-4">Add Size</h4>

        <form onSubmit={handleSubmit}>
          <label className="fw-bold mb-2">Size Name</label>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Example: S, M, L, XL, 40, 42"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
          />

          <Button type="submit" className="btn btn-primary w-100">
            {loading ? "Saving..." : "Create Size"}
          </Button>
        </form>
      </div>
    </div>
  );
}
