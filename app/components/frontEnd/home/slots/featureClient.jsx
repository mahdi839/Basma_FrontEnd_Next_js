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
import { useRouter } from "next/navigation";
import Button from "@/app/components/dashboard/components/button/Button";
import dynamic from "next/dynamic";
const CartDrawer = dynamic(
  () => import("../../components/CartDrawer"),
  {
    ssr: false,
    loading: () => null,
  }
);

function FeatureClient({ homeCategories: initialData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const sliderRefs = useRef([]);
  const [selectedSizes, setSelectedSizes] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDirectBuy, setIsDirectBuy] = useState(false);

  const [homeCategories, setHomeCategories] = useState(initialData?.data || []);
  const [currentPage, setCurrentPage] = useState(initialData?.current_page || 1);
  const [hasMorePages, setHasMorePages] = useState(initialData?.has_more || false);

  let baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const router = useRouter();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    if (initialData?.error) {
      toast.error(initialData.error);
    }
  }, [homeCategories, initialData]);

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


  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
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

  // OPTIMIZED: Fetch full product details when modal opens
  async function handleOpenModal(product) {
    setIsLoadingProduct(true);
    setIsModalOpen(true);

    try {
      // Fetch full product details with sizes and colors
      const response = await fetch(
        `${baseUrl}api/products/${product.id}`,
        { cache: 'no-store' }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }

      const data = await response.json();
      setSelectedProduct(data.data);
      setSelectedSizes("");
      setSelectedColor("");
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
      setIsModalOpen(false);
    } finally {
      setIsLoadingProduct(false);
    }
  }


  const handleCloseDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  

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

    // For simple products (no variants), add directly
    if (!selectedProduct) {
      dispatch(
        addToCart({
          id: product.id,
          title: product.title,
          size: "",
          price: product.price,
          image: baseUrl + product.images?.[0]?.image || "",
          colorImage: null,
          preQty: preQty ?? 1,
        })
      );
      toast.success("Added to cart!");
      return;
    }

    // For products with variants, validate selections
    const needsSizeSelection = targetProduct.sizes?.length > 0;
    const needsColorSelection = targetProduct.colors?.length > 1;

    if (needsSizeSelection && !selectedSizes) {
      Swal.fire({
        title: `Please Select A Size`,
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    if (needsColorSelection && !selectedColor) {
      Swal.fire({
        title: `Please Select A Color`,
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    // Get selected variant details
    const selectedVariant = targetProduct.sizes?.find(v => v.id == selectedSizes) || targetProduct.sizes?.[0];
    const finalPrice = selectedVariant?.pivot?.price ?? targetProduct.price;

    dispatch(
      addToCart({
        id: targetProduct.id,
        title: targetProduct.title,
        size: selectedSizes || "",
        price: finalPrice,
        image: baseUrl + targetProduct.images?.[0]?.image || "",
        colorImage: selectedColor ? baseUrl + selectedColor : null,
        preQty: preQty ?? 1,
      })
    );

    setSelectedSizes("");
    setSelectedColor("");

    if (type == 'buy') {
      setIsCartDrawerOpen(true);
      setIsDirectBuy(true);
    }

    toast.success("Added to cart!");
  }

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetch(
        `${baseUrl}api/product-slots_index/frontEndIndex?page=${nextPage}`,
        { cache: 'no-store' }
      );
      const responseData = await response.json();

      if (responseData?.data && responseData.data.length > 0) {
        setHomeCategories(prev => [...prev, ...responseData.data]);
        setCurrentPage(nextPage);
        setHasMorePages(responseData.has_more);
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

  if (initialData?.error) {
    return (
      <div className="text-center my-5">Error: {initialData.error} </div>
    );
  }

  if (!homeCategories?.length) {
    return <div className="text-center my-5">No categories found</div>;
  }

  return (
    <div className="container mb-3 mb-md-5 mt-0 py-2">
      <div className="row position-relative ">
        {homeCategories.map((slot, slotIndex) => {
          if (!sliderRefs.current[slotIndex]) {
            sliderRefs.current[slotIndex] = React.createRef();
          }

          return (
            <React.Fragment key={slot.id || slotIndex}>
              {/* Category Header */}
              <div className="col-12 d-flex justify-content-between align-items-center position-relative home_page_card_header">
                {slot.products.length > 0 && (
                  <div className="slot-name">
                    <small className="featured-heading">
                      {slot.name}
                    </small>
                  </div>
                )}

                {slot.products?.length >= 4 && (
                  <Link
                    href={`/frontEnd/${slot.slug ?? slot.id}`}
                    className="btn btn-outline-dark btn-sm fw-semibold"
                  >
                    View All
                  </Link>
                )}
              </div>

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
                      slotLength={slot.products.length}
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
                "Load More"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {isCartDrawerOpen && (
        <CartDrawer
          isOpen={isCartDrawerOpen}
          isDirectBuy={isDirectBuy}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  );
}

export default FeatureClient;