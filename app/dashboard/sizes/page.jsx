'use client'
import { useState, useEffect } from "react";
import { getSizes } from "@/lib/GetSize";
import SizeTable from "./SizeTable"; // Import the client component
import Link from "next/link";
import Button from "@/app/components/dashboard/components/button/Button";
import DynamicLoader from "@/app/components/loader/dynamicLoader";

export default function Page() {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true); // To show a loading state while fetching

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSizes(); // Fetch sizes data
        setSizes(data); // Store data in state
      } catch (err) {
        console.error("Error fetching sizes:", err);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData(); // Call the fetch function on mount
  }, []); // Empty dependency array ensures it runs only once (on mount)

  if (loading) {
    return <DynamicLoader />; // Show loading message or spinner while data is being fetched
  }

  return (
    <div className="container-fluid my-5">
      <Link href="/dashboard/sizes/add">
        <Button className="mb-3">Add Size</Button>
      </Link>

      {/* Pass sizes as props to the client component */}
      <SizeTable initialSizes={sizes} />
    </div>
  );
}
