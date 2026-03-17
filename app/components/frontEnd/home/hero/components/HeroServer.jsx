
import Hero from "../hero";

async function getBanner() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/frontend/banner`,
    {
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data?.data?.[0]?.banner_images || [];
}

export default async function HeroServer() {
  const images = await getBanner();

  return <Hero images={images} />;
}