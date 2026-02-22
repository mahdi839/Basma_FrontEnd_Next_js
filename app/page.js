import { getData } from "@/lib/api";
import Hero from "./components/frontEnd/home/hero/hero";
import Feature from "./components/frontEnd/home/slots/feature";
import FrontEndLayout from "./components/layouts/FrontEndLayout";
import BottomMenu from "./components/frontEnd/bottom_sticky_menu/BottomMenu";


export default async function Home() {
  
    const data = await getData('api/frontend/banner')
    console.log(data);
  return ( 
     <FrontEndLayout>
     <div style={{ minHeight: '60vh' }}>
         <Hero data={data}/>
         <Feature/>
       </div>
       <BottomMenu />
     </FrontEndLayout>
  );
}
