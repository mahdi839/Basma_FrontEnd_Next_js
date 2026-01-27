"use client"
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import './productCard.css';
import useDiscountedPrice from "@/app/hooks/useDiscountedPrice";

const ProductCard = React.memo(function ProductCard({
  slotProducts,
  slotLength,
  className
}) {
  const [selectedImage, setSelectedImage] = useState({
    url: null,
    index: null
  });
  let baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  function handleShowImage(index, colorImage) {
    setSelectedImage({ url: colorImage, index })
  }
  // ✅ Custom hook usage
  const { discountedPrice, originalPrice, discount } =
    useDiscountedPrice(slotProducts);

  return (
    <div className={`${slotLength >= 4 ? "px-1" : ''} ${className} my-2 my-md-5 position-relative`}>
      <div className="card product-div p-1 p-md-2 bg-white h-100 product-card position-relative">
        {/* Wrap only the content that should be clickable */}
        <Link href={`/frontEnd/product-page/${slotProducts?.id}`} style={{ textDecoration: 'none' }}>
          {/* Product Image - This is now properly clickable */}
          <div className="position-relative overflow-hidden product-image-container">
            <Image
              width={500}
              height={400}
              src={
                selectedImage?.url
                  ? baseUrl + selectedImage.url
                  : slotProducts?.images?.[0]?.image
                    ? baseUrl + slotProducts.images[0].image
                    : slotProducts?.image
                      ? baseUrl + slotProducts.image
                      : ""
              }
              className="product-image p-0 p-md-3"
              alt={slotProducts?.title || "Product"}
              priority={false}
            />
          </div>

          {/* Product Body */}
          <div className="card-body px-2 px-md-3 pb-1 pb-md-2 pt-2 pt-md-3">
            <p className="mb-1">
              <span className="text-decoration-none text-dark fw-bold product-card-title">
                {slotProducts?.title}
              </span>
            </p>
            <div className="d-flex gap-3 align-items-left mt-1 mt-md-2">
              {discount > 0 && (
                <span className="discount-price text-decoration-line-through">
                  {originalPrice}৳
                </span>
              )}
              <span className="fw-bold product-price">
                {discountedPrice}৳
              </span>
            </div>
          </div>
        </Link>

        {/* Color swatches - outside Link if you don't want them clickable */}
        {slotProducts?.colors?.length > 0 && (
          <div className="product-color-wrapper">
            {slotProducts?.colors?.map((color, index) => (
              <div key={index} className={`${selectedImage.url && index == selectedImage.index ? "SelectedImageStyle" : "product_color_image_div"}`} onClick={() => handleShowImage(index, color?.image)}>
                <Image
                  width={30}
                  height={30}
                  src={baseUrl + color?.image}
                  alt={slotProducts?.title || "Color variant"}
                  className="h-100 w-100"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status badge */}
      {slotProducts?.status === 'prebook' && (
        <div
          className="position-absolute m-2 px-2 px-md-3 py-1 shadow-sm product_status_badge"
        >
          PRE-BOOK
        </div>
      )}
    </div>
  );
});

export default ProductCard;