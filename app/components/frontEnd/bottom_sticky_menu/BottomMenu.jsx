'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AiOutlineHome } from 'react-icons/ai';
import { BsShop } from 'react-icons/bs';
import { FaShoppingCart, FaWhatsapp } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import { ImCancelCircle } from 'react-icons/im';
import { useSelector } from "react-redux";
import CartDrawer from '../components/CartDrawer';
import NavCategories from '../nabvar/components/NavCategories';

export default function BottomMenu() {
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const cartCount = useSelector((state) => state.cart.count);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCloseCartDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  const handleOpenCart = () => {
    setIsCartDrawerOpen(true);
  };

  const handleCloseCategoryDrawer = () => {
    setIsCategoryDrawerOpen(false);
  };

  const handleOpenCategory = () => {
    setIsCategoryDrawerOpen(true);
  };

  return (
    <>
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
              <button 
                onClick={handleOpenCategory}
                className="border-0 bg-transparent w-100 p-0"
                type="button"
              >
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <MdCategory size={20} className="text-dark" />
                  <small className="text-dark mt-1" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                    Category
                  </small>
                </div>
              </button>
            </div>

            {/* WhatsApp */}
            <div className="col px-1">
              
               <a href="https://wa.me/8801614477721"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none d-block"
              >
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <FaWhatsapp size={22} className="text-success" />
                  <small className="text-success mt-1" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                    WhatsApp
                  </small>
                </div>
              </a>
            </div>

            {/* Cart */}
            <div className="col px-1">
              <button
                onClick={handleOpenCart}
                className="border-0 bg-transparent w-100 p-0 position-relative"
                type="button"
              >
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <div className="position-relative">
                    <FaShoppingCart size={22} className="text-dark" />
                    {isClient && cartCount > 0 && (
                      <span 
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill" 
                        style={{ background: '#7d0ba7', fontSize: '9px' }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <small className="text-dark mt-1" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                    Cart
                  </small>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Drawer */}
      {isCategoryDrawerOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-md-none"
          style={{ 
            background: 'rgba(0, 0, 0, 0.5)', 
            zIndex: 10000
          }}
          onClick={handleCloseCategoryDrawer}
        >
          <div 
            className="position-absolute top-0 start-0 h-100 bg-white"
            style={{ 
              width: '80vw',
              maxWidth: '350px',
              boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
              overflowY: 'auto',
              transition: 'transform 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div 
              className="d-flex justify-content-between align-items-center p-3 border-bottom"
              style={{ background: '#7d0ba7' }}
            >
              <h5 className="mb-0 text-white fw-bold">Categories</h5>
              <button 
                onClick={handleCloseCategoryDrawer}
                className="border-0 bg-transparent text-white"
                style={{ fontSize: '24px', cursor: 'pointer' }}
                type="button"
              >
                <ImCancelCircle />
              </button>
            </div>

            {/* Categories List */}
            <div className="p-3">
              <NavCategories 
                onClick={handleCloseCategoryDrawer}
                isMobile={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={handleCloseCartDrawer}
      />
    </>
  );
}