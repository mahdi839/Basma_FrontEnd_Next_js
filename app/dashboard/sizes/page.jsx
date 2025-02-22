import { getData } from "@/lib/api";
import SizeTable from "./SizeTable"; // Import the client component
import Link from "next/link";

export default async function Page() {
  let sizes = [];
  try {
    sizes = await getData("http://127.0.0.1:8000/api/sizes");
  } catch (err) {
    return <p className="text-center text-danger">Error loading sizes.</p>;
  }

  return (
    <div className="container-fluid my-5">
      <Link href="/dashboard/sizes/add">
        <button className="btn size_btn mb-3">Add Size</button>
      </Link>

      {/* Pass sizes as props to the client component */}
      <SizeTable initialSizes={sizes} />
    </div>
  );
}
