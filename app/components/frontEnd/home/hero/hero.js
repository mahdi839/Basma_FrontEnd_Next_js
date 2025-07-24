"use client"
import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight,} from "react-icons/fa";

import style from '../../nabvar/hero.module.css'
export default function Hero() {
  const bgImages = [
    '/img/banner/banner-3.png',
    '/img/banner/banner-4.png',
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
 

 function handleSlider (arrow_type){
    if(arrow_type === "right"){
      setCurrentImageIndex((prev)=>prev===bgImages.length-1?0:prev+1)
      
    }else{
      setCurrentImageIndex((prev)=>prev===0?bgImages.length-1:prev-1)
     
    }
    
 }


  return (
    
      <div className="container">
      
        <div className="row">
        <div className={`col-12 ${style.hero__item} ${style.set_bg}`}  style={{
              backgroundImage: `url(${bgImages[currentImageIndex]})`,}}>
           <div className={style.arrow_div_right}> <FaChevronLeft  className={`${style.arrow_right}`} onClick={()=>handleSlider('right')}/>
            </div>
           <div className={style.arrow_div_left}>
           <FaChevronRight className={`${style.arrow_left}`} onClick={()=>handleSlider('left')} /> 
           </div>
         </div>
        </div>
      </div>
    
  );
}
