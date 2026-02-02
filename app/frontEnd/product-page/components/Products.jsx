"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaCartPlus, FaChevronLeft, FaChevronRight, FaFacebookMessenger, FaWhatsapp } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { SiFoursquarecityguide } from "react-icons/si";
import { toast } from "react-toastify";
import Zoom from "react-medium-image-zoom";
import { addToCart } from "@/redux/slices/CartSlice";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import "react-medium-image-zoom/dist/styles.css";
import ProductModal from "@/app/components/frontEnd/home/slots/components/ProductModal";
import CartDrawer from "@/app/components/frontEnd/components/CartDrawer";
import './productPage.css';
import useProductLogics from "@/app/hooks/useProductLogics";
import { useDispatch, useSelector } from "react-redux";
import SignProdSkeleton from "./SignProdSkeleton";
import VirtualizedRelatedProducts from "./VirtualizedRelatedProducts";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useDiscountedPrice from "@/app/hooks/useDiscountedPrice";

export default function Products({ product, socialLinksData, initialRelatedProducts, productId }) {
  const [activeTab, setActiveTab] = useState("desc");
  const [openFaqId, setOpenFaqId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [modalSelectedSize, setModalSelectedSize] = useState(null);
  const [modalSelectedColor, setModalSelectedColor] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [loadingSizeGuide, setLoadingSizeGuide] = useState(false);
  const {
    originalPrice,
    discount,
    discountedPrice
  } = useDiscountedPrice(product);
  const {
    handleSelectedColor,
    selectedColor,
    handleSelectedSize,
    selectedSize,
    whatsappUrl,
    preQty,
    handleQuantityIncrease,
    handleQuantityDecrease, handleThumbClick, imgUrl
  } = useProductLogics(product, socialLinksData.whatsapp_number);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isDirectBuy, setIsDirectBuy] = useState(false);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const router = useRouter();

  const pageId = socialLinksData.facebook_id;
  const messengerUrl = `https://m.me/${pageId}`;

  const variants = product?.variants || [];
  const images = product?.images || [];
  const displayPrice = product?.sizes[0]?.pivot?.price == null ? product?.price : "";
  const cartItem = cartItems.find(item => product.id == item.id);

  const handleCloseDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  useEffect(() => {
    if (product) setIsLoading(false);
    if (product?.error) toast.error(product.error);
  }, [product]);



  function toggleFaq(id) {
    setOpenFaqId((prev) => (prev === id ? 0 : id));
  }

  function getYoutubeVideoId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2]?.length === 11 ? match[2] : null;
  }

  function handleAddToCart(type) {
    if (!product) return;
    const existing = cartItems.find((item) => item.id === product.id);

    if (existing) {
      Swal.fire({
        title: "Already in the cart",
        text: "This product is already in your cart",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    if (product.sizes.length > 1 && !selectedSize) {
      Swal.fire({
        title: `Please Select A Size`,
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    if (product?.colors?.length > 1 && !selectedColor) {
      Swal.fire({
        title: `Please Select A Color`,
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    const selectedVariant = product.sizes.find(s => s.id == selectedSize) || product.sizes[0];
    const imageUrl = product.images?.[0]?.image ? baseUrl + product.images[0].image : "";

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        size: selectedSize ? selectedVariant.id : "",
        price: selectedVariant?.pivot?.price ?? product.discount ?? 0,
        image: imageUrl,
        colorImage: selectedColor ? baseUrl + selectedColor : null,
        preQty: preQty ?? 1,
      })
    );

    if (type === 'buy') {
      setIsDirectBuy(true);
      setIsCartDrawerOpen(true);
    }
    if (type === 'add') {
      setIsDirectBuy(false);
      setIsCartDrawerOpen(true);
    }
    toast.success("Added to cart!");
  }

  function handleSizeSelect(sizeId) {
    setModalSelectedSize(sizeId);
  }

  async function handleOpenModal(product) {
    setModalSelectedSize(null);
    setModalSelectedColor(null);
    setIsModalOpen(true);
    try {
      const response = await fetch(
        `${baseUrl}api/products/${product.id}`,
        { cache: 'no-store' }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }

      const data = await response.json();
      setSelectedProduct(data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
      setIsModalOpen(false);
    }
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }

  function handleRelatedAddToCart(product, type, preQty) {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      if (type == 'buy') {
        setIsCartDrawerOpen(true);
        setIsDirectBuy(true);
        handleCloseModal();
        return;
      }
      Swal.fire({
        title: "Already in the cart",
        text: "This product is already in your cart",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    if (product?.sizes?.length > 1 && !modalSelectedSize) {
      Swal.fire({
        title: "Please select a size",
        icon: "warning",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    if (product?.colors?.length > 1 && !modalSelectedColor) {
      Swal.fire({
        title: "Please select a color",
        icon: "warning",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    const baseProduct = product || selectedProduct;

    const selectedVariant =
      baseProduct?.sizes?.find(s => s.id == modalSelectedSize)
      || baseProduct?.sizes?.[0];
    const imageUrl =
      baseProduct?.image
        ? baseUrl + baseProduct?.image
        : "";
    dispatch(
      addToCart({
        id: baseProduct.id,
        title: baseProduct.title,
        size: modalSelectedSize ?? "",
        price: selectedVariant?.pivot?.price ?? baseProduct.discount ?? 0,
        image: imageUrl,
        colorImage: modalSelectedColor ? baseUrl + modalSelectedColor : null,
        preQty: preQty ?? 1,
      })
    );
    handleCloseModal();
    toast.success("Added to cart!");

    if (type === "buy") {
      setIsCartDrawerOpen(true);
      setIsDirectBuy(true);
    }
  }

  if (isLoading) {
    return <SignProdSkeleton />;
  }

  function fetchSizeGuideData() {
    setShowSizeGuide(true);
  }

  const sizeGuideImage = "/img/size_guide/shoe.webp";

  // Arrow components for slider
  function NextArrow({ onClick }) {
    return (
      <button
        className="custom-slick-arrow custom-slick-next"
        onClick={onClick}
      >
        <FaChevronRight />
      </button>
    );
  }

  function PrevArrow({ onClick }) {
    return (
      <button
        className="custom-slick-arrow custom-slick-prev"
        onClick={onClick}
      >
        <FaChevronLeft />
      </button>
    );
  }

  // Slider settings for thumbnails
  const thumbSliderSettings = {
    dots: false,
    arrows: true,
    infinite: images.length > 4,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container product-page-container">
      <div className="row my-4 my-md-5 g-4">
        {/* Product Images */}
        <div className="col-12 col-md-6">
          <div className="product-gallery-wrapper">
            <div className="main-image-container">
              <Zoom>
                <Image
                  src={
                    imgUrl ||
                    (images?.[0]?.image
                      ? `${baseUrl}${images[0].image}`
                      : "/placeholder.png")
                  }
                  alt={product?.title}
                  width={600}
                  height={600}
                  className="img-fluid"
                  priority
                  style={{ objectFit: "contain" }}
                />
              </Zoom>
            </div>
            {images?.length > 1 && (
              <div className="thumbnails-container">
                {images.length >= 4 ? (
                  <Slider {...thumbSliderSettings}>
                    {images.map((img) => (
                      <div key={img.id} className="px-1">
                        <button
                          type="button"
                          className={`sub-img ${imgUrl === `${baseUrl}${img.image}` ? "active" : ""
                            }`}
                          onClick={() => handleThumbClick(img.id)}
                          style={{
                            padding: 0,
                            overflow: 'hidden',
                            background: '#f8f9fa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Image
                            src={baseUrl + img.image}
                            alt="product thumbnail"
                            width={80}
                            height={80}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </button>
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="d-flex gap-2 flex-wrap">
                    {images.map((img) => (
                      <div key={img.id} style={{ flex: '0 0 auto', width: '80px' }}>
                        <button
                          className={`sub-img ${imgUrl === `${baseUrl}${img.image}` ? "active" : ""
                            }`}
                          onClick={() => handleThumbClick(img.id)}
                          style={{
                            width: '100%',
                            height: '80px',
                            padding: 0,
                            background: '#f8f9fa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}
                        >
                          <Image
                            src={baseUrl + img.image}
                            alt="product thumbnail"
                            width={80}
                            height={80}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Product Description & Options */}
        <div className="col-12 col-md-6">
          <div className="product-info-card">
            {/* Product Header */}
            <div className="product-header">
              <h1 className="product-title">{product?.title}</h1>

              {product?.sku && (
                <div className="product-sku">
                  SKU: <strong>{product.sku}</strong>
                </div>
              )}

              {product?.status === 'prebook' && (
                <div className="preorder-badge">
                  ⚡ Pre Order, Delivery Time 20 to 25 Days
                </div>
              )}
            </div>
            {/* Price Display */}
            <div className="price-section">
              {/* Show original price only if discount exists */}

              <div className="discount-price text-decoration-line-through">
                {product?.price ?? 0}৳
              </div>

              {product?.discount > 0 && (
                <div className="product-price">
                  {(product?.discount ?? 0) * (preQty ?? 1)}৳
                </div>
              )}
            </div>

            {/* Colors Selection */}
            {product.colors?.length > 0 && (
              <div className="variant-section">
                <div className="variant-section-title">
                  <span className="required-asterisk">*</span>
                  Colors:
                </div>
                <div className="color-selector-grid">
                  {product?.colors?.map((color) => (
                    <div
                      key={color.id}
                      className={`color-option-card ${selectedColor === color.image ? "selected" : ""
                        }`}
                      onClick={() => handleSelectedColor(color?.image)}
                      title={color.name || `Color option ${color.id}`}
                    >
                      <img
                        src={process.env.NEXT_PUBLIC_BACKEND_URL + color?.image ?? ""}
                        alt={color.name || "Color option"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selection */}
            {product.sizes?.length > 0 && (
              <div className="variant-section">
                <div className="variant-section-title">
                  <span className="required-asterisk">*</span>
                  Sizes:
                </div>
                <div className="size-selector-grid">
                  {product?.sizes?.map((size) => {
                    const sizePrice = size?.pivot?.price;
                    const isSelected = selectedSize == size.id;

                    return (
                      <button
                        key={size?.id}
                        className={`size-option-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectedSize(size.id)}
                      >
                        {size?.size}
                        {sizePrice && (
                          <span className="size-price">৳{sizePrice}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* size guide btn div */}
            <div className="my-3">
              <button
                className="btn btn-sm"
                onClick={fetchSizeGuideData}
              >
                <SiFoursquarecityguide />
                Size Guide
              </button>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons-container">
              {/* Quantity Selector */}
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityDecrease(product.id)}
                  disabled={preQty <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="quantity-display">
                  {cartItem?.qty ?? preQty}
                </span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityIncrease(product?.id)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                className="single-prod-action-btn btn-grad"
                onClick={() => handleAddToCart("add")}
              >
                <FaCartPlus size={16} />
                Add to Cart
              </button>
              <button
                className="single-prod-action-btn btn-grad"
                onClick={() => handleAddToCart("buy")}
              >
                <FaCartPlus size={16} />
                Buy Now
              </button>
            </div>

            {/* Social Buttons */}
            <div className="social-buttons-container">
              <a
                href={messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn messenger-btn"
              >
                <FaFacebookMessenger size={16} />
                Messenger
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn whatsapp-btn"
              >
                <FaWhatsapp size={16} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="desc_tab_container mt-4 mt-md-5">
        {/* Tabs Header */}
        <div className="tabs-header d-flex flex-wrap justify-content-center gap-2 gap-md-3 mb-4">
          <button className={`tab-btn ${activeTab === "desc" ? "active" : ""}`} onClick={() => setActiveTab("desc")}>
            Description
          </button>
          <button className={`tab-btn ${activeTab === "faq" ? "active" : ""}`} onClick={() => setActiveTab("faq")}>
            FAQ
          </button>
          <button className={`tab-btn ${activeTab === "video" ? "active" : ""}`} onClick={() => setActiveTab("video")}>
            Product Video
          </button>
        </div>

        {/* Content Sections */}
        <div className="tab-content">
          {activeTab === "desc" && (
            <div className="description-content animated-fade">
              <div className="content-card p-3 p-md-4">
                <div className="description-text">{product?.description}</div>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="faq-content animated-fade">
              <div className="content-card p-3 p-md-4">
                <div className="accordion-list">
                  {product?.faqs?.length > 0 ? (
                    product.faqs.map((faq) => (
                      <div className={`accordion-item ${openFaqId === faq.id ? "active" : ""}`} key={faq.id}>
                        <button
                          type="button"
                          className="accordion-header p-3 w-100 text-start border-0 bg-transparent"
                          onClick={() => toggleFaq(faq.id)}
                          aria-expanded={openFaqId === faq.id}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <h4 className="question-text m-0">{faq.question}</h4>
                            <span className="accordion-icon">
                              {openFaqId === faq.id ? <IoIosArrowDown /> : <IoIosArrowUp />}
                            </span>
                          </div>
                        </button>
                        {openFaqId === faq.id && (
                          <div className="accordion-body p-3">
                            <p className="answer-text m-0">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-danger p-3">No FAQs found.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "video" && (
            <div className="terms-content animated-fade">
              <div className="content-card p-3 p-md-4">
                {product?.video_url && getYoutubeVideoId(product.video_url) ? (
                  <div className="video-container ratio ratio-16x9">
                    <iframe
                      className="youtube-embed"
                      src={`https://www.youtube.com/embed/${getYoutubeVideoId(product.video_url)}`}
                      title="Product Video"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="text-center text-danger">No video available.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showSizeGuide && (
        <div className="size-guide-overlay">
          <div className="size-guide-content">
            <button
              className="size-guide-close"
              onClick={() => setShowSizeGuide(false)}
            >
              ✕
            </button>

            <Image
              src={sizeGuideImage}
              alt="Size Guide"
              width={600}
              height={800}
              className="img-fluid"
            />
          </div>
        </div>
      )}

      {/* VIRTUALIZED Related Products with Infinite Scroll */}
      <VirtualizedRelatedProducts
        initialProducts={initialRelatedProducts}
        productId={productId}
        handleOpenModal={handleOpenModal}
        handleRelatedAddToCart={handleRelatedAddToCart}
      />

      {/* Product Modal for Related Products */}
      {isModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedSize={modalSelectedSize}
          onSizeSelect={setModalSelectedSize}
          selectedColor={modalSelectedColor}
          onSelectColor={setModalSelectedColor}
          onAddToCart={handleRelatedAddToCart}
          baseUrl={baseUrl}
        />
      )}

      <CartDrawer
        isOpen={isCartDrawerOpen}
        isDirectBuy={isDirectBuy}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}