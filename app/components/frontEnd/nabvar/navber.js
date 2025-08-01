"use client";
import Link from "next/link";
import Image from "next/image";

import {
  FaEnvelope,
  FaUser,
  FaBars,
  FaShoppingBag,
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
import style from "./hero.module.css";
import { ImCancelCircle } from "react-icons/im";
import NavCategories from "./components/NavCategories";

export default function Navbar() {
  const cartCount = useSelector((state) => state.cart.count);
  const cartItems = useSelector((state) => state.cart.items);
  const [isClient, setIsClient] = useState(false);
  const [isShowCollaps, setIsShowCollaps] = useState(false);
  const [ isShowCollapsMenu, setIsShowCollapsMenu ] = useState('category');
  useEffect(() => {
    setIsClient(true);
  }, []);

  let CartItemsPrice = cartItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  function handleCollaps (){
    setIsShowCollaps(true)
  }
  function handleCollapsCancel (){
    setIsShowCollaps(false)
  }
  function handleCollaps_menu(menu) {
    setIsShowCollapsMenu(menu)
  }
  return (
    <div className="position-relative">
      
      <div className="humberger__menu__wrapper">
        <div className="humberger__menu__cart">
         
          <div className="header__cart__price">
            Cart Total: <span>{isClient ? CartItemsPrice : 0} Tk</span>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="header__top">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="header__top__left d-none d-xl-block">
                  <ul>
                    <li>
                      <FaEnvelope className="fa fa-envelope" />{" "}
                      hello@colorlib.com
                    </li>
                    <li></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 d-none d-xl-block">
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
            <div className="d-flex d-xl-none justify-content-around align-items-center my-3">
              <div className="mobile_humberger_icon" onClick={handleCollaps}>
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
            <div className="col-lg-3 d-none d-xl-block">
              <div className="header__logo">
                <Link href="/">
                  <Image src="/img/logo3.png" alt="" width={250} height={50} />
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-xl-block">
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
            <div className="col-lg-3 d-none d-xl-block">
              <div className="header__cart">
                <div className="header__cart__price d-none d-xl-block">
                
                  Cart Total: <span>{isClient ? CartItemsPrice : 0} Tk</span>
                </div>
              </div>
            </div>
          </div>
          <div className="humberger__open" >
            <FaBars className="fa fa-bars" />
          </div>
          <NavSearch />
        </div>
      </header>
      {/* mobile collaps menu start */}
      
        <div className={`${style.collaps_div} ${isShowCollaps ? style.show_col_menu : style.hide_col_menu}`}>
          <div className={`${style.collaps_cancel_div}`}  onClick={handleCollapsCancel}>
            <ImCancelCircle size={22} />
          </div>
          <div className={`${style.menu_category_main}`}>
            <div className={`${style.menu_category_sub}`}>
              <div className={`${style.menu_category_label_one} `} onClick={()=>handleCollaps_menu('category')}> <span className={`${isShowCollapsMenu === 'category'? style.collaps_border_one:''}`}>Category</span> </div>
              <div className={`${style.menu_category_label_two}`} onClick={()=>handleCollaps_menu('menu')}><span className={`${isShowCollapsMenu ==='menu'? style.collaps_border_two : ''}`}>Menu</span></div>
            </div>
            <div className={`${style.collaps_category_list_div}`}>
              {isShowCollapsMenu === 'category' && (
                <ul className={` my-3 ${style.collaps_category_list}`}>
                  <NavCategories  onClick={handleCollapsCancel}  />
                </ul>
              )}
              {isShowCollapsMenu === 'menu' &&(
                 <ul className={` my-3 ${style.collaps_category_list}`}>
                  <li >
                    <Link href='/' onClick={()=>handleCollapsCancel ()}>Home</Link>
                  </li>
                  <li>
                    <Link onClick={()=>handleCollapsCancel ()} href='/about'>About Us</Link>
                  </li>
               </ul>
              )}
            </div>
          </div>
        </div>
    
      {/* mobile collaps menu end */}
    </div>
  );
}
