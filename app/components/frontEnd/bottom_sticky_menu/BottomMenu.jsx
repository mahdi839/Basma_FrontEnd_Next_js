'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AiOutlineHome } from 'react-icons/ai';
import { BsShop } from 'react-icons/bs';
import { FaShoppingCart, FaWhatsapp } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import { useSelector } from "react-redux";
import CartDrawer from '../components/CartDrawer';

export default function BottomMenu() {
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const cartCount = useSelector((state) => state.cart.count);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCloseDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  const handleClick = () => {
    setIsCartDrawerOpen(true);
  };

  return (
    <div
      className="d-md-none bg-white border-top shadow-lg"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '70px',
        zIndex: 9999,
      }}
    >
      <div className="container-fluid h-100 px-0">
        <div className="row h-100 align-items-center justify-content-around text-center mx-0 gx-1">

          {/* Home */}
          <div className="col px-1">
            <Link href="/" className="text-decoration-none">
              <div className="d-flex flex-column align-items-center justify-content-center">
                <AiOutlineHome size={22} className="text-dark" />
                <small className="text-dark mt-1" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                  Home
                </small>
              </div>
            </Link>
          </div>

          {/* Shop */}
          <div className="col px-1">
            <Link href="/frontEnd/shop" className="text-decoration-none">
              <div className="d-flex flex-column align-items-center justify-content-center">
                <BsShop size={20} className="text-dark" />
                <small className="text-dark mt-1" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                  Shop
                </small>
              </div>
            </Link>
          </div>

          {/* Categories */}
          <div className="col px-1">
            <Link href="/frontEnd/shop" className="text-decoration-none">
              <div className="d-flex flex-column align-items-center justify-content-center">
                <MdCategory size={20} className="text-dark" />
                <small className="text-dark mt-1" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                  Category
                </small>
              </div>
            </Link>
          </div>

          {/* WhatsApp */}
          <div className="col px-1">
            <a
              href="https://wa.me/8801614477721"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <div className="d-flex flex-column align-items-center justify-content-center">
                <FaWhatsapp size={22} className="text-success" />
                <small className="text-success mt-1" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                  WhatsApp
                </small>
              </div>
            </a>
          </div>

          {/* Account */}
          <div className="col px-1">
            <div className="position-relative border-0 ">
              <button
                onClick={handleClick}
                className="cart-icon-btn d-flex align-items-center position-relative border-0 bg-transparent"
              >
                <FaShoppingCart size={22} />
                {isClient && (
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ background: '#7d0ba7' }}>
                    {cartCount}
                  </span>

                )}
              </button>
            </div>
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