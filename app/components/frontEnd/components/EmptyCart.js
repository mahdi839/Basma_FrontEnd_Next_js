import React from "react";
import { FaShoppingBag } from "react-icons/fa";

export default function EmptyCart() {
  return (
    <div className="empty-cart">
      <div className="empty-cart-content">
        <div className="empty-cart-icon">
          <FaShoppingBag size={64} />
        </div>
        <h5>Your cart is empty</h5>
        <p className="text-muted">Add some amazing products to get started</p>
        <button className="continue-shopping-btn" onClick={() => window.location.href = '/'}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}