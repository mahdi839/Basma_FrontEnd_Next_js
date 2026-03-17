"use client";

import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import Image from "next/image";
import style from "../../nabvar/hero.module.css";
import Link from "next/link";

export default function Hero({ images }) {
  if (!images || images.length === 0) return null;

  const settings = {
    dots: false,
    infinite: true,
    speed: 1100,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
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
    <div className="container">
      <Slider {...settings}>
        {images.map((img, index) => {
          const imageEl = (
            <Image
              className="hero_slider_img"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}storage/${img.path}`}
              width={1200}
              height={400}
              alt="Banner"
              priority={index === 0} // ✅ only first image priority
            />
          );

          return img?.link ? (
            <Link key={img.id} href={img.link}>
              {imageEl}
            </Link>
          ) : (
            <div key={img.id}>{imageEl}</div>
          );
        })}
      </Slider>
    </div>
  );
}