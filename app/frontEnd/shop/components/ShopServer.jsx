// ShopServer.jsx
import ShopClient from "./ShopClient";

async function getInitialData() {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  try {
    const [filtersRes, productsRes] = await Promise.all([
      fetch(`${baseUrl}api/shop/filters`, { next: { revalidate: 10800  } }),
      fetch(`${baseUrl}api/shop/products?page=1`, { next: { revalidate: 1800 } }),
    ]);

    const [filtersData, productsData] = await Promise.all([
      filtersRes.json(),
      productsRes.json(),
    ]);

    return {
      filterOptions: filtersData.message === "success" ? filtersData.data : {
        categories: [],
        sizes: [],
        price_range: { min: 0, max: 1000 },
      },
      initialProducts: productsData.message === "success" ? productsData.data : [],
      initialPagination: productsData.message === "success" ? productsData.pagination : {
        current_page: 1,
        has_more: false,
        total: 0,
      },
    };
  } catch (e) {
    return {
      filterOptions: { categories: [], sizes: [], price_range: { min: 0, max: 1000 } },
      initialProducts: [],
      initialPagination: { current_page: 1, has_more: false, total: 0 },
    };
  }
}

export default async function ShopServer() {
  const data = await getInitialData();
  return <ShopClient {...data} />;
}