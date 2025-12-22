import React from "react";
import { FaCreditCard } from "react-icons/fa";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";

export default function CheckoutStep({ 
  formData, 
  shippingAmount, 
  finalTotal, 
  cartItems, 
  onInputChange, 
  onDistrictChange, 
  onSubmit 
}) {
  return (
    <div className="checkout-step">
      <form onSubmit={onSubmit} className="checkout-form">
        <CheckoutForm
          formData={formData}
          onInputChange={onInputChange}
          onDistrictChange={onDistrictChange}
        />

        <OrderSummary
          cartItems={cartItems}
          shippingAmount={shippingAmount}
          finalTotal={finalTotal}
        />

        <button type="submit" className="place-order-btn btn-grad">
          <FaCreditCard className="me-2" />
          Place Order
        </button>
      </form>
    </div>
  );
}