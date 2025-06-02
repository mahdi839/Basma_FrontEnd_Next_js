"use client"
import Link from "next/link";
import Image from "next/image";

import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaUser,
  FaSearch,
  FaShoppingCart,
  FaBars,
  FaShoppingBag,
  FaHeart,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaPinterest,
  FaSign,
  FaSignInAlt,
  FaArrowAltCircleRight,
} from "react-icons/fa";
import LogButtons from "./LogButtons";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Navbar() {
 const cartCount =  useSelector(state=>state.cart.count)
 const [isClient, setIsClient] = useState(false);
 useEffect(()=>{
  setIsClient(true);
 },[])
  return (
    <div>
      <div className="humberger__menu__overlay"></div>
      <div className="humberger__menu__wrapper">
        <div className="humberger__menu__cart">
          <ul>
            <li>
              <Link href="#">
                <FaHeart className="fa fa-heart" /> <span>1</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <FaShoppingBag className="fa fa-shopping-bag" /> <span>{isClient ? cartCount : 0}</span>
              </Link>
            </li>
          </ul>
          <div className="header__cart__price">
            item: <span>$150.00</span>
          </div>
        </div>
        <div className="humberger__menu__widget">
          <div className="header__top__right__language">
            <Image src="/img/language.png" alt="" width={20} height={20} />
            <div>English</div>
            <span className="arrow_carrot-down"></span>
            <ul>
              <li>
                <Link href="#">Spanis</Link>
              </li>
              <li>
                <Link href="#">English</Link>
              </li>
            </ul>
          </div>

          <div className="header__top__right__auth dropdown">
            <Link href="#">
              <FaUser
                className="fa fa-user dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />{" "}
              Login
            </Link>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
        </div>
        <nav className="humberger__menu__nav mobile-menu">
          <ul>
            <li className="active">
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/shop">Shop</Link>
            </li>
            <li>
              <Link href="#">Pages</Link>
              <ul className="header__menu__dropdown">
                <li>
                  <Link href="./shop-details.html">Shop Details</Link>
                </li>
                <li>
                  <Link href="./shoping-cart.html">Shoping Cart</Link>
                </li>
                <li>
                  <Link href="./checkout.html">Check Out</Link>
                </li>
                <li>
                  <Link href="./blog-details.html">Blog Details</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="./blog.html">Blog</Link>
            </li>
            <li>
              <Link href="./contact.html">Contact</Link>
            </li>
          </ul>
        </nav>
        <div id="mobile-menu-wrap"></div>
        <div className="header__top__right__social">
          <Link href="#">
            <i className="fa fa-facebook"></i>
          </Link>
          <Link href="#">
            <i className="fa fa-twitter"></i>
          </Link>
          <Link href="#">
            <i className="fa fa-linkedin"></i>
          </Link>
          <Link href="#">
            <i className="fa fa-pinterest-p"></i>
          </Link>
        </div>
        <div className="humberger__menu__contact">
          <ul>
            <li>
              <FaEnvelope className="fa fa-envelope" /> hello@colorlib.com
            </li>
            <li>Free Shipping for all Order of $99</li>
          </ul>
        </div>
      </div>

      <header className="header">
        <div className="header__top">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="header__top__left">
                  <ul>
                    <li>
                      <FaEnvelope className="fa fa-envelope" /> hello@colorlib.com
                    </li>
                    <li>Free Shipping for all Order of $99</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
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
                  <div className="header__top__right__language">
                    <Image
                      src="/img/language.png"
                      alt=""
                      width={27}
                      height={14}
                    />
                    <div>English</div>
                    <span className="arrow_carrot-down"></span>
                    <ul>
                      <li>
                        <Link href="#">Spanis</Link>
                      </li>
                      <li>
                        <Link href="#">English</Link>
                      </li>
                    </ul>
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
            <div className="col-lg-3">
              <div className="header__logo">
                <Link href="/">
                  <Image src="/img/logo3.png" alt="" width={250} height={50} />
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
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
            <div className="col-lg-3">
              <div className="header__cart">
                <ul>
                  <li>
                    <Link href="#">
                      <FaHeart
                        className="fa fa-heart"
                        style={{ color: "black", fontSize: "20px" }}
                      />
                      <span>1</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <FaShoppingBag
                        className="fa fa-shopping-bag"
                        style={{ color: "black", fontSize: "20px" }}
                      />
                      <span>{isClient ? cartCount : 0}</span>
                    </Link>
                  </li>
                </ul>
                <div className="header__cart__price">
                  item: <span>$150.00</span>
                </div>
              </div>
            </div>
          </div>
          <div className="humberger__open">
            <FaBars className="fa fa-bars" />
          </div>
        </div>
      </header>
    </div>
  );
}
