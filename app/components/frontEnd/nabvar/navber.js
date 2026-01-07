"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import {
  FaEnvelope,
  FaUser,
  FaBars,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaPinterest,
} from "react-icons/fa";
import { IoMenuOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import { BiCategory } from "react-icons/bi";

import LogButtons from "./LogButtons";
import NavSearch from "./navSearch/NavSearch";
import NavCategories from "./components/NavCategories";
import style from "./hero.module.css";

export default function Navbar() {
  const cartCount = useSelector((state) => state.cart.count);
  const cartItems = useSelector((state) => state.cart.items);
  const [isClient, setIsClient] = useState(false);
  const [isShowCollaps, setIsShowCollaps] = useState(false);
  const [isShowCollapsMenu, setIsShowCollapsMenu] = useState('category');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [footerData, setFooterData] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  async function fetchFooterData() {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/footer-settings`);
      setFooterData(data);
    } catch (error) {
      console.error("Error fetching footer data:", error);
    }
  }

  useEffect(() => {
    fetchFooterData();
  }, []);

  useEffect(() => {
    if (footerData?.logo_path) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL.endsWith("/")
        ? process.env.NEXT_PUBLIC_BACKEND_URL.slice(0, -1)
        : process.env.NEXT_PUBLIC_BACKEND_URL;
      setLogoUrl(backendUrl + footerData.logo_path);
    }
  }, [footerData]);

  let CartItemsPrice = cartItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  function handleCollaps() {
    setIsShowCollaps(true)
  }
  
  function handleCollapsCancel() {
    setIsShowCollaps(false)
  }
  
  function handleCollaps_menu(menu) {
    setIsShowCollapsMenu(menu)
  }

  return (
    <div className="position-relative">
      {/* Mobile menu wrapper */}
      <div className="humberger__menu__wrapper d-xl-none">
        <div className="humberger__menu__cart">
          <div className="header__cart__price">
            Cart Total: <span>{isClient ? CartItemsPrice : 0} Tk</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="header">
        <div className="header__top">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-6">
                <div className="header__top__left d-none d-xl-block">
                  <ul className="mb-0">
                    <li>
                      <FaEnvelope className="me-2" /> hello@colorlib.com
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 d-none d-xl-block">
                <div className="header__top__right d-flex justify-content-end align-items-center">
                  <div className="header__top__right__social me-4">
                    <Link href="#" className="me-3">
                      <FaFacebook />
                    </Link>
                    <Link href="#" className="me-3">
                      <FaTwitter />
                    </Link>
                    <Link href="#" className="me-3">
                      <FaLinkedin />
                    </Link>
                    <Link href="#">
                      <FaPinterest />
                    </Link>
                  </div>

                  <div className="header__top__right__auth dropdown">
                    <FaUser
                      className="dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      {isClient && <LogButtons />}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container">
          <div className="row align-items-center py-2">
            {/* Mobile menu */}
            <div className="d-flex d-xl-none justify-content-between align-items-center w-100 px-3">
              <div className="mobile_humberger_icon" onClick={handleCollaps}>
                <IoMenuOutline size={24} />
              </div>

              <div className="mobile_logo">
                <Link href="/">
                 
                    <Image src="/img/logo.png" alt="" width={150} height={40} />
       
                </Link>
              </div>

              <div className="dropdown">
                <FaUser
                  className="dropdown-toggle"
                  type="button"
                  id="dropdownMenuButtonMobile"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                />
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButtonMobile"
                >
                  <LogButtons />
                </ul>
              </div>
            </div>
            
            {/* Desktop logo */}
            <div className="col-lg-3 d-none d-xl-block">
              <div className="header__logo py-2">
                
                  <Link href="/">
                    <Image
                      src="/img/logo.png"
                      alt=""
                      width={200}
                      height={60}
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                  </Link>
              </div>
            </div>
            
            {/* Desktop navigation */}
            <div className="col-lg-6 d-none d-xl-block">
              <nav className="header__menu">
                <ul className="d-flex justify-content-center align-items-center mb-0">
                  <li className="mx-3">
                    <Link href="/">Home</Link>
                  </li>
                  
               <li className="mx-3">
                    <Link href="/frontEnd/shop">Shop</Link>
                  </li>
                  
                  <li className="mx-3">
                    <Link href="/frontEnd/about_us">About Us</Link>
                  </li>
                </ul>
              </nav>
            </div>
            
            {/* Desktop cart */}
            <div className="col-lg-3 d-none d-xl-block">
              <div className="header__cart text-end">
                <div className="header__cart__price">
                  Cart Total: <span>{isClient ? CartItemsPrice : 0} Tk</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search and menu toggle */}
          <div className="d-xl-none humberger__open text-center my-2">
            <FaBars />
          </div>
          <NavSearch />
        </div>
      </header>
      
      {/* Mobile collaps menu */}
      <div className={`${style.collaps_div} ${isShowCollaps ? style.show_col_menu : style.hide_col_menu}`}>
        <div className={`${style.collaps_cancel_div}`} onClick={handleCollapsCancel}>
          <ImCancelCircle size={22} />
        </div>
        <div className={`${style.menu_category_main}`}>
          <div className={`${style.menu_category_sub}`}>
            <div className={`${style.menu_category_label_one} `} onClick={() => handleCollaps_menu('category')}> 
              <span className={`${isShowCollapsMenu === 'category' ? style.collaps_border_one : ''}`}>Category</span> 
            </div>
            <div className={`${style.menu_category_label_two}`} onClick={() => handleCollaps_menu('menu')}>
              <span className={`${isShowCollapsMenu === 'menu' ? style.collaps_border_two : ''}`}>Menu</span>
            </div>
          </div>
          <div className={`${style.collaps_category_list_div}`}>
            {isShowCollapsMenu === 'category' && (
              <ul className={`my-3 ${style.collaps_category_list}`}>
                <NavCategories onClick={handleCollapsCancel} isMobile={true} />
              </ul>
            )}
            {isShowCollapsMenu === 'menu' && (
              <ul className={`my-3 ${style.collaps_category_list}`}>
                <li>
                  <Link href='/' onClick={() => handleCollapsCancel()}>Home</Link>
                </li>
                <li>
                  <Link onClick={() => handleCollapsCancel()} href='/frontEnd/about_us'>About Us</Link>
                </li>
                 <li>
                  <Link onClick={() => handleCollapsCancel()} href='/frontEnd/shop'>Shop</Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}