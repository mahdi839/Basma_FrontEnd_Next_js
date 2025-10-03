'use client'
import { useState, useEffect } from "react";
import VariantTable from "./VariantTable";
import Link from "next/link";
import Button from "@/app/components/dashboard/components/button/Button";
import DynamicLoader from "@/app/components/loader/dynamicLoader";
import axios from "axios";

export default function Page() {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchVariants() {
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await axios.get(`${base}api/product-variants`);
      // your controller returns { data: [], meta: {} }
      setVariants(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching variants:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVariants();
  }, []);

  if (loading) return <DynamicLoader />;

  return (
    <div className="container-fluid my-5">
      <Link href="/dashboard/sizes/add">
        <Button className="mb-3">Add Variant</Button>
      </Link>
      <VariantTable initialVariants={variants} />
    </div>
  );
}
