"use client"
import React, { useState } from "react";
import { FaArrowRight, FaBars, FaPhone } from "react-icons/fa";
import HeroBgImage from "./dynamic_hero_bg";

export default function Hero() {
  const bgImages = [
    '/img/hero/banner.jpg',
    '/img/hero/banner4.jpg',
    '/img/hero/banner3.jpg',
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  return (
    <section className="hero">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="hero__categories">
              <div className="hero__categories__all">
                <FaBars className="fa fa-bars hero_category_icon"  />
                <span>All Categories</span>
                <FaArrowRight style={{ position: 'absolute', right: '18px', top: '17px', color: '#ffffff', fontSize: '18px' }} />
              </div>
              <ul>
                <li>
                  <a href="#">Fresh Meat</a>
                </li>
                <li>
                  <a href="#">Vegetables</a>
                </li>
                <li>
                  <a href="#">Fruit & Nut Gifts</a>
                </li>
                <li>
                  <a href="#">Fresh Berries</a>
                </li>
                <li>
                  <a href="#">Ocean Foods</a>
                </li>
                <li>
                  <a href="#">Butter & Eggs</a>
                </li>
                <li>
                  <a href="#">Fastfood</a>
                </li>
                <li>
                  <a href="#">Fresh Onion</a>
                </li>
                <li>
                  <a href="#">Papayaya & Crisps</a>
                </li>
                <li>
                  <a href="#">Oatmeal</a>
                </li>
                <li>
                  <a href="#">Fresh Bananas</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="hero__search">
              <div className="hero__search__form">
                <form action="#">
                  <div className="hero__search__categories">
                    All Categories
                    <span className="arrow_carrot-down"></span>
                  </div>
                  <input type="text" placeholder="What do yo u need?" />
                  <button type="submit" className="site-btn">
                    SEARCH
                  </button>
                </form>
              </div>
              <div className="hero__search__phone">
                <div className="hero__search__phone__icon">
                  <FaPhone className="fa fa-phone" />
                </div>
                <div className="hero__search__phone__text">
                  <h5>01795802507</h5>
                  <span>support 24/7 time</span>
                </div>
              </div>
            </div>
            <div className="hero__item set-bg"  style={{
              backgroundImage: `url(${bgImages[currentImageIndex]})`,}}>
            <HeroBgImage bgImages={bgImages} setCurrentImageIndex={setCurrentImageIndex} />
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
