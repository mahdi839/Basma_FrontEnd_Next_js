"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Button from "@/app/components/dashboard/components/button/Button";
import DynamicLoader from "@/app/components/loader/dynamicLoader";
import SizeTable from "./SizeTable";

export default function Page() {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchSizes() {
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await axios.get(`${base}api/sizes`);
      setSizes(res.data || []);
    } catch (err) {
      console.error("Failed to fetch sizes", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSizes();
  }, []);

  if (loading) return <DynamicLoader />;

  return (
    <div className="container-fluid my-5">
      <Link href="/dashboard/sizes/add">
        <Button className="mb-3">Add Size</Button>
      </Link>

      <SizeTable initialSizes={sizes} />
    </div>
  );
}
