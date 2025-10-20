import { getData } from '@/lib/api';
import ProductTable from './components/ProductTable';
import Link from 'next/link';
import Button from '@/app/components/dashboard/components/button/Button';

export default async function ProductIndexPage() {
  let productData = [];
  try {
    let response = await getData('api/products');
    productData = response?.data || [];
  } catch (err) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger" role="alert">
          An error occurred while loading products
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Products</h1>
          <p className="text-muted mb-0">Manage your product inventory</p>
        </div>
        <Link href="/dashboard/products/add_product">
          <Button className="mb-0">
            <i className="fas fa-plus me-2"></i>
            Add Product
          </Button>
        </Link>
      </div>
      <ProductTable productData={productData} />
    </div>
  );
}