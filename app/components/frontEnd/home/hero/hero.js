"use client"
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaBars, FaPhone } from "react-icons/fa";
import HeroBgImage from "./dynamic_hero_bg";
import { toast } from "react-toastify";
import axios from "axios";
import style from "./hero.module.css"
export default function Hero() {
  const bgImages = [
    '/img/banner/banner-3.png',
    '/img/banner/banner-4.png',
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [category,setCategory] = useState([]);
 
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

 function handleSlider (arrow_type){
    if(arrow_type === "right"){
      setCurrentImageIndex((prev)=>prev===bgImages.length-1?0:prev+1)
      
    }else{
      setCurrentImageIndex((prev)=>prev===0?bgImages.length-1:prev-1)
     
    }
    
 }

  return (
    <section className="hero">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className={`${style.category_main} hero__categories`}>
              <div  className={`${style.category_dropdown} hero__categories__all`} >
                <FaBars className="fa fa-bars hero_category_icon"  />
                <span>All Categories</span>
                <FaArrowRight style={{ position: 'absolute', right: '18px', top: '17px', color: '#ffffff', fontSize: '18px' }} />
              </div>
             
             
                <ul className={style.category_list}>
                {category.map((categ)=>(
                  <li key={categ.id}>
                  <a href="#">{categ.name}</a>
                </li>
                ))}
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
          </div>
        </div>
        <div className="row">
        <div className={`col-12 ${style.hero__item} ${style.set_bg}`}  style={{
              backgroundImage: `url(${bgImages[currentImageIndex]})`,}}>
            <FaArrowRight  className={`${style.arrow_right}`} onClick={()=>handleSlider('right')}/>
            <FaArrowLeft className={`${style.arrow_left}`} onClick={()=>handleSlider('left')} /> 
         </div>
        </div>
      </div>
    </section>
  );
}
