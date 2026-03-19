"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaUser,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaPinterest,
  FaShoppingCart,
} from "react-icons/fa";
import { IoMenuOutline } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";

import LogButtons from "./LogButtons";
import NavSearch from "./navSearch/NavSearch";
import NavCategories from "./components/NavCategories";
import style from "./hero.module.css";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";

const CartDrawer = dynamic(() => import("../components/CartDrawer"), {
  ssr: false,
  loading: () => null,
});

import { siteConfig } from "@/config/siteConfig";
import DesktopNav from "./components/DesktopNav";

export default function Navbar() {
  const cartCount = useSelector((state) => state.cart.count);
  const cartItems = useSelector((state) => state.cart.items);

  const [isClient, setIsClient] = useState(false);
  const [isShowCollaps, setIsShowCollaps] = useState(false);
  const [isShowCollapsMenu, setIsShowCollapsMenu] = useState("category");
  const [mobileQuery, setMobileQuery] = useState("");
  const [mobileResults, setMobileResults] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [cartItemsPrice, setCartItemsPrice] = useState(0);
  const [clientCartCount, setClientCartCount] = useState(0);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    setIsClient(true);
    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setCartItemsPrice(total);
    setClientCartCount(cartCount);
  }, [cartItems, cartCount]);

  useEffect(() => {
    if (mobileQuery.length >= 3) {
      fetch(`${baseUrl}api/product-search?q=${mobileQuery}`)
        .then((res) => res.json())
        .then((data) => {
          setMobileResults(data.data || []);
          setMobileOpen(true);
        })
        .catch(() => {
          setMobileResults([]);
          setMobileOpen(false);
        });
    } else {
      setMobileResults([]);
      setMobileOpen(false);
    }
  }, [mobileQuery]);

  useEffect(() => {
    const close = () => setMobileOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  function handleCollaps() {
    setIsShowCollaps(true);
  }

  function handleCollapsCancel() {
    setIsShowCollaps(false);
  }

  function handleCollaps_menu(menu) {
    setIsShowCollapsMenu(menu);
  }

  const handleCloseDrawer = () => setIsCartDrawerOpen(false);
  const handleClick = () => setIsCartDrawerOpen(true);

  return (
    <div className="position-relative">

      {/* Mobile cart total */}
      <div className="humberger__menu__wrapper d-xl-none">
        <div className="humberger__menu__cart">
          <div className="header__cart__price">
            Cart Total: <span>{cartItemsPrice} Tk</span>
          </div>
        </div>
      </div>

      <header className="header">

        {/* Top bar */}
        <div className="header__top">
          <div className="container">
            <div className="row align-items-center">

              <div className="col-lg-6 col-md-6">
                <div className="header__top__left d-none d-xl-block">
                  <ul className="mb-0">
                    <li>
                      <FaEnvelope className="me-2" /> {siteConfig.email}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-6 col-md-6 d-none d-xl-block">
                <div className="header__top__right d-flex justify-content-end align-items-center">
                  <div className="header__top__right__social me-4">
                    <Link href={siteConfig.social.facebook} className="me-3">
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
                      data-bs-toggle="dropdown"
                    />
                    <ul className="dropdown-menu">
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

            {/* Mobile top bar */}
            <div className="d-flex d-xl-none justify-content-around align-items-center w-100 px-3 mt-3">
              <div className="mobile_humberger_icon" onClick={handleCollaps}>
                <IoMenuOutline size={24} />
              </div>

              <div className="mobile_logo">
                <Link href="/">
                  <Image src="/img/logo.png" alt="" width={150} height={40} />
                </Link>
              </div>

              <div className="dropdown pb-1">
                <FaUser
                  className="dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                />
                <ul className="dropdown-menu">
                  {isClient && <LogButtons />}
                </ul>
              </div>
            </div>

            {/* Mobile search bar */}
            <div className="d-flex justify-content-center d-xl-none w-100 my-3 px-3 position-relative">
              <div className="input-group shadow-sm w-100">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search Products By Name"
                  value={mobileQuery}
                  onChange={(e) => setMobileQuery(e.target.value)}
                />
              </div>

              {/* Mobile search results */}
              {mobileOpen && (
                <ul
                  className="list-group position-absolute w-100 shadow"
                  style={{
                    top: "100%",
                    zIndex: 1050,
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {mobileResults.length > 0 ? (
                    mobileResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/frontEnd/product-page/${product.id}`}
                        className="text-decoration-none"
                        onClick={() => setMobileOpen(false)}
                      >
                        <li className="list-group-item d-flex align-items-center">
                          <img
                            src={baseUrl + product.images?.[0]?.image}
                            alt={product.title}
                            width="45"
                            height="45"
                            className="rounded me-3 object-fit-cover"
                          />
                          <div>
                            <strong className="d-block">{product.title}</strong>
                            {product.sizes?.length > 0 && (
                              <small className="text-muted">
                                Sizes: {product.sizes.map((s) => s.size).join(", ")}
                              </small>
                            )}
                          </div>
                        </li>
                      </Link>
                    ))
                  ) : (
                    <li className="list-group-item text-center text-muted">
                      No products found
                    </li>
                  )}
                </ul>
              )}
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
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </Link>
              </div>
            </div>

            {/* Desktop nav */}
            <div className="col-lg-6 d-none d-xl-block">
              <DesktopNav />
            </div>

            {/* Desktop cart */}
            <div className="col-lg-3 d-none d-xl-block">
              <div className="d-flex align-items-center justify-content-end">
                <button
                  onClick={handleClick}
                  className="cart-icon-btn border-0 bg-transparent position-relative me-3"
                >
                  <FaShoppingCart size={20} />
                  {isClient && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                      style={{ background: "#7d0ba7" }}
                    >
                      {clientCartCount}
                    </span>
                  )}
                </button>

                <div className="header__cart__price d-none d-lg-block">
                  <span className="fw-bold">
                    Cart Total: {cartItemsPrice} Tk
                  </span>
                </div>
              </div>
            </div>

          </div>

          <NavSearch />
        </div>
      </header>

      {/* Mobile collapse menu */}
      <div
        className={`${style.collaps_div} ${
          isShowCollaps
            ? "position-fixed top-0 start-0 h-100 bg-white d-md-none"
            : style.hide_col_menu
        }`}
        style={{
          width: "80vw",
          maxWidth: "350px",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
          overflowY: "auto",
          zIndex: 10001,
          animation: "slideInLeft 0.3s ease",
        }}
      >
        <div
          className={`${style.collaps_cancel_div}`}
          onClick={handleCollapsCancel}
        >
          <ImCancelCircle size={22} />
        </div>

        <div className={`${style.menu_category_main}`}>
          <div className={`${style.menu_category_sub}`}>
            <div
              className={`${style.menu_category_label_one}`}
              onClick={() => handleCollaps_menu("category")}
            >
              <span
                className={`${
                  isShowCollapsMenu === "category"
                    ? style.collaps_border_one
                    : ""
                }`}
              >
                Category
              </span>
            </div>
            <div
              className={`${style.menu_category_label_two}`}
              onClick={() => handleCollaps_menu("menu")}
            >
              <span
                className={`${
                  isShowCollapsMenu === "menu" ? style.collaps_border_two : ""
                }`}
              >
                Menu
              </span>
            </div>
          </div>

          <div className={`${style.collaps_category_list_div}`}>
            {isShowCollapsMenu === "category" && (
              <ul className={`my-3 ${style.collaps_category_list}`}>
                <NavCategories onClick={handleCollapsCancel} isMobile={true} />
              </ul>
            )}
            {isShowCollapsMenu === "menu" && (
              <ul className={`my-3 ${style.collaps_category_list}`}>
                <li>
                  <Link href="/" onClick={handleCollapsCancel}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/frontEnd/about_us" onClick={handleCollapsCancel}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/frontEnd/shop" onClick={handleCollapsCancel}>
                    Shop
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartDrawerOpen} onClose={handleCloseDrawer} />

    </div>
  );
}