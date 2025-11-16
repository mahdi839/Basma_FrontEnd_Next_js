import { getData } from "@/lib/api";
import ProductUpdateForm from "./components/ProductUpdateForm";

export default async function EditProductPage({ params }) {
  let productData = null;
  let categoryData = [];

  try {
    const productResponse = await getData(`api/products/${params.id}`);
    productData = productResponse?.data;

    // categories (your admin endpoint – adjust if needed)
    categoryData = await getData("api/categories");
  } catch (err) {
    console.log(err);
  }

  if (!productData) return <div>Product not found</div>;

  return (
    <div className="container-fluid mt-4">
      <h3 className="mb-4 text-center">Edit Product</h3>
      <ProductUpdateForm
        isEditMode={true}
        initialData={productData}
        categoryData={categoryData}
        productId={params.id}
      />
    </div>
  );
}
