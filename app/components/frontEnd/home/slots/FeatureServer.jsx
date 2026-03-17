// components/FeatureServer.jsx
import FeatureClient from "./featureClient";

async function getSlots() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/product-slots_index/frontEndIndex?page=1`,
    {
      next: { revalidate: 600 },
    }
  );

  if (!res.ok) {
    return { data: [], error: "Failed to fetch" };
  }

  return res.json();
}

export default async function FeatureServer() {
  const data = await getSlots();

  return <FeatureClient homeCategories={data} />;
}