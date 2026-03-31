"use client";

import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import Image from "next/image";
import style from "../../nabvar/hero.module.css";
import Link from "next/link";

export default function Hero() {

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

  const images = [
    {
      id:1,
      url:'/img/hero_banners/premium shoes-01.jpg',
      link:'/frontEnd/women-shoes-collection'|| '/',
    },
    {
      id:2,
      url:'/img/hero_banners/summer collection-01.jpg'
    },
    {
      id:3,
      url:'/img/hero_banners/winter collection-01.jpg'
    }
  ]

  return (
    <div className="container">
      <Slider {...settings}>
        {images.map((img, index) => {
          const imageEl = (
            <Image
              className="hero_slider_img"
              src={img.url}
              width={1200}
              height={400}
              alt="Banner"
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
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