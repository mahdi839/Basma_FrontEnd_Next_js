"use client";
import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import Image from "next/image";
import style from "../../nabvar/hero.module.css";
export default function Hero() {
  const bgImages = ["/img/banner/banner-3.png", "/img/banner/banner-4.png"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  var settings = {
    dots: false,
    infinite: true,
    speed: 1100,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // 👈 Enables autoplay
    autoplaySpeed: 6000,
    nextArrow: (
      <div className={style.arrow_div_right}>
        <FaChevronRight className={style.arrow_right} />
      </div>
    ),
    prevArrow: (
      <div className={style.arrow_div_left}>
        <FaChevronLeft className={style.arrow_left} />
      </div>
    ),
  };

  return (
    <div className="container  ">
      {/* ${style.hero__item} ${style.set_bg}`}  style={{
              backgroundImage: `url(${bgImages[currentImageIndex]})`,} */}

      <Slider {...settings}>
        <Image
          className="hero_slider_img"
          src="/img/banner/banner-3.png"
          width={1200} // Actual image width
          height={400}
          alt="Banner"
        />
        <Image
          className="hero_slider_img"
          src="/img/banner/banner-4.png"
          width={1200} // Actual image width
          height={400}
          style={{ width: "100%", height: "auto" }}
          alt="Banner"
        />
        {/* <div className={style.arrow_div_right}> <FaChevronLeft  className={`${style.arrow_right}`} onClick={()=>handleSlider('right')}/>
            </div>
           <div className={style.arrow_div_left}>
           <FaChevronRight className={`${style.arrow_left}`} onClick={()=>handleSlider('left')} /> 
           </div> */}
      </Slider>
    </div>
  );
}
