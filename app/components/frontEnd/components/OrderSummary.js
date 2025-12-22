import React from "react";

export default function OrderSummary({ cartItems, shippingAmount, finalTotal }) {
  return (
    <div className="order-summary-section">
      <h6 className="section-title">
        <span className="section-icon">📦</span>
        Order Summary
      </h6>
      <div className="order-items">
        {cartItems.map((item) => (
          <div key={item.id} className="order-item">
            <div className="order-item-info">
              <span className="order-item-name">{item.title}</span>
              <span className="order-item-qty">Qty: {item.qty}</span>
            </div>
            <span className="order-item-price">{item.totalPrice} TK</span>
          </div>
        ))}
      </div>

      <div className="order-totals">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>{finalTotal - shippingAmount} TK</span>
        </div>
        <div className="total-row">
          <span>Shipping:</span>
          <span>{shippingAmount} TK</span>
        </div>
        <div className="total-final">
          <span>Total Amount:</span>
          <span>{finalTotal} TK</span>
        </div>
      </div>
    </div>
  );
}