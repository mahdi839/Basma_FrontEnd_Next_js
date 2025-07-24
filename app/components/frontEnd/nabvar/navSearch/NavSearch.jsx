'use client'
import React, { useEffect, useState } from 'react'
import {FaBars, FaPhone } from 'react-icons/fa';
import style from "../hero.module.css"
import NavCategories from '../components/NavCategories';
export default function NavSearch() {
  const [isClient,setIsClient] =useState(false)
    useEffect(()=>{
            setIsClient(true)
         },[])
  return (
    <div className="row">
       {/* medium to large screen design start */}
          <div className="col-lg-3 d-none d-xl-block">
            <div className={`${isClient?style.category_main:null} hero__categories`}>
              <div  className={`${isClient?style.category_dropdown:null} hero__categories__all`} >
                <FaBars className="fa fa-bars hero_category_icon"  />
                <span>All Categories</span>
                
              </div>
               <ul className={isClient?style.category_list:null}>
              <NavCategories />
               </ul>
            </div>
          </div>
          <div className="col-lg-9 d-none d-xl-block">
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
           {/* medium to large screen design end */}
        </div>
  )
}
