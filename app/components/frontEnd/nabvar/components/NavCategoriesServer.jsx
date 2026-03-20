// app/components/navbar/components/NavCategoriesServer.jsx
// ✅ SERVER COMPONENT — fetch happens at build/request time, zero client JS

import DesktopCategories from "./navCatComponents/DesktopCategories";

async function getCategories() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await fetch(`${baseUrl}api/categories`, {
      // Revalidate every 5 minutes — tweak to your needs
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export default async function NavCategoriesServer() {
  const categories = await getCategories();
  return <DesktopCategories categories={categories} />;
}