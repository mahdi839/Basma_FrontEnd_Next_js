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
        {/* <div className="summary-total">
          <span>Total:</span>
          <span>{totalPrice} TK</span>
        </div> */}

        <div className="d-flex flex-row flex-md-column gap-2 w-100">

          <button
            onClick={onProceed}
            className="btn btn-sm btn-primary w-100 py-2"
          >
            <FaCreditCard className="me-2" />
           Checkout
          </button>

          {/* <button
            className="btn w-100 py-2"
            onClick={() => window.location.href = '/'}
          >
            Continue Shopping
          </button> */}

        </div>

      </div>
    </div>
  );
}