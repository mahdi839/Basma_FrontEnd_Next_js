"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { increament, decreament, removeCart, clearCart } from "@/redux/slices/CartSlice";
import axios from "axios";
import Swal from "sweetalert2";
import './style.css';

import CartDrawerHeader from "./CartDrawerHeader";
import CartStep from "./CartStep";
import CheckoutStep from "./CheckoutStep";

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

  // Close drawer on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
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
  const handleIncreament = (id) => dispatch(increament({ id }));
  const handleDecreament = (id) => dispatch(decreament({ id }));
  
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
    const user_id = localStorage.getItem('user_id') ?? null;
    
    const orderData = {
      ...formData,
      cart: cartItems,
      user_id,
      shipping_cost: shippingAmount,
      total_amount: finalTotal,
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

  const backToCart = () => setCurrentStep("cart");

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-overlay">
      <div className="cart-drawer">
        <CartDrawerHeader
          currentStep={currentStep}
          cartCount={cartCount}
          onClose={onClose}
          onBack={backToCart}
        />

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
              onClose={onClose}
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