// components/FeatureServer.jsx
import FeatureClient from "./featureClient";

async function getSlots() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/product-slots_index/frontEndIndex?page=1`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return {
        data: [],
        current_page: 1,
        has_more: false,
        error: "Failed to fetch",
      };
    }

    const json = await res.json();

    return {
      data: Array.isArray(json?.data) ? json.data : [],
      current_page: json?.current_page ?? 1,
      has_more: json?.has_more ?? false,
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      current_page: 1,
      has_more: false,
      error: "Failed to fetch",
    };
  }
}

export default async function FeatureServer() {
  const data = await getSlots();
  return <FeatureClient homeCategories={data} />;
}