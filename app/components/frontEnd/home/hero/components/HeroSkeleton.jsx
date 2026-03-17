"use client";

import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import style from "./hero.module.css";

export default function HeroSkeleton() {
  return (
    <div className="container">
      <div className="position-relative">

        {/* Skeleton Banner */}
        <div className="hero_slider_img skeleton-banner" />

        {/* Left Arrow */}
        <div className={style.arrow_div_left}>
          <FaChevronLeft className={style.arrow_left} />
        </div>

        {/* Right Arrow */}
        <div className={style.arrow_div_right}>
          <FaChevronRight className={style.arrow_right} />
        </div>

      </div>
    </div>
  );
}