"use client"
import React, { useEffect, useState } from "react";
import { FaArrowRight, FaBars, FaPhone } from "react-icons/fa";
import HeroBgImage from "./dynamic_hero_bg";
import { toast } from "react-toastify";
import axios from "axios";

export default function Hero() {
  const bgImages = [
    '/img/hero/banner.jpg',
    '/img/hero/banner4.jpg',
    '/img/hero/banner3.jpg',
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [category,setCategory] = useState([])
  const [showCategory,setShowCategory] = useState(false)
 
 async function fetchCategories (){
  const url = process.env.BACKEND_URL + 'api/categories'
    try{
      const data = await axios.get(url)
      setCategory(data.data)
    }catch(err){
      toast.error(err.message)
    }
  }

  useEffect(()=>{
     fetchCategories()
  },[])

  function handleCategory (){
    setShowCategory(!showCategory)
  }


  return (
    <section className="hero">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="hero__categories">
              <div  className="hero__categories__all" onClick={handleCategory}>
                <FaBars className="fa fa-bars hero_category_icon"  />
                <span>All Categories</span>
                <FaArrowRight style={{ position: 'absolute', right: '18px', top: '17px', color: '#ffffff', fontSize: '18px' }} />
              </div>
             {
              showCategory && (
                <ul>
                {category.map((categ)=>(
                  <li>
                  <a href="#">{categ.name}</a>
                </li>
                ))}
              </ul>
              )
             }
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
