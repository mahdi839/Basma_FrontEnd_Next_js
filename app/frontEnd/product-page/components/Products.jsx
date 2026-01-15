"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaCartPlus, FaFacebookMessenger, FaFirstOrder, FaWhatsapp, FaChevronLeft, FaChevronRight, FaCheck } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";
import Zoom from "react-medium-image-zoom";
import { addToCart } from "@/redux/slices/CartSlice";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-medium-image-zoom/dist/styles.css";
import ProductCard from "@/app/components/frontEnd/home/slots/components/ProductCard"; // Adjust path as needed
import ProductModal from "@/app/components/frontEnd/home/slots/components/ProductModal"; // Adjust path as needed
import './relatedProduct.css'
import CartDrawer from "@/app/components/frontEnd/components/CartDrawer";
import './productPage.css'
import useProductLogics from "@/app/hooks/useProductLogics";
import { increament, decreament, } from "@/redux/slices/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import SignProdSkeleton from "./SignProdSkeleton";
export default function Products({ product, socialLinksData, relatedProducts }) {
  const [imgUrl, setImgUrl] = useState("");
  const [activeTab, setActiveTab] = useState("desc");
  const [openFaqId, setOpenFaqId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState(undefined);
  const { handleSelectedColor,
    selectedColor, handleSelectedSize,
    selectedSize, whatsappUrl, preQty,
    handleQuantityIncrease,
    handleQuantityDecrease
  } = useProductLogics(product, socialLinksData.whatsapp_number)

  // Modal states for related products
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isDirectBuy, setIsDirectBuy] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const router = useRouter();
  // Social media links
  const pageId = socialLinksData.facebook_id;
  const messengerUrl = `https://m.me/${pageId}`;


  // Derive variants & images safely
  const variants = product?.variants || [];
  const images = product?.images || [];

  // Price derived from selectedVariant or product.price
  const displayPrice = product?.sizes[0]?.pivot?.price == null ? product?.price : "";
  const cartItem = cartItems.find(item => product.id == item.id);
  useEffect(() => {
    if (product) setIsLoading(false);
    if (product?.error) toast.error(product.error);
  }, [product]);

  // Refs for slider navigation
  const sliderRef = React.useRef(null);

  function handleThumbClick(id) {
    const clickedImg = images.find((img) => String(img.id) === String(id));
    if (clickedImg?.image) setImgUrl(baseUrl + clickedImg.image);
  }

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

    if (product.colors.length > 1 && !selectedColor) {
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
        price: selectedVariant?.pivot?.price ?? product.price,
        image: imageUrl,
        colorImage: selectedColor ? baseUrl + selectedColor : null,
        preQty: preQty ?? 1,
      })
    );

    toast.success("Added to cart!");

    if (type === "order") {
      router.push("/frontEnd/checkout");
    }
  }

  // Functions for related products modal
  function handleOpenModal(product) {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }

  const handleCloseDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  function handleRelatedAddToCart(product, type, preQty) {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      if (type == 'buy') {
        setIsCartDrawerOpen(true);
        setIsDirectBuy(true)
        handleCloseModal();
        return
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


    const selectedVariant = product.sizes.find(s => s.id == selectedSize) || product.sizes[0];
    const imageUrl = product.images?.[0]?.image ? baseUrl + product.images[0].image : "";

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        size: selectedSize ? selectedVariant.id : "",
        price: selectedVariant?.price ?? product.price,
        image: imageUrl,
        colorImage: selectedColor ? baseUrl + selectedColor : null,
        preQty: preQty ?? 0
      })
    );

    handleCloseModal();
    toast.success("Added to cart!");

    if (type === "buy") {
      setIsCartDrawerOpen(true);
      setIsDirectBuy(true)
      handleCloseModal();
    }
  }


  if (isLoading) {
    return (
      <SignProdSkeleton />
    );
  }

  return (
    <div className="container product-page-container">
      <div className="row my-4 my-md-5">
        {/* Product Images */}
        <div className="product_image col-12 col-md-6 mb-4 mb-md-0">
          <div className="main_image mb-3 mb-md-4 text-center">
            <div className="image-container">
              <Zoom>
                <Image
                  src={
                    imgUrl ||
                    (images?.[0]?.image
                      ? `${baseUrl}${images[0].image}`
                      : "/placeholder.png")
                  }
                  alt={product?.title || "product image"}
                  width={500}          // adjust as needed
                  height={400}         // adjust as needed
                  className="card-img-top"
                  priority             // equivalent to loading="eager"
                  style={{ objectFit: "cover" }}
                />
              </Zoom>
            </div>
          </div>
          <div className="sub_image d-flex gap-2 gap-md-3 justify-content-center align-items-center flex-wrap">
            {images?.map((img) => (
              <button
                type="button"
                key={img.id}
                className="thumbnail border-0 bg-transparent p-0"
                onClick={() => handleThumbClick(img.id)}
                aria-label="Show product image"
              >
                <Image
                  className="pl-2"
                  src={baseUrl + img.image}
                  alt="product thumbnail"
                  width={80}
                  height={80}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Description */}
        <div className="product_desc col-12 col-md-6">
          <div className="ms-md-5">
            <h1 className="product-title fw-bold mb-3">{product?.title}</h1>
            {displayPrice && (<h3 className="product-price mb-4">৳ {displayPrice}</h3>)}

            {/* Colors Selection */}
            {product.colors?.length > 0 && (
              <div className="variant-section">
                <div className="variant-header">
                  {/* <span className="variant-label">
                      {product.variants[0]?.attribute || "Option"}
                    </span> */}
                  <div className="quantity-label "><span className="required-asterisk">*{" "}</span>Colors:</div>
                </div>
                <div className="d-flex gap-2 ">
                  {product?.colors?.map((color) => (
                    <div
                      key={color.id}
                      className={`color-img-div ${selectedColor === color.image ? "active" : ""}`}
                      onClick={() => handleSelectedColor(color?.image)}
                    >
                      <img src={process.env.NEXT_PUBLIC_BACKEND_URL + color?.image ?? ""} alt="colorImages" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="d-flex gap-5">
              {/* Quantity Selector */}
              <div className="prod-quantity-section">
                <span className="quantity-label">Quantity:</span>
                <div className="quantity-selector mt-2">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityDecrease(product.id)}
                    disabled={preQty <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">
                    {cartItem?.qty ?? preQty}
                  </span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityIncrease(product?.id)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                {/* sizes Selection */}
                {product.sizes?.length > 1 && (
                  <div className="prod-variant-section">
                    <div className="variant-header">
                      <div className="quantity-label"><span className="required-asterisk">*{" "}</span>Sizes:</div>
                    </div>
                    <div className="variant-options-grid">
                      {product?.sizes?.map((size) => (
                        <button
                          key={size?.id}
                          className={`prod_detailsvariant ${selectedSize == size.id ? 'selected' : ''}`}
                          onClick={() => handleSelectedSize(size.id)}
                        >
                          {size?.size}
                          {selectedSize == size?.id && <FaCheck className="check-icon" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>



            {/* {product?.short_description && (
              <p className="product-description mb-4">{product.short_description}</p>
            )} */}

            <div className="action-buttons d-flex gap-2 ">
              <button className="btn-grad px-3 py-2 rounded-0" onClick={() => handleAddToCart("add")}>
                <span className="pe-1">
                  <FaCartPlus />
                </span>
                Add To Cart
              </button>
              <button className="btn-grad px-3 py-2 rounded-0" onClick={() => handleAddToCart("order")}>
                <span className="pe-1">
                  <FaFirstOrder />
                </span>
                Order Now
              </button>
            </div>

            {/* Messenger and WhatsApp Buttons */}
            <div className="social-buttons d-flex  gap-2 mt-3">
              <a
                href={messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn px-3 py-2 rounded-0 text-white text-decoration-none d-flex align-items-center justify-content-center"
                style={{
                  background: 'linear-gradient(135deg, #0084FF 0%, #0066CC 100%)',
                  border: 'none'
                }}
              >
                <span className="pe-2">
                  <FaFacebookMessenger size={18} />
                </span>
                Messenger
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn px-3 py-2 rounded-0 text-white text-decoration-none d-flex align-items-center justify-content-center"
                style={{
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  border: 'none'
                }}
              >
                <span className="pe-2">
                  <FaWhatsapp size={18} />
                </span>
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


      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="related-products-section mt-5 pt-4">
          <div className="row position-relative">
            <div className="col-12 d-flex justify-content-between align-items-center mb-1 position-relative">
              <h2 className="related-heading font-weight-bold mb-0 fs-4 fs-md-3" style={{ fontWeight: "600", color: "#222" }}>
                Our Latest Products
              </h2>
            </div>

            {relatedProducts.length > 0 && (
              <div className="col-12 position-relative ml-3 mt-0 overflow-hidden">
                <hr className="related-hr m-0" />
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100px",
                    height: "5px",
                    backgroundColor: "#7d0ba7",
                    zIndex: "1",
                  }}
                ></div>
              </div>
            )}

            {/* Related Products Grid */}
            {relatedProducts.length > 0 && (
              <div className="row ">
                {relatedProducts.map((relatedProduct) => (
                  <div
                    key={relatedProduct.id}
                    className="col-6 col-md-4 col-lg-3"
                  >
                    <ProductCard
                      slotProducts={relatedProduct}
                      handleOpenModal={handleOpenModal}
                      handleAddToCart={handleRelatedAddToCart}
                      slotLength={relatedProducts.length}
                      className="related-product-card"
                    />
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Product Modal for Related Products */}
      {isModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedSize={selectedSize}
          onSizeSelect={handleSizeSelect}
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