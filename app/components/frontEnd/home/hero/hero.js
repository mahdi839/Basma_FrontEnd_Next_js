"use client";
import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import Image from "next/image";
import style from "../../nabvar/hero.module.css";
export default function Hero({ data }) {
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
  console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}storage/${data.banner_images[0].path}`)
  return (
    <div className="container  ">
      {/* ${style.hero__item} ${style.set_bg}`}  style={{
              backgroundImage: `url(${bgImages[currentImageIndex]})`,} */}

      <Slider {...settings}>
        {
          data?.banner_images?.map((index, slidImg) => (
            <Image
              key={index}
              className="hero_slider_img"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}storage/${slidImg.path}`}
              width={1200} // Actual image width
              height={400}
              alt="Banner"
            />
          ))
        }
      </Slider>
    </div>
  );
}
