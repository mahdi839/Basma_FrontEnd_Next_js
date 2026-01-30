"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaEnvelope,
  FaUser,
  FaBars,
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
import CartDrawer from "../components/CartDrawer";

export default function Navbar({ onCartClick }) {
  const cartCount = useSelector((state) => state.cart.count);
  const cartItems = useSelector((state) => state.cart.items);
  const [isClient, setIsClient] = useState(false);
  const [isShowCollaps, setIsShowCollaps] = useState(false);
  const [isShowCollapsMenu, setIsShowCollapsMenu] = useState("category");
  const [footerData, setFooterData] = useState(null);
  const [mobileQuery, setMobileQuery] = useState("");
  const [mobileResults, setMobileResults] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  async function fetchFooterData() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/footer-settings`
      );
      setFooterData(data);
    } catch (error) {
      console.error("Error fetching footer data:", error);
    }
  }

  useEffect(() => {
    fetchFooterData();
  }, []);

  let CartItemsPrice = cartItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  function handleCollaps() {
    setIsShowCollaps(true);
  }

  function handleCollapsCancel() {
    setIsShowCollaps(false);
  }

  function handleCollaps_menu(menu) {
    setIsShowCollapsMenu(menu);
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (mobileQuery.length >= 3) {
      fetch(`${baseUrl}api/product-search?q=${mobileQuery}`)
        .then(res => res.json())
        .then(data => {
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


  const handleCloseDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  const handleClick = () => {
    setIsCartDrawerOpen(true);
  };

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
                      <FaEnvelope className="me-2" />{" "}
                      {footerData?.company_email ?? ""}
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
            <div className="d-flex d-xl-none justify-content-around align-items-center w-100 px-3 mt-3">
              <div className="mobile_humberger_icon" onClick={handleCollaps}>
                <IoMenuOutline size={24} />
              </div>

              <div className="mobile_logo">
                <Link href="/">
                  <Image
                    src="/img/logo.png"
                    alt=""
                    width={150}
                    height={40}
                  />
                </Link>
              </div>

              {/* <div className="position-relative border-0 ">
                <button
                  onClick={handleClick}
                  className="cart-icon-btn d-flex align-items-center position-relative border-0 bg-transparent"
                >
                  <FaShoppingCart size={20} />
                  {isClient && (
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ background: '#7d0ba7' }}>
                      {cartCount}
                    </span>

                  )}
                </button>
              </div> */}

              <div className="dropdown pb-1">
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

              {/* 🔽 Mobile Results Dropdown */}
              {mobileOpen && (
                <ul
                  className="list-group position-absolute w-100 shadow"
                  style={{
                    top: "100%",
                    zIndex: 1050,
                    maxHeight: "300px",
                    overflowY: "auto"
                  }}
                >
                  {mobileResults.length > 0 ? (
                    mobileResults.map(product => (
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
                                Sizes: {product.sizes.map(s => s.size).join(", ")}
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

            {/* Desktop cart - FIXED */}
            <div className="col-lg-3 d-none d-xl-block">
              <div className="d-flex align-items-center justify-content-end">
                <div className="position-relative me-3 border-0 pr-2">
                  <button
                    onClick={handleClick}
                    className="cart-icon-btn d-flex align-items-center position-relative border-0 bg-transparent"
                  >
                    <FaShoppingCart size={20} />
                    {isClient && (
                      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ background: '#7d0ba7' }}>
                        {cartCount}
                      </span>

                    )}
                  </button>
                </div>
                <div className="header__cart__price d-none d-lg-block">
                  <span className="fw-bold">Cart Total: {isClient ? CartItemsPrice : 0} Tk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and menu toggle */}
          <div className="d-xl-none humberger__open text-center my-2">
            <FaBars />
          </div>
          <NavSearch footerData={footerData} />
        </div>
      </header>

      {/* Mobile collaps menu */}
      <div
        className={`${style.collaps_div} ${isShowCollaps ? "position-fixed top-0 start-0 h-100 bg-white d-md-none" : style.hide_col_menu
          }`}
           style={{ 
              width: '80vw',
              maxWidth: '350px',
              boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
              overflowY: 'auto',
              zIndex: 10001,
              animation: 'slideInLeft 0.3s ease'
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
              className={`${style.menu_category_label_one} `}
              onClick={() => handleCollaps_menu("category")}
            >
              <span
                className={`${isShowCollapsMenu === "category"
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
                className={`${isShowCollapsMenu === "menu"
                  ? style.collaps_border_two
                  : ""
                  }`}
              >
                Menu
              </span>
            </div>
          </div>
          <div className={`${style.collaps_category_list_div}`}>
            {isShowCollapsMenu === "category" && (
              <ul className={`my-3 ${style.collaps_category_list}`}>
                <NavCategories
                  onClick={handleCollapsCancel}
                  isMobile={true}
                />
              </ul>
            )}
            {isShowCollapsMenu === "menu" && (
              <ul className={`my-3 ${style.collaps_category_list}`}>
                <li>
                  <Link
                    href="/"
                    onClick={() => handleCollapsCancel()}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => handleCollapsCancel()}
                    href="/frontEnd/about_us"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => handleCollapsCancel()}
                    href="/frontEnd/shop"
                  >
                    Shop
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}