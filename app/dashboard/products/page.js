import { getData } from '@/lib/api';
import ProductTable from './components/ProductTable';
import Link from 'next/link';

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

  console.log(productData);
  console.log('hi')
  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 fw-bold text-gray-800">Products</h1>
          <p className="text-muted mb-0">Manage your product catalog</p>
        </div>
        <Link href="/dashboard/products/add_product">
          <button className="btn btn-primary px-4 py-2 fw-semibold">
            <i className="fas fa-plus me-2"></i>
            Add Product
          </button>
        </Link>
      </div>
      <ProductTable productData={productData} />
    </div>
  );
}