"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@/app/components/dashboard/components/button/Button";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();

  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSize() {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await axios.get(`${base}api/sizes/${id}`);
        setSize(res.data.size);
      } catch {
        toast.error("Size not found");
      }
    }

    if (id) fetchSize();
  }, [id]);

  async function handleUpdate(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL;
      const token = localStorage.getItem("token");

      await axios.put(
        `${base}api/sizes/${id}`,
        { size },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Size updated successfully");
      router.push("/dashboard/sizes");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "420px" }}>
        <h4 className="text-center mb-4">Edit Size</h4>

        <form onSubmit={handleUpdate}>
          <label className="fw-bold mb-2">Size Name</label>

          <input
            type="text"
            className="form-control mb-3"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
          />

          <Button type="submit" className="btn btn-primary w-100">
            {loading ? "Updating..." : "Update Size"}
          </Button>
        </form>
      </div>
    </div>
  );
}
