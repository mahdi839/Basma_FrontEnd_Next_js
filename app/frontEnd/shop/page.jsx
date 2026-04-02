// shop/page.jsx
import ShopServer from "./components/ShopServer";
import ShopSkeleton from "./ShopSkeleton";
import { Suspense } from "react";

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopServer />
    </Suspense>
  );
}