import React from "react";
import { FaCreditCard } from "react-icons/fa";

export default function CartSummary({ totalPrice, onProceed }) {
  return (
    <div className="cart-summary-section">
      <div className="summary-card">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>{totalPrice} TK</span>
        </div>
        <div className="summary-row shipping-info">
          <span>Shipping:</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="summary-total">
          <span>Total:</span>
          <span>{totalPrice} TK</span>
        </div>

        <button
          onClick={onProceed}
          className="btn-grad checkout-btn"
        >
          <FaCreditCard className="me-2" />
          Proceed to Checkout
        </button>

        <button className="continue-shopping-btn outline" onClick={() => window.location.href = '/'}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}