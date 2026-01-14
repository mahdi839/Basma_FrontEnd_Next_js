import React, { useState } from 'react'

export default function useProductLogics(product,whatsappNumber) {
   const [selectedColor, setSelectedColor] = useState(null);
   const [selectedSize, setSelectedSize] = useState(null);
   function handleSelectedColor(colorImage) {
      setSelectedColor(colorImage)
   }
   function handleSelectedSize(sizeId) {
      setSelectedSize(sizeId)
   }
   // WhatsApp message generator
   const generateWhatsAppMessage = () => {
      const productName = product?.title || "Product";
      return `Hello! I'm interested in this product: ${productName}. Can you provide more information?`;
   };

   // WhatsApp URL
   const whatsappUrl = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(generateWhatsAppMessage())}`
      : "";

   // cartcount 
   return { handleSelectedColor, selectedColor, handleSelectedSize, selectedSize,
    whatsappUrl };
}
