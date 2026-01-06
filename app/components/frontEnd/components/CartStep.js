import React from "react";
import { FaShoppingBag, FaCreditCard } from "react-icons/fa";
import EmptyCart from "./EmptyCart";
import CartItemsList from "./CartItemsList";
import CartSummary from "./CartSummary";

export default function CartStep({ 
  cartItems, 
  totalPrice, 
  onIncreament, 
  onDecreament, 
  onRemove, 
  onProceed, 
  removingItem,
  onClose 
}) {
  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="cart-step">
      <CartItemsList
        cartItems={cartItems}
        onIncreament={onIncreament}
        onDecreament={onDecreament}
        onRemove={onRemove}
        removingItem={removingItem}
        onClose={onClose}
      />

      <CartSummary
        totalPrice={totalPrice}
        onProceed={onProceed}
      />
    </div>
  );
}