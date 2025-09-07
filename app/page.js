import { getData } from "@/lib/api";
import Hero from "./components/frontEnd/home/hero/hero";
import Feature from "./components/frontEnd/home/slots/feature";
import FrontEndLayout from "./components/layouts/FrontEndLayout";


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
    console.log("hi")
    console.log(heroData)
    console.log("hi")
  return ( 
     <FrontEndLayout>
     <Hero data={heroData[0]} />
     <Feature slotData={slotData}/>
     </FrontEndLayout>
  );
}
