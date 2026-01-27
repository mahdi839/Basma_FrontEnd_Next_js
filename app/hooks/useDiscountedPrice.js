import { useMemo } from "react";

export default function useDiscountedPrice(slotProducts) {
  const { originalPrice, discount, discountedPrice } = useMemo(() => {
    const original = parseInt(slotProducts?.price, 10) || 0;
    const discountValue = parseInt(slotProducts?.discount, 10) || 0;

    const finalPrice =
      original && discountValue
        ? Math.round(original - (original * discountValue) / 100)
        : original;

    return {
      originalPrice: original,
      discount: discountValue,
      discountedPrice: finalPrice,
    };
  }, [slotProducts?.price, slotProducts?.discount]);

  return {
    originalPrice,
    discount,
    discountedPrice,
  };
}
