
import FeatureServer from "./components/frontEnd/home/slots/FeatureServer";
import FrontEndLayout from "./components/layouts/FrontEndLayout";
import BottomMenu from "./components/frontEnd/bottom_sticky_menu/BottomMenu";
import { Suspense } from "react";
import FeatureSkeleton from "./components/frontEnd/home/slots/components/FeatureSkeleton";
import HeroServer from "./components/frontEnd/home/hero/components/HeroServer";
import HeroSkeleton from "./components/frontEnd/home/hero/components/HeroSkeleton";

export default function Home() {
  return (
    <FrontEndLayout>
      <div style={{ minHeight: "60vh" }}>
        {/* SSR Banner */}
        <Suspense fallback={<HeroSkeleton />}>
          <HeroServer />
        </Suspense>

        {/* SSR + CSR hybrid */}
        <Suspense fallback={<FeatureSkeleton />}>
          <FeatureServer />
        </Suspense>
      </div>

      <BottomMenu />
    </FrontEndLayout>
  );
}