import React from "react";
import { FaTimes, FaShoppingBag, FaCreditCard, FaArrowLeft } from "react-icons/fa";

export default function CartDrawerHeader({ currentStep, cartCount, onClose, onBack }) {
  return (
    <div className="cart-drawer-header">
      <div className="d-flex align-items-center">
        {currentStep === "checkout" && (
          <button
            onClick={onBack}
            className="back-btn me-3"
            aria-label="Back to cart"
          >
            <FaArrowLeft size={16} />
          </button>
        )}
        <h4 className="mb-0 drawer-title">
          {currentStep === "cart" ? (
            <>
              <FaShoppingBag className="me-2" />
              Your Cart {cartCount > 0 && <span className="item-count">({cartCount})</span>}
            </>
          ) : (
            <>
              <FaCreditCard className="me-2" />
              Checkout
            </>
          )}
        </h4>
      </div>
      <button onClick={onClose} className="close-btn" aria-label="Close cart">
        <FaTimes size={22} />
      </button>
    </div>
  );
}