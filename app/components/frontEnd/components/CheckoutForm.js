import React from "react";
import District from "@/app/frontEnd/checkout/components/District";

export default function CheckoutForm({ formData, onInputChange, onDistrictChange }) {
  return (
    <>
      {/* Personal Information */}
      <div className="form-section">
        <h6 className="section-title">
          <span className="section-icon">👤</span>
          Personal Information
        </h6>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              required
              placeholder="Enter your phone number"
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="form-section">
        <h6 className="section-title">
          <span className="section-icon">📍</span>
          Shipping Address
        </h6>
        <div className="form-group">
          <label htmlFor="district" className="form-label">District</label>
          <District
            value={formData.district}
            onChange={onDistrictChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address" className="form-label">Full Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={formData.address}
            onChange={onInputChange}
            required
            placeholder="Enter your complete address"
          />
        </div>
        <div className="form-group">
          <label htmlFor="delivery_notes" className="form-label">
            Delivery Notes <span className="optional">(Optional)</span>
          </label>
          <textarea
            className="form-control"
            id="delivery_notes"
            name="delivery_notes"
            rows="3"
            placeholder="Any special delivery instructions..."
            value={formData.delivery_notes}
            onChange={onInputChange}
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="form-section">
        <h6 className="section-title">
          <span className="section-icon">💳</span>
          Payment Method
        </h6>
        <div className="payment-options">
          <label className="payment-option selected">
            <input
              type="radio"
              name="payment_method"
              value="cash"
              checked={formData.payment_method === "cash"}
              onChange={onInputChange}
            />
            <div className="payment-content">
              <span className="payment-icon">💰</span>
              <div className="payment-text">
                <span className="payment-title">Cash on Delivery</span>
                <span className="payment-desc">Pay when you receive your order</span>
              </div>
            </div>
          </label>
        </div>
      </div>
    </>
  );
}