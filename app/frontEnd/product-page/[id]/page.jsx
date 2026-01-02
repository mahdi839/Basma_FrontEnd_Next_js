import Products from '../components/Products';

export default async function Page({ params }) {
  const { id } = params;

  let product = {};
  let socialLinksData = {};
  let relatedCatgProducts = {};

  // Fetch product details
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/products/${id}`, {
      next: {
        tags: [`products`], // cache tag for this product
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

  // Fetch related category products
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/category_products/${id}`, {
      next: {
        tags: [`category-products-${id}`],
      },
    });

    if (!res.ok) throw new Error('Failed to fetch related products');

    relatedCatgProducts = await res.json();
  } catch (err) {
    relatedCatgProducts = { error: err.message };
  }

  return (
    <Products
      product={product?.data}
      socialLinksData={socialLinksData}
      relatedProducts={relatedCatgProducts}
    />
  );
}
