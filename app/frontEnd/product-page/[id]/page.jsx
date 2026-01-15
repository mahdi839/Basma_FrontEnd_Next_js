import Products from '../components/Products';

export default async function Page({ params }) {
  const { id } = params;

  let product = {};
  let socialLinksData = {};
  let relatedProductsData = {};

  // Fetch product details
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/products/${id}`, {
      next: {
        tags: [`products`],
      },
    });

    if (!res.ok) throw new Error('Failed to fetch product data');
    product = await res.json();
  } catch (err) {
    product = { error: err.message };
  }

  // Fetch social links
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/social-links-first`, {
      next: {
        tags: ['social-links'],
      },
    });

    if (!res.ok) throw new Error('Failed to fetch social links');
    socialLinksData = await res.json();
  } catch (err) {
    socialLinksData = { error: err.message };
  }

  // Fetch first page of related products (page=1)
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/category_products/${id}?page=1`,
      {
        next: {
          tags: [`category-products`],
        },
      }
    );

    if (!res.ok) throw new Error('Failed to fetch related products');
    relatedProductsData = await res.json();
  } catch (err) {
    relatedProductsData = { error: err.message, data: [], pagination: {} };
  }

  return (
    <Products
      product={product?.data}
      socialLinksData={socialLinksData}
      initialRelatedProducts={relatedProductsData.data || []}
      relatedPagination={relatedProductsData.pagination || {}}
      productId={id}
    />
  );
}