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
} from "react-icons/fa";

export default function Navbar() {
  return (
    <div>
      <div class="humberger__menu__overlay"></div>
      <div class="humberger__menu__wrapper">
        <div class="humberger__menu__cart">
          <ul>
            <li>
              <Link href="#">
                <i class="fa fa-heart"></i> <span>1</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <i class="fa fa-shopping-bag"></i> <span>3</span>
              </Link>
            </li>
          </ul>
          <div class="header__cart__price">
            item: <span>$150.00</span>
          </div>
        </div>
        <div class="humberger__menu__widget">
          <div class="header__top__right__language">
            <Image src="/img/language.png" alt="" width={20} height={20} />
            <div>English</div>
            <span class="arrow_carrot-down"></span>
            <ul>
              <li>
                <Link href="#">Spanis</Link>
              </li>
              <li>
                <Link href="#">English</Link>
              </li>
            </ul>
          </div>
          <div class="header__top__right__auth">
            <Link href="#">
              <FaUser class="fa fa-user" /> Login
            </Link>
          </div>
        </div>
        <nav class="humberger__menu__nav mobile-menu">
          <ul>
            <li class="active">
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/shop">Shop</Link>
            </li>
            <li>
              <Link href="#">Pages</Link>
              <ul class="header__menu__dropdown">
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
        <div class="header__top__right__social">
          <Link href="#">
            <i class="fa fa-facebook"></i>
          </Link>
          <Link href="#">
            <i class="fa fa-twitter"></i>
          </Link>
          <Link href="#">
            <i class="fa fa-linkedin"></i>
          </Link>
          <Link href="#">
            <i class="fa fa-pinterest-p"></i>
          </Link>
        </div>
        <div class="humberger__menu__contact">
          <ul>
            <li>
              <FaEnvelope class="fa fa-envelope" /> hello@colorlib.com
            </li>
            <li>Free Shipping for all Order of $99</li>
          </ul>
        </div>
      </div>

      <header class="header">
        <div class="header__top">
          <div class="container">
            <div class="row">
              <div class="col-lg-6 col-md-6">
                <div class="header__top__left">
                  <ul>
                    <li>
                      <FaEnvelope class="fa fa-envelope" /> hello@colorlib.com
                    </li>
                    <li>Free Shipping for all Order of $99</li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="header__top__right">
                  <div class="header__top__right__social">
                    <Link href="#">
                      <FaFacebook class="fa fa-facebook" />
                    </Link>
                    <Link href="#">
                      <FaTwitter class="fa fa-twitter" />
                    </Link>
                    <Link href="#">
                      <FaLinkedin class="fa fa-linkedin" />
                    </Link>
                    <Link href="#">
                      <FaPinterest class="fa fa-pinterest-p" />
                    </Link>
                  </div>
                  <div class="header__top__right__language">
                    <Image
                      src="/img/language.png"
                      alt=""
                      width={27}
                      height={14}
                    />
                    <div>English</div>
                    <span class="arrow_carrot-down"></span>
                    <ul>
                      <li>
                        <Link href="#">Spanis</Link>
                      </li>
                      <li>
                        <Link href="#">English</Link>
                      </li>
                    </ul>
                  </div>
                  <div class="header__top__right__auth">
                    <Link href="#">
                      <FaUser class="fa fa-user" /> Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-lg-3">
              <div class="header__logo">
                <Link href="/">
                  <Image src="/img/logo3.png" alt="" width={250} height={50} />
                </Link>
              </div>
            </div>
            <div class="col-lg-6">
              <nav class="header__menu">
                <ul>
                  <li class="active">
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="./shop-grid.html">Shop</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div class="col-lg-3">
              <div class="header__cart">
                <ul>
                  <li>
                    <Link href="#">
                      <FaHeart
                        class="fa fa-heart"
                        style={{ color: "black", fontSize: "20px" }}
                      />{" "}
                      <span>1</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <FaShoppingBag
                        class="fa fa-shopping-bag"
                        style={{ color: "black", fontSize: "20px" }}
                      />{" "}
                      <span>3</span>
                    </Link>
                  </li>
                </ul>
                <div class="header__cart__price">
                  item: <span>$150.00</span>
                </div>
              </div>
            </div>
          </div>
          <div class="humberger__open">
            <FaBars class="fa fa-bars" />
          </div>
        </div>
      </header>
    </div>
  );
}
