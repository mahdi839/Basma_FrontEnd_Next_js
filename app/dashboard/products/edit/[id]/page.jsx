import { getData } from "@/lib/api";
import { getSizes } from "@/lib/GetSize";
import ProductUpdateForm from "./components/ProductUpdateForm";

export default async function EditProductPage({ params }) {
  let productData = null;
  let sizesData = [];
  let categoryData = [];
  try {
    // Fetch product data
    const productResponse = await getData(`api/products/${params.id}`);
    productData = productResponse?.data;
    // Fetch sizes
    sizesData = await getSizes();
    //  fetch categories
    categoryData = await getData("api/categories");
  } catch (err) {
    console.log(err)
  }
  if (!productData) return <div>Product not found</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Edit Product</h3>
      <ProductUpdateForm
        isEditMode={true}
        initialData={productData}
        sizesData={sizesData}
        categoryData={categoryData}
        productId={params.id}
      />
    </div>
  );
}
