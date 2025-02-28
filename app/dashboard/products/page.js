import { getData } from '@/lib/api';
import ProductTable from './components/ProductTable'; // Import the client component
import Link from 'next/link';
import Button from '@/app/components/dashboard/components/button/Button';

export default async function ProductIndexPage() {
  let productData = [];
  try {
    let response = await getData('api/products');
    productData = response?.data || [];
  } catch (err) {
    return <div>An error occurred</div>;
  }

  return (
    <div className="container-fluid py-4">
      <Link href="/dashboard/products/add_product">
        <Button className="mb-3">Add Product</Button>
      </Link>
      <ProductTable productData={productData} /> {/* Pass data to client component */}
    </div>
  );
}
