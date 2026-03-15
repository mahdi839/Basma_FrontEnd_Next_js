// page.jsx (Home)
import { getData } from "@/lib/api";
import Hero from "./components/frontEnd/home/hero/hero";
import FeatureClient from "./components/frontEnd/home/slots/featureClient";
import FrontEndLayout from "./components/layouts/FrontEndLayout";
import BottomMenu from "./components/frontEnd/bottom_sticky_menu/BottomMenu";
import FeatureSkeleton from "./components/frontEnd/home/slots/components/FeatureSkeleton";
import { Suspense } from "react";

export default async function Home() {
  const [bannerData, slotsResponse] = await Promise.allSettled([
    getData('api/frontend/banner'),
    getData('api/product-slots_index/frontEndIndex?page=1'),
  ]);

  // Banner data - safely extract
  const banner = bannerData.status === 'fulfilled' 
    ? bannerData.value 
    : null;

  // Slots data - safely extract and shape
  const slots = slotsResponse.status === 'fulfilled'
    ? {
        data: slotsResponse.value.data || [],
        current_page: slotsResponse.value.current_page,
        per_page: slotsResponse.value.per_page,
        total: slotsResponse.value.total,
        has_more: slotsResponse.value.has_more,
      }
    : { error: slotsResponse.reason?.message, data: [] };

  return (
    <FrontEndLayout>
      <div style={{ minHeight: '60vh' }}>
        <Hero data={banner} />
        <Suspense fallback={<FeatureSkeleton />}>
          <FeatureClient homeCategories={slots} />
        </Suspense>
      </div>
      <BottomMenu />
    </FrontEndLayout>
  );
}