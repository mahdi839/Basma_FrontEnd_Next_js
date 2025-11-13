"use client";
import React, { useEffect, useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/CartSlice";
import Swal from "sweetalert2";
import DynamicLoader from "@/app/components/loader/dynamicLoader";
import ProductCard from "./components/ProductCard";
import Link from "next/link";
import Image from "next/image";
import ProductModal from "./components/ProductModal";
import { useRouter } from "next/navigation";
import CartDrawer from "../../components/CartDrawer";

function FeatureClient({ homeCategories, BannerCatData }) {
  const [isLoading, setIsLoading] = useState(true);
  const sliderRefs = useRef([]);
  const [selectedSizes, setSelectedSizes] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isDirectBuy, setIsDirectBuy] = useState(false);
  let baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state.cart.count);
  const cartItems = useSelector((state) => state.cart.items);
  const router = useRouter()
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    if (homeCategories) {
      setIsLoading(false);
    }
    if (homeCategories?.error) {
      toast.error(homeCategories.error);
    }

    sliderRefs.current = sliderRefs.current.slice(
      0,
      homeCategories?.length || 0
    );
  }, [homeCategories]);

  // Slider settings with autoplay
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Open modal with product details
  function handleOpenModal(product) {
    setSelectedProduct(product);
    setSelectedSizes(""); // Reset selection when opening modal
    setIsModalOpen(true);
  }

  // Close modal
  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedSizes("");
  }

  // close drawer
  const handleCloseDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  function handleSizeSelect(e) {
    setSelectedSizes(e.target.value);
  }

  function handleAddToCart(product, type,preQty) {
    // If modal is open, use the selected product from modal
    const targetProduct = selectedProduct || product;

    let existingCart = cartItems.find(
      (existProduct) => existProduct.id === targetProduct.id
    );
    if (existingCart) {
      Swal.fire({
        title: "Already in the cart",
        text: "This product is already in your cart",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    // Check if user select size or not for multiple sizes
    if (targetProduct.variants.length > 1 && !selectedSizes) {
      Swal.fire({
        title: `Please Select A ${targetProduct?.variants[0]?.attribute ?? "Option"}`,
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    // Find the selected variant for price
    const selectedVariant = targetProduct.variants.find(v => v.id == selectedSizes) || targetProduct.variants[0];

    dispatch(
      addToCart({
        id: targetProduct.id,
        title: targetProduct.title,
        size: selectedSizes ? selectedVariant.value : "",
        price: selectedVariant?.price ?? targetProduct.price,
        image: baseUrl + targetProduct.images?.[0]?.image || "",
        preQty:preQty??0,
      })
    );

    setSelectedSizes(""); // Reset selection
    if (type == 'buy') {
      setIsCartDrawerOpen(true);
      setIsDirectBuy(true)
    }
    handleCloseModal(); // Close modal after adding to cart
    toast.success("Added to cart!");
  }

  if (isLoading) {
    return <DynamicLoader />;
  }

  if (homeCategories?.error) {
    return (
      <div className="text-center my-5">Error: {homeCategories.error} </div>
    );
  }

  if (!homeCategories?.length) {
    return <div className="text-center my-5">No categories found</div>;
  }

  return (
    <div className="container mb-3 mb-md-5 mt-0 py-2 ">
      <div className="row position-relative">
        {homeCategories &&
          homeCategories.map((slot, slotIndex) => {
            if (!sliderRefs.current[slotIndex]) {
              sliderRefs.current[slotIndex] = React.createRef();
            }

            return (
              <React.Fragment key={slot.id || slotIndex}>
                {/* Header with navigation buttons */}
                {
                  slot.products.length > 0 && slot?.banner?.banner_images?.map((img) => {
                    return (
                      <Link key={img.id} href={slot?.banner?.link ?? ""} className="text-decoration-none text-dark my-3">
                        <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}storage/${img?.path}`} alt="banner image" style={{ width: '100%', height: 'auto' }} priority />
                      </Link>
                    );
                  })
                }
                <div className="col-12 d-flex justify-content-between align-items-center mb-1 position-relative">
                  {slot.products.length > 0 && (
                    <h2
                      className="featured-heading font-weight-bold mb-0  fs-5 fs-md-3 fs-lg-2 fs-xl-1"
                      style={{ fontWeight: "600", color: "#222" }}
                    >
                      {slot.name}
                    </h2>
                  )}

                  {slot.products?.length >= 4 && (
                    <div className="d-flex gap-2 mb-1">
                      <button
                        className="d-flex align-items-center justify-content-center slider-nav-btn"
                        onClick={() =>
                          sliderRefs.current[slotIndex]?.current?.slickPrev()
                        }
                      >
                        <FaChevronLeft className="slider-arrow" />
                      </button>
                      <button
                        className="p-2 d-flex align-items-center justify-content-center slider-nav-btn"
                        onClick={() =>
                          sliderRefs.current[slotIndex]?.current?.slickNext()
                        }
                      >
                        <FaChevronRight className="slider-arrow" />
                      </button>
                    </div>
                  )}
                </div>
                {slot.products.length > 0 && (
                  <div className="col-12 position-relative  ml-3 mt-0 overflow-hidden">
                    <hr className="feature-hr m-0" />
                    <div
                      style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        width: "100px",
                        height: "5px",
                        backgroundColor: "#e83e8c",
                        zIndex: "1",
                      }}
                    ></div>
                  </div>
                )}

                {slot.products?.length >= 4 && (
                  <Slider
                    ref={sliderRefs.current[slotIndex]}
                    {...settings}
                    className="w-100"
                  >
                    {slot.products?.map((product, productIndex) => (
                      <ProductCard
                        className={slot.products.length >= 4 ? "mx-2" : ""}
                        key={product.id || productIndex}
                        slotProducts={product}
                        handleOpenModal={handleOpenModal}
                        handleAddToCart={handleAddToCart}
                        slotLength={slot.slot_details?.length}
                      />
                    ))}
                  </Slider>
                )}

                {slot.products?.length < 4 && (
                  <div className="row mx-0">
                    {slot.products?.map((product, productIndex) => (
                      <div key={product.id || productIndex} className="col-6 col-lg-3 col-md-4 px-1 px-md-2">
                        <ProductCard
                          slotProducts={product}
                          handleOpenModal={handleOpenModal}
                          handleAddToCart={handleAddToCart}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}

        {/* Product Modal */}
        {isModalOpen && selectedProduct && (
          <ProductModal
            product={selectedProduct}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            selectedSizes={selectedSizes}
            onSizeSelect={handleSizeSelect}
            onAddToCart={handleAddToCart}
            baseUrl={baseUrl}
          />
        )}

        <CartDrawer
          isOpen={isCartDrawerOpen}
          isDirectBuy={isDirectBuy}
          onClose={handleCloseDrawer}
        />
      </div>
    </div>
  );
}

export default FeatureClient;