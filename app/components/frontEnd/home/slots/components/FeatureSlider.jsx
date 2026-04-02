"use client";

import dynamic from "next/dynamic";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "./ProductCard";

const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
  loading: () => null,
});

function NextArrow({ onClick }) {
  return (
    <button className="custom-slick-arrow custom-slick-next" onClick={onClick}>
      <FaChevronRight />
    </button>
  );
}

function PrevArrow({ onClick }) {
  return (
    <button className="custom-slick-arrow custom-slick-prev" onClick={onClick}>
      <FaChevronLeft />
    </button>
  );
}

export default function FeatureSlider({
  products = [],
  handleAddToCart,
  sliderRef,
}) {
  const settings = {
    infinite: products.length > 4,
    speed: 400,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  if (!products.length) return null;

  return (
    <Slider ref={sliderRef} {...settings} className="w-100">
      {products.map((product, index) => (
        <div key={product.id || index}>
          <ProductCard
            slotProducts={product}
            handleAddToCart={handleAddToCart}
            slotLength={products.length}
            className={products.length >= 4 ? "mx-2" : ""}
          />
        </div>
      ))}
    </Slider>
  );
}