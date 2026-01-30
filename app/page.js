import { getData } from "@/lib/api";
import Hero from "./components/frontEnd/home/hero/hero";
import Feature from "./components/frontEnd/home/slots/feature";
import FrontEndLayout from "./components/layouts/FrontEndLayout";
import BottomMenu from "./components/frontEnd/bottom_sticky_menu/BottomMenu";


export default async function Home() {
  
    const data = await getData('api/frontend/banner')
    const slotData = []
    const heroData = []
    const BannerCatData = []

    for(let i=0;i<data?.length;i++){
       if(data[i].type === 'slot'){
         slotData.push(data[i])
       }
       if(data[i].type === 'hero'){
         heroData.push(data[i])
       }
        if(data[i].type === 'category'){
         BannerCatData.push(data[i])
       }
    }
  return ( 
     <FrontEndLayout>
     <div style={{ minHeight: '60vh' }}>
         <Hero data={heroData[0]} />
         <Feature BannerCatData={BannerCatData} />
       </div>
       <BottomMenu />
     </FrontEndLayout>
  );
}
