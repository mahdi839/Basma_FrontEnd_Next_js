import Products from '../components/Products';

export default async function Page({ params }) {
  const { id } = params;

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [productRes, socialRes, relatedRes] = await Promise.allSettled([
    fetch(`${backend}api/products/${id}`, {
      next: { tags: ['products'] },
    }),

    fetch(`${backend}api/social-links-first`, {
      next: { tags: ['social-links'] },
    }),

    fetch(`${backend}api/category_products/${id}?page=1`, {
      next: { tags: ['category-products'] },
    }),
  ]);

  let product = {};
  let socialLinksData = {};
  let relatedProductsData = {};

  // Handle product response
  if (productRes.status === 'fulfilled') {
    const res = productRes.value;
    if (res.ok) {
      product = await res.json();
    } else {
      product = { error: 'Failed to fetch product data' };
    }
  } else {
    product = { error: productRes.reason?.message };
  }

  // Handle social links response
  if (socialRes.status === 'fulfilled') {
    const res = socialRes.value;
    if (res.ok) {
      socialLinksData = await res.json();
    } else {
      socialLinksData = { error: 'Failed to fetch social links' };
    }
  } else {
    socialLinksData = { error: socialRes.reason?.message };
  }

  // Handle related products response
  if (relatedRes.status === 'fulfilled') {
    const res = relatedRes.value;
    if (res.ok) {
      relatedProductsData = await res.json();
    } else {
      relatedProductsData = { error: 'Failed to fetch related products', data: [], pagination: {} };
    }
  } else {
    relatedProductsData = { error: relatedRes.reason?.message, data: [], pagination: {} };
  }

  return (
    <Products
      product={product?.data}
      socialLinksData={socialLinksData}
      initialRelatedProducts={relatedProductsData?.data || []}
      relatedPagination={relatedProductsData?.pagination || {}}
      productId={id}
    />
  );
}
