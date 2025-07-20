"use client"
import Link from "next/link";
import Image from "next/image";

import {
  FaEnvelope,
  FaUser,
  FaBars,
  FaShoppingBag,
  FaHeart,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaPinterest,
  
} from "react-icons/fa";
import { IoMenuOutline } from "react-icons/io5";
import LogButtons from "./LogButtons";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import NavSearch from "./navSearch/NavSearch";


export default function Navbar() {
 const cartCount =  useSelector(state=>state.cart.count)
 const cartItems = useSelector((state=>state.cart.items))
 const [isClient, setIsClient] = useState(false);

  useEffect(()=>{
    setIsClient(true);
  },[])

 


 let CartItemsPrice = cartItems.reduce((total,item)=>total+item.totalPrice,0)
  return (
    <div>
      <div className="humberger__menu__overlay"></div>
      <div className="humberger__menu__wrapper">
        <div className="humberger__menu__cart">
          <ul>
            <li>
              <Link href="/frontEnd/cart">
                <FaShoppingBag className="fa fa-shopping-bag" /> <span>{isClient && cartCount}</span>

              </Link>
            </li>
          </ul>
          <div className="header__cart__price">
          Cart Total: <span>{isClient?CartItemsPrice:0} Tk</span>
          </div>
        </div>
        
      </div>

      <header className="header">
        <div className="header__top">
          <div className="container">
            <div className="row">
               <div className="col-lg-6 col-md-6">
                <div className="header__top__left d-none d-md-block">
                  <ul>
                    <li>
                      <FaEnvelope className="fa fa-envelope" /> hello@colorlib.com
                    </li>
                    <li></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 d-none d-md-block">
                <div className="header__top__right">
                    <div className="header__top__right__social">
                    <Link href="#">
                      <FaFacebook className="fa fa-facebook" />
                    </Link>
                    <Link href="#">
                      <FaTwitter className="fa fa-twitter" />
                    </Link>
                    <Link href="#">
                      <FaLinkedin className="fa fa-linkedin" />
                    </Link>
                    <Link href="#">
                      <FaPinterest className="fa fa-pinterest-p" />
                    </Link>
                  </div>
                
                  
                  <div className="header__top__right__auth  dropdown">
                    <FaUser
                      className="fa fa-user  dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                     <LogButtons />
                      
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {/* mobile menu start */}
            <div className="d-flex d-md-none justify-content-around align-items-center my-3">

              <div className="mobile_humberger_icon">
                <IoMenuOutline size={20} />
              </div>

              <div className="mobile_logo">
                  <Link href="/">
                  <Image src="/img/logo3.png" alt="" width={200} height={40} />
                </Link>
              </div>

              <div>
                 <FaUser
                      className="fa fa-user  dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                     <LogButtons />
                    </ul>
              </div>

            </div>
            {/* mobile menu end */}
            <div className="col-lg-3 d-none d-md-block">
              <div className="header__logo">
                <Link href="/">
                  <Image src="/img/logo3.png" alt="" width={250} height={50} />
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-md-block">
              <nav className="header__menu">
                <ul>
                  <li className="active">
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="./shop-grid.html">Shop</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="col-lg-3 d-none d-md-block">
              <div className="header__cart">
                
                <div className="header__cart__price d-none d-md-block">
                  <ul>
                 
                  <li>
                    <Link href="/frontEnd/cart">
                      <FaShoppingBag
                        className="fa fa-shopping-bag"
                        style={{ color: "black", fontSize: "20px" }}
                      />
                      <span className="text-white">{isClient ? cartCount : 0}</span>
                    </Link>
                  </li>
                </ul>
                Cart Total: <span>{isClient? CartItemsPrice : 0} Tk</span>
                </div>
              </div>
            </div>
          </div>
          <div className="humberger__open">
            <FaBars className="fa fa-bars" />
          </div>
         <NavSearch />
        </div>
      </header>
    </div>
  );
}
