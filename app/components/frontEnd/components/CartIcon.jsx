'use client'
import { RiShoppingBag3Fill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import './style.css'
import CartDrawer from "./CartDrawer";
export default function CartIcon({ itemCount = 0 }) {
  const [isPulsing, setIsPulsing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cartCount = useSelector((state) => state.cart.count);
  const cartItems = useSelector((state) => state.cart.items);
  const [isClient, setIsClient] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const handleCartIconClick = () => {
    
    
  };

  const handleCloseDrawer = () => {
    setIsCartDrawerOpen(false);
  };
  const handleClick = () => {
    // Trigger pulse animation
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 500);
    setIsCartDrawerOpen(true);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (

    <>
      <div
        onClick={handleClick}
        onCartClick={handleCartIconClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cartIconContainer"
      >
        <RiShoppingBag3Fill
          size={28}
          className="cartIcon"
        />

        {/* Item Count Badge */}
        {/* {itemCount > 0 && ( */}
        <div
          className="badge"
        >
          {/* {itemCount > 9 ? "9+" : itemCount} */}{isClient && cartCount}
        </div>
        {/* // )} */}
      </div>

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </>

  );
}