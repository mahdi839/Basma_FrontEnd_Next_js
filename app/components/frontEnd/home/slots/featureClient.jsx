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
import Button from "@/app/components/dashboard/components/button/Button";

function FeatureClient({ homeCategories: initialCategories}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sliderRefs = useRef([]);
  const [selectedSizes, setSelectedSizes] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDirectBuy, setIsDirectBuy] = useState(false);
  const [homeCategories, setHomeCategories] = useState(initialCategories?.data || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(initialCategories?.has_more || false);
  let baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state.cart.count);
  const cartItems = useSelector((state) => state.cart.items);
  const router = useRouter();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    if (initialCategories?.error) {
      toast.error(initialCategories.error);
    }

    sliderRefs.current = sliderRefs.current.slice(
      0,
      homeCategories?.length || 0
    );
  }, [homeCategories, initialCategories]);

  // Slider settings
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
    setSelectedSizes("");
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

  function handleSizeSelect(sizeId) {
    setSelectedSizes(sizeId);
  }

  function handleColorSelect(colorImage) {
    setSelectedColor(colorImage);
  }

  function handleAddToCart(product, type, preQty) {
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

    if (targetProduct.sizes.length > 1 && !selectedSizes) {
      Swal.fire({
        title: `Please Select A Size`,
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    const selectedVariant = targetProduct.sizes.find(v => v.id == selectedSizes) || targetProduct.sizes[0];
    dispatch(
      addToCart({
        id: targetProduct.id,
        title: targetProduct.title,
        size: selectedSizes ? selectedVariant.id : "",
        price: selectedVariant?.pivot.price ?? targetProduct.price,
        image: baseUrl + targetProduct.images?.[0]?.image || "",
        colorImage: selectedColor? baseUrl + selectedColor : null,
        preQty: preQty ?? 1,
      })
    );

    setSelectedSizes("");
    if (type == 'buy') {
      setIsCartDrawerOpen(true);
      setIsDirectBuy(true);
    }
    handleCloseModal();
    toast.success("Added to cart!");
  }

  // Handle Load More - fetch next page from backend
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetch(
        `${baseUrl}api/product-slots_index/frontEndIndex?page=${nextPage}`
      );
      const data = await response.json();

      if (data?.data && data.data.length > 0) {
        setHomeCategories(prev => [...prev, ...data.data]);
        setCurrentPage(nextPage);
        setHasMorePages(data.has_more);
      } else {
        setHasMorePages(false);
      }
    } catch (error) {
      toast.error("Failed to load more categories");
      console.error("Load more error:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return <DynamicLoader />;
  }

  if (initialCategories?.error) {
    return (
      <div className="text-center my-5">Error: {initialCategories.error} </div>
    );
  }

  if (!homeCategories?.length) {
    return <div className="text-center my-5">No categories found</div>;
  }

  return (
    <div className="container mb-3 mb-md-5 mt-0 py-2">
      <div className="row position-relative ">
        {homeCategories &&
          homeCategories.map((slot, slotIndex) => {
            if (!sliderRefs.current[slotIndex]) {
              sliderRefs.current[slotIndex] = React.createRef();
            }

            return (
              <React.Fragment key={slot.id || slotIndex}>
                {/* Banner Images */}
                {slot.products.length > 0 &&
                  slot?.banner?.banner_images?.map((img,index) => {
                    return (
                      <Link
                        key={img.id}
                        href={slot?.banner?.link ?? ""}
                        className="text-decoration-none text-dark my-3"
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}storage/${img?.path}`}
                          alt="banner image"
                          width={1200}
                          height={400}
                          style={{ width: "100%", height: "auto" }}
                          priority={index === 0}
                        />
                      </Link>
                    );
                  })}

                {/* Category Header */}
                <div className="col-12 d-flex justify-content-between align-items-center mb-1 position-relative home_page_card_header">
                  {slot.products.length > 0 && (
                    <h2
                      className="featured-heading font-weight-bold mb-0 fs-5 fs-md-3 fs-lg-2 fs-xl-1"
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

                {/* Horizontal Line */}
                {slot.products.length > 0 && (
                  <div className="col-12 position-relative ml-3 mt-0 overflow-hidden">
                    <hr className="feature-hr m-0" />
                    <div
                      className="feature-hr-div"
                      style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        width: "100px",
                        height: "8px",
                        zIndex: "1",
                      }}
                    ></div>
                  </div>
                )}

                {/* Products Slider (4 or more products) */}
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

                {/* Products Grid (less than 4 products) */}
                {slot.products?.length < 4 && (
                  <div className="row mx-0">
                    {slot.products?.map((product, productIndex) => (
                      <div
                        key={product.id || productIndex}
                        className="col-6 col-lg-3 col-md-4 px-1 px-md-2"
                      >
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

        {/* Load More Button */}
        {hasMorePages && (
          <div className="col-12 text-center my-4">
            <Button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              onMouseEnter={(e) => {
                if (!isLoadingMore) {
                  e.target.style.backgroundColor = "#c02a35";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoadingMore) {
                  e.target.style.backgroundColor = "#DB3340";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                }
              }}
            >
              {isLoadingMore ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading...
                </>
              ) : (
                "Load More "
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {isModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedSizes={selectedSizes}
          onSizeSelect={handleSizeSelect}
          onAddToCart={handleAddToCart}
          onSelectColor={handleColorSelect}
          selectedColor={selectedColor}
          baseUrl={baseUrl}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        isDirectBuy={isDirectBuy}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}

export default FeatureClient;