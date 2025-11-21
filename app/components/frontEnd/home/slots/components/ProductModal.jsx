import React, { useState } from "react";
import { FaTimes, FaCartArrowDown,FaCheck } from "react-icons/fa";
import { CiSearch} from "react-icons/ci";
import { BiSolidPurchaseTag } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import { increament, decreament,} from "@/redux/slices/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import './productModal.css'
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
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [preQty,setPreQty] = useState(1)
  const cartItem = cartItems.find(item=>product.id == item.id);
  if (!isOpen) return null;

  const mainImage = product.images?.[currentImageIndex]?.image
    ? baseUrl + product.images[currentImageIndex]?.image
    : "/placeholder-image.jpg";

  // const selectedVariant = product.variants.find(v => v.id == selectedSizes) || product.variants[0];
  // const displayPrice = selectedVariant?.price ?? product.price;
  // const hasDiscount = product.original_price && product.original_price > displayPrice;
  // const discountPercentage = hasDiscount 
  //   ? Math.round(((product.original_price - displayPrice) / product.original_price) * 100)
  //   : 0;

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleQuantityChange =(id) => {
      setPreQty((prev)=>prev+1);
        dispatch(increament({ id }));
    };

  const handleDecrement =(id)=>{
     dispatch(decreament({id}));
  }

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
                {/* {hasDiscount && (
                  <div className="discount-badge">
                    -{discountPercentage}%
                  </div>
                )} */}
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
                <p className="product-subtitle">{product.short_description}</p>
              </div>

              {/* Price Section */}
              <div className="price-section">
                <div className="price-main">
                  <span className="current-price">৳{cartItem?.totalPrice??product?.price*preQty}</span>
                </div>
              </div>

              {/* Variant Selection */}
              {product.sizes?.length > 1 && (
                <div className="variant-section">
                  <div className="variant-header">
                    {/* <span className="variant-label">
                      {product.variants[0]?.attribute || "Option"}
                    </span> */}
                    <span className="required-asterisk">*</span>
                  </div>
                  <div className="variant-options-grid">
                    {product?.sizes?.map((size) => (
                      <button
                        key={size?.id}
                        // className={`variant-option ${selectedSizes == variant.id ? 'selected' : ''}`}
                        // onClick={() => onSizeSelect({ target: { value: variant.id }})}
                      >
                        {size?.size}
                        {/* <span className="variant-price">{variant.price?"৳":""}{variant.price}</span>
                        {selectedSizes == variant.id && <FaCheck className="check-icon" />} */}
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
                    disabled={cartItem?.qty <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{cartItem?.qty??preQty}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(product?.id)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-section">
                <button
                  className="action-cart-btn btn-grad add-to-cart-btn"
                  onClick={() => onAddToCart(product,'add',preQty)}
                >
                  <FaCartArrowDown className="btn-icon" />
                  Add to Cart
                </button>
                
                <button className="action-cart-btn btn-grad" onClick={() => onAddToCart(product,'buy',preQty)}>
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

    
    </div>
  );
};

export default ProductModal;