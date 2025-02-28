import { getSizes } from "@/lib/GetSize";
import SizeTable from "./SizeTable"; // Import the client component
import Link from "next/link";
import Button from "@/app/components/dashboard/components/button/Button";

export default async function Page() {
  let sizes = [];
  try {
    sizes = await getSizes();
  } catch (err) {
    return <p className="text-center text-danger">Error loading sizes.</p>;
  }

  return (
    <div className="container-fluid my-5">
      <Link href="/dashboard/sizes/add">
        <Button className='mb-3'>Add Size</Button>
      </Link>

      {/* Pass sizes as props to the client component */}
      <SizeTable initialSizes={sizes} />
    </div>
  );
}
