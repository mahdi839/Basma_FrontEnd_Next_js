import Hero from "./components/frontEnd/home/hero/hero";
import Feature from "./components/frontEnd/home/featured_products/feature";
import FrontEndLayout from "./components/layouts/FrontEndLayout";


export default function Home() {
  return (
    
     <FrontEndLayout>
     <Hero />
     <Feature/>
     
     </FrontEndLayout>
    
  );
}
