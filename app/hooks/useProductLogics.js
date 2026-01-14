import { useState } from "react";
import { useDispatch } from "react-redux";
import { increament, decreament } from "@/redux/slices/CartSlice";

export default function useProductLogics(product, whatsappNumber) {
  const dispatch = useDispatch();

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [preQty, setPreQty] = useState(1);

  function handleSelectedColor(colorImage) {
    setSelectedColor(colorImage);
  }

  function handleSelectedSize(sizeId) {
    setSelectedSize(sizeId);
  }

  // ---------------------------
  // Quantity logic (MOVED HERE)
  // ---------------------------
  const handleQuantityIncrease = (id) => {
    setPreQty((prev) => prev + 1);
    dispatch(increament({ id }));
  };

  const handleQuantityDecrease = (id) => {
    setPreQty((prev) => (prev > 1 ? prev - 1 : 1));
    dispatch(decreament({ id }));
  };

  // ---------------------------
  // WhatsApp logic
  // ---------------------------
  const generateWhatsAppMessage = () => {
    const productName = product?.title || "Product";
    return `Hello! I'm interested in this product: ${productName}. Can you provide more information?`;
  };

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        generateWhatsAppMessage()
      )}`
    : "";

  return {
    // variants
    selectedColor,
    selectedSize,
    handleSelectedColor,
    handleSelectedSize,

    // quantity
    preQty,
    handleQuantityIncrease,
    handleQuantityDecrease,

    // whatsapp
    whatsappUrl,
  };
}
