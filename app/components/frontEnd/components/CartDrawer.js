// components/frontEnd/CartDrawer/CartDrawer.js
"use client";
import React, { useState, useEffect } from "react";
import { FaTimes, FaShoppingBag, FaCreditCard, FaArrowLeft, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { increament, decreament, removeCart, clearCart } from "@/redux/slices/CartSlice";
import District from "@/app/frontEnd/checkout/components/District";
import axios from "axios";
import Swal from "sweetalert2";
import './style.css';
import Link from "next/link";
import { toast } from "react-toastify";

export default function CartDrawer({ isOpen, onClose, isDirectBuy }) {
  const [currentStep, setCurrentStep] = useState("cart");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    payment_method: "cash",
    delivery_notes: "",
  });
  const [shippingAmount, setShippingAmount] = useState(0);
  const [removingItem, setRemovingItem] = useState(null);

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = useSelector((state) => state.cart.count);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((total, item) => total + item.totalPrice, 0);
  const finalTotal = totalPrice + shippingAmount;

  // Close drawer when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Cart functions
  const handleIncreament = (id) => {
    dispatch(increament({ id }));
  };

  const handleDecreament = (id) => {
    dispatch(decreament({ id }));
  };

  const handleRemove = (id) => {
    setRemovingItem(id);
    setTimeout(() => {
      dispatch(removeCart({ id }));
      setRemovingItem(null);
    }, 300);
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cart is empty",
        text: "Please add items to your cart before checkout",
        confirmButtonColor: "#DB3340",
      });
      return;
    }
    setCurrentStep("checkout");
  };

  useEffect(() => {
    if (isDirectBuy && isOpen) {
      setCurrentStep("checkout");
    }
  }, [isDirectBuy, isOpen]);

  // Checkout functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDistrictChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      district: selectedOption?.value || ""
    }));
  };

  // Fetch shipping cost
  useEffect(() => {
    if (formData.district) {
      const fetchShippingCost = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/shipping-costs-latest`
          );
          const data = response.data;

          if (formData.district === "dhaka") {
            setShippingAmount(data.inside_dhaka || data.one_shipping_cost || 0);
          } else {
            setShippingAmount(data.outside_dhaka || data.one_shipping_cost || 0);
          }
        } catch (error) {
          console.error("Error fetching shipping cost:", error);
          setShippingAmount(0);
        }
      };

      fetchShippingCost();
    }
  }, [formData.district]);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Your cart is empty",
        text: "Please add items to your cart before checking out.",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    // Get Facebook cookies
    const getFacebookParams = () => {
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };

      return {
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc')
      };
    };

    const { fbp, fbc } = getFacebookParams();
    const user_id = localStorage.getItem('user_id')??null
    const orderData = {
      ...formData,
      cart: cartItems,
      user_id,
      shipping_cost: shippingAmount,
      total_amount: finalTotal,
      // Add Facebook tracking data
      fbp: fbp,
      fbc: fbc,
      event_source_url: window.location.href,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/orders`,
        orderData
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Order Placed!",
          text: "Thank you for your purchase! Order placed successfully.",
          confirmButtonText: "OK",
          confirmButtonColor: "#28a745",
        });

        dispatch(clearCart());
        setCurrentStep("cart");
        onClose();
        setFormData({
          name: "",
          phone: "",
          address: "",
          district: "",
          payment_method: "cash",
          delivery_notes: "",
        });
      }
    } catch (error) {
      console.error("Order submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: "There was an error placing your order. Please try again.",
        confirmButtonColor: "#DB3340",
      });
    }
    onClose();
  };

  const backToCart = () => {
    setCurrentStep("cart");
  };

  if (!isOpen) return null;



  return (
    <div className="cart-drawer-overlay">
      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="d-flex align-items-center">
            {currentStep === "checkout" && (
              <button
                onClick={backToCart}
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

        {/* Content */}
        <div className="cart-drawer-content">
          {currentStep === "cart" ? (
            <CartStep
              cartItems={cartItems}
              totalPrice={totalPrice}
              onIncreament={handleIncreament}
              onDecreament={handleDecreament}
              onRemove={handleRemove}
              onProceed={proceedToCheckout}
              removingItem={removingItem}
            />
          ) : (
            <CheckoutStep
              formData={formData}
              shippingAmount={shippingAmount}
              finalTotal={finalTotal}
              cartItems={cartItems}
              onInputChange={handleInputChange}
              onDistrictChange={handleDistrictChange}
              onSubmit={handleCheckoutSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Cart Step Component
function CartStep({ cartItems, totalPrice, onIncreament, onDecreament, onRemove, onProceed, removingItem }) {
  if (cartItems.length === 0) {
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

  const [sizes, setSizes] = useState(null);

  useEffect(() => {
    const fetchSizeData = async () => {
      try {
       let response =  await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/sizes')
       setSizes(response?.data??null)
      } catch (err) {
        console.log(err.message);
      }
    }

    fetchSizeData()
  }, [])

  const handleClickOnTitle = () => {
    onClose();
  }

  const getSeletedSizeName = (sizeId) => {
    let selectedSize = sizes?.find(size => size?.id == sizeId)
    return selectedSize?.size??"N/A"
  }

  return (
    <div className="cart-step">
      <div className="cart-items-container">
        <div className="cart-items-header">
          <span>Product</span>
          <span>Total</span>
        </div>
        <div className="cart-items">
          {cartItems.map((item) => (

            <div
              key={item.id}
              className={`cart-item ${removingItem === item.id ? 'removing' : ''}`}
            >
              <div className="item-image">
                <img
                  src={item?.colorImage ?? item?.image}
                  alt={item.title}
                  className="img-fluid"
                />
              </div>
              <div className="item-details">

                <h6 className="item-title">
                  <Link
                    onClick={handleClickOnTitle}
                    href={`/frontEnd/product-page/${item.id}`}
                  >
                    {item.title}
                  </Link>
                </h6>
                {item.size && (
                  <p className="item-variant">
                    Variant: <span>{getSeletedSizeName(item.size)}</span>
                  </p>
                )}

                <div className="item-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() => onDecreament(item.id)}
                      disabled={item.qty <= 1}
                      className="qty-btn qty-minus"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="qty-display">{item.qty}</span>
                    <button
                      onClick={() => onIncreament(item.id)}
                      className="qty-btn qty-plus"
                      aria-label="Increase quantity"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="remove-btn"
                    aria-label="Remove item"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
              <div className="item-total">
                <span className="total-price">{item.totalPrice} TK</span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
}

// Checkout Step Component
function CheckoutStep({ formData, shippingAmount, finalTotal, cartItems, onInputChange, onDistrictChange, onSubmit }) {
  return (
    <div className="checkout-step">
      <form onSubmit={onSubmit} className="checkout-form">
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

        {/* Order Summary */}
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

        <button type="submit" className="place-order-btn btn-grad">
          <FaCreditCard className="me-2" />
          Place Order
        </button>
      </form>
    </div>
  );
}