import FeatureServer from "./components/frontEnd/home/slots/FeatureServer";
import FrontEndLayout from "./components/layouts/FrontEndLayout";
import { Suspense } from "react";
import FeatureSkeleton from "./components/frontEnd/home/slots/components/FeatureSkeleton";
import Hero from "./components/frontEnd/home/hero/hero";

export default function Home() {
  return (
    <FrontEndLayout>
      <div style={{ minHeight: "60vh" }}>
        <Hero />
        <Suspense fallback={<FeatureSkeleton />}>
          <FeatureServer />
        </Suspense>
      </div>
    </FrontEndLayout>
  );
}
