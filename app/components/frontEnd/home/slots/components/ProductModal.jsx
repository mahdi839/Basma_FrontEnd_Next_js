"use client"
import React, { useState } from "react";
import { FaTimes, FaCartArrowDown, FaCheck } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { BiSolidPurchaseTag } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import { increament, decreament } from "@/redux/slices/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import './productModal.css'

const ProductModal = ({
  product,
  isOpen,
  isLoading,
  onClose,
  selectedSize,
  onSizeSelect,
  onSelectColor,
  selectedColor,
  onAddToCart,
  baseUrl,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [preQty, setPreQty] = useState(1);
  const cartItem = cartItems.find(item => product?.id == item.id);

  if (!isOpen) return null;

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleQuantityChange = (id) => {
    setPreQty((prev) => prev + 1);
    dispatch(increament({ id }));
  };

  const handleDecrement = (id) => {
    setPreQty((prev) => prev - 1);
    dispatch(decreament({ id }));
  };

  // Loading skeleton while fetching product
  if (isLoading || !product) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes className="close-icon" />
          </button>
          <div className="modal-body">
            <div className="modal-grid">
              {/* Image skeleton */}
              <div className="image-section">
                <div className="main-image-container" style={{
                  background: '#f0f0f0',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}>
                  <div style={{ height: '300px' }}></div>
                </div>
              </div>
              {/* Details skeleton */}
              <div className="details-section">
                <div style={{
                  height: '30px',
                  background: '#f0f0f0',
                  marginBottom: '10px',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}></div>
                <div style={{
                  height: '20px',
                  background: '#f0f0f0',
                  width: '70%',
                  marginBottom: '20px',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}></div>
                <p className="text-center text-muted">Loading product details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = product.images?.[currentImageIndex]?.image
    ? baseUrl + product.images[currentImageIndex]?.image
    : "/placeholder-image.jpg";

  const selectedVariant = product.sizes?.find(s => s.id == selectedSize) || product.sizes?.[0];
  const displayPrice = selectedVariant?.pivot?.price ?? product.price;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes className="close-icon" />
        </button>

        <div className="modal-body">
          <div className="modal-grid">
            {/* Product Images Section */}
            <div className="image-section">
              <div className="main-image-container">
                <Image
                  width={300}
                  height={300}
                  src={mainImage}
                  alt={product.title}
                  className="main-product-image"
                  priority
                />
              </div>

              {/* Thumbnail Images */}
              {product.images?.length > 1 && (
                <div className="thumbnail-gallery">
                  {product.images.map((img, index) => (
                    <div
                      key={index}
                      className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <Image
                        width={60}
                        height={60}
                        src={baseUrl + img.image}
                        alt={`${product.title} ${index + 1}`}
                        className="thumbnail-image"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="details-section">
              <div className="product-header">
                <h1 className="product-title">{product.title}</h1>
                <p className="product-subtitle">{product.short_description}</p>
              </div>

              {product?.status === 'prebook' && (
                <div className="preorder-badge">
                  ⚡ Pre Order, Delivery Time 20 to 25 Days
                </div>
              )}

              {/* Price Section */}
              <div className="price-section">
                <div className="price-main">
                  <span className="current-price">
                    ৳{displayPrice * preQty}
                  </span>
                </div>
              </div>

              {/* Colors Selection */}
              {product.colors?.length > 0 && (
                <div className="variant-section">
                  <div className="variant-header">
                    <div className="quantity-label">
                      <span className="required-asterisk">* </span>Colors:
                    </div>
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    {product.colors.map((color) => (
                      <div
                        key={color.id}
                        className={`color-img-div ${selectedColor === color.image ? "active" : ""}`}
                        onClick={() => onSelectColor(color?.image)}
                      >
                        <img
                          src={process.env.NEXT_PUBLIC_BACKEND_URL + color?.image ?? ""}
                          alt="color variant"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes Selection */}
              {product.sizes?.length > 0 && (
                <div className="variant-section">
                  <div className="variant-header">
                    <div className="quantity-label">
                      {product.sizes.length > 1 && (
                        <span className="required-asterisk">* </span>
                      )}
                      Sizes:
                    </div>
                  </div>
                  <div className="variant-options-grid">
                    {product.sizes.map((size) => (
                      <button
                        key={size.id}
                        className={`variant-option ${selectedSize == size.id ? 'selected' : ''}`}
                        onClick={() => onSizeSelect(size.id)}
                      >
                        {size.size}
                        <span className="variant-price">
                          {size?.pivot?.price ? "৳" : ""}{size?.pivot?.price ?? ""}
                        </span>
                        {selectedSize == size.id && <FaCheck className="check-icon" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="quantity-section">
                <span className="quantity-label">Quantity:</span>
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={() => handleDecrement(product.id)}
                    disabled={preQty <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{cartItem?.qty ?? preQty}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(product.id)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-section">
                <button
                  className="action-cart-btn btn-grad add-to-cart-btn"
                  onClick={() => onAddToCart(product, 'add', preQty)}
                >
                  <FaCartArrowDown className="btn-icon" />
                  Add to Cart
                </button>

                <button
                  className="action-cart-btn btn-grad"
                  onClick={() => onAddToCart(product, 'buy', preQty)}
                >
                  <BiSolidPurchaseTag className="btn-icon" />
                  Buy Now
                </button>
              </div>

              {/* View Details Link */}
              <Link
                href={`/frontEnd/product-page/${product.id}`}
                className="view-details-link"
              >
                <CiSearch className="link-icon" />
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductModal;