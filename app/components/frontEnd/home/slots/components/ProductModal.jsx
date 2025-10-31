import React, { useState } from "react";
import { FaTimes, FaCartArrowDown, FaHeart, FaCheck } from "react-icons/fa";
import { CiSearch, CiHeart } from "react-icons/ci";
import { BiSolidPurchaseTag } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";

const ProductModal = ({
  product,
  isOpen,
  onClose,
  selectedSizes,
  onSizeSelect,
  onAddToCart,
  baseUrl,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const mainImage = product.images?.[currentImageIndex]?.image
    ? baseUrl + product.images[currentImageIndex]?.image
    : "/placeholder-image.jpg";

  const selectedVariant = product.variants.find(v => v.id == selectedSizes) || product.variants[0];
  const displayPrice = selectedVariant?.price ?? product.price;
  const hasDiscount = product.original_price && product.original_price > displayPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.original_price - displayPrice) / product.original_price) * 100)
    : 0;

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

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
                {hasDiscount && (
                  <div className="discount-badge">
                    -{discountPercentage}%
                  </div>
                )}
                <Image
                  width={300}
                  height={300}
                  src={mainImage}
                  alt={product.title}
                  className="main-product-image"
                  unoptimized={true}
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
                        unoptimized={true}
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
                <p className="product-subtitle">{product.sub_title}</p>
              </div>

              {/* Price Section */}
              <div className="price-section">
                <div className="price-main">
                  <span className="current-price">৳{displayPrice}</span>
                  {hasDiscount && (
                    <>
                      <span className="original-price">৳{product.original_price}</span>
                      <span className="discount-text">Save ৳{product.original_price - displayPrice}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Variant Selection */}
              {product.variants?.length > 1 && (
                <div className="variant-section">
                  <div className="variant-header">
                    <span className="variant-label">
                      {product.variants[0]?.attribute || "Option"}
                    </span>
                    <span className="required-asterisk">*</span>
                  </div>
                  <div className="variant-options-grid">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        className={`variant-option ${selectedSizes == variant.id ? 'selected' : ''}`}
                        onClick={() => onSizeSelect({ target: { value: variant.id }})}
                      >
                        {variant.value}
                        <span className="variant-price">৳{variant.price}</span>
                        {selectedSizes == variant.id && <FaCheck className="check-icon" />}
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
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-section">
                <button
                  className="btn-grad add-to-cart-btn"
                  onClick={() => onAddToCart(product,'add')}
                >
                  <FaCartArrowDown className="btn-icon" />
                  Add to Cart
                </button>
                
                <button className="btn-grad" onClick={() => onAddToCart(product,'buy')}>
                  <BiSolidPurchaseTag className="btn-icon" />
                  Buy Now
                </button>
              </div>

              {/* Additional Features */}
              {/* <div className="features-section">
                <div className="feature-item">
                  <div className="feature-icon">🚚</div>
                  <div className="feature-text">
                    <strong>Free Delivery</strong>
                    <span>For orders above ৳500</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">↩️</div>
                  <div className="feature-text">
                    <strong>Easy Returns</strong>
                    <span>15 days return policy</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔒</div>
                  <div className="feature-text">
                    <strong>Secure Payment</strong>
                    <span>100% secure transaction</span>
                  </div>
                </div>
              </div> */}

              {/* Product Meta */}
              <div className="meta-section">
                {/* <div className="meta-item">
                  <span className="meta-label">SKU:</span>
                  <span className="meta-value">{product.sku || "N/A"}</span>
                </div> */}
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{product.category?.name || "N/A"}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Availability:</span>
                  <span className="meta-value in-stock">In Stock</span>
                </div>
              </div>

              {/* View Details Link */}
              <Link href={`/frontEnd/product-page/${product.id}`} className="view-details-link">
                <CiSearch className="link-icon" />
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(5px);
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 900px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: modalAppear 0.3s ease-out;
        }

        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          z-index: 10;
          color: #333;
          padding: 6px;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .modal-close-btn:hover {
          background: white;
          transform: rotate(90deg);
        }

        .close-icon {
          font-size: 1rem;
        }

        .modal-body {
          padding: 0;
        }

        .modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 500px;
        }

        /* Image Section */
        .image-section {
          padding: 30px;
          background: #f8f9fa;
          border-radius: 12px 0 0 12px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .main-image-container {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }

        .main-product-image {
          width: 100%;
          height: 300px;
          object-fit: contain;
          border-radius: 6px;
        }

        .discount-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #ff4444;
          color: white;
          padding: 4px 8px;
          border-radius: 16px;
          font-size: 0.7rem;
          font-weight: 600;
          z-index: 2;
        }

        .wishlist-btn-image {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .wishlist-btn-image:hover {
          background: white;
          transform: scale(1.05);
        }

        .heart-icon {
          font-size: 1.1rem;
          color: #666;
        }

        .thumbnail-gallery {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .thumbnail-item {
          width: 50px;
          height: 50px;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          background: white;
          padding: 2px;
        }

        .thumbnail-item.active {
          border-color: #007bff;
        }

        .thumbnail-item:hover {
          border-color: #007bff;
        }

        .thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
        }

        /* Details Section */
        .details-section {
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
        }

        .product-header {
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 15px;
        }

        .product-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 6px;
          line-height: 1.3;
        }

        .product-subtitle {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.4;
        }

        .price-section {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
        }

        .price-main {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .current-price {
          font-size: 1.6rem;
          font-weight: 700;
          color: #e83e8c;
        }

        .original-price {
          font-size: 1.1rem;
          color: #999;
          text-decoration: line-through;
        }

        .discount-text {
          background: #ffebee;
          color: #e83e8c;
          padding: 3px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .variant-section {
          padding: 15px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .variant-header {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 12px;
        }

        .variant-label {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
        }

        .required-asterisk {
          color: #e83e8c;
        }

        .variant-options-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .variant-option {
          position: relative;
          padding: 10px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          min-width: 80px;
        }

        .variant-option:hover {
          border-color: #007bff;
        }

        .variant-option.selected {
          border-color: #007bff;
          background: #f0f8ff;
        }

        .variant-price {
          font-size: 0.8rem;
          color: #e83e8c;
          font-weight: 600;
        }

        .check-icon {
          position: absolute;
          top: 6px;
          right: 6px;
          color: #007bff;
          font-size: 0.7rem;
        }

        .quantity-section {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
        }

        .quantity-label {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
        }

        .quantity-btn {
          width: 35px;
          height: 35px;
          border: none;
          background: #f8f9fa;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 600;
          transition: background 0.3s ease;
        }

        .quantity-btn:hover:not(:disabled) {
          background: #e9ecef;
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-display {
          width: 50px;
          text-align: center;
          font-weight: 600;
          font-size: 1rem;
        }

        .action-section {
          display: flex;
          gap: 10px;
          padding: 15px 0;
        }

        .btn-grad {
          flex: 1;
          padding: 14px 20px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: white;
          background-image: linear-gradient(to right, #DB3340 0%, #b95044 51%, #d8477c 100%);
          background-size: 200% auto;
          transition: 0.5s;
        }

        .btn-grad:hover {
          background-position: right center;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(219, 51, 64, 0.3);
        }

        .btn-secondary {
          flex: 1;
          padding: 14px 20px;
          background: white;
          color: #333;
          border: 2px solid #333;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #333;
          color: white;
          transform: translateY(-2px);
        }

        .btn-icon {
          font-size: 1rem;
        }

        .features-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 15px 0;
          border-top: 1px solid #f0f0f0;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .feature-icon {
          font-size: 1rem;
          width: 30px;
          text-align: center;
        }

        .feature-text {
          display: flex;
          flex-direction: column;
        }

        .feature-text strong {
          font-size: 0.8rem;
          color: #333;
        }

        .feature-text span {
          font-size: 0.7rem;
          color: #666;
        }

        .meta-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 15px 0;
          border-top: 1px solid #f0f0f0;
        }

        .meta-item {
          display: flex;
          gap: 10px;
        }

        .meta-label {
          font-weight: 600;
          color: #333;
          min-width: 80px;
          font-size: 0.8rem;
        }

        .meta-value {
          color: #666;
          font-size: 0.8rem;
        }

        .in-stock {
          color: #28a745;
          font-weight: 600;
        }

        .view-details-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          padding: 10px 0;
          border-top: 1px solid #f0f0f0;
          transition: color 0.3s ease;
        }

        .view-details-link:hover {
          color: #0056b3;
        }

        .link-icon {
          font-size: 1rem;
        }

        /* Responsive Design */
        @media (max-width: 968px) {
          .modal-content {
            max-width: 95%;
          }
        }

        @media (max-width: 768px) {
          .modal-grid {
            grid-template-columns: 1fr;
            max-height: 80vh;
          }

          .image-section {
            border-radius: 12px 12px 0 0;
            padding: 20px;
          }

          .details-section {
            padding: 20px;
            max-height: 50vh;
            overflow-y: auto;
          }

          .main-product-image {
            height: 250px;
          }
        }

        @media (max-width: 480px) {
          .modal-overlay {
            padding: 10px;
          }

          .modal-content {
            max-height: 90vh;
          }

          .image-section {
            padding: 15px;
          }

          .details-section {
            padding: 15px;
          }

          .main-product-image {
            height: 200px;
          }

          .thumbnail-item {
            width: 40px;
            height: 40px;
          }

          .product-title {
            font-size: 1.3rem;
          }

          .current-price {
            font-size: 1.4rem;
          }

          .action-section {
            flex-direction: column;
          }

          .variant-options-grid {
            justify-content: center;
          }

          .variant-option {
            min-width: 70px;
            padding: 8px 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductModal;