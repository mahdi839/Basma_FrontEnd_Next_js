import { getData } from '@/lib/api';
import { getSizes } from "@/lib/GetSize";
import ProductUploadForm from './components/ProductUploadForm';




export default async function EditProductPage({ params }) {
  let productData = null;
  let sizesData = [];

  try {
    // Fetch product data
    const productResponse = await getData(`api/products/${params.id}`);
    productData = productResponse?.data;
    
    // Fetch sizes
     sizesData = await getSizes();
    
    
  } catch (err) {
    return <div>Error loading product data</div>;
  }

  if (!productData) return <div>Product not found</div>;
  
  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Edit Product</h3>
      <ProductUploadForm 
        isEditMode={true}
        initialData={productData}
        sizesData={sizesData}
        productId={params.id}
      />
    </div>
  );
}