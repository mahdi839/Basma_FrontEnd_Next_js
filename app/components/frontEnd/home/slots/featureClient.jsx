"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/CartSlice";
import Swal from "sweetalert2";
import DynamicLoader from "@/app/components/loader/dynamicLoader";
import ProductCard from "./components/ProductCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const FeatureSlider = dynamic(() => import("./components/FeatureSlider"), {
  ssr: false,
  loading: () => null,
});

const CartDrawer = dynamic(() => import("../../components/CartDrawer"), {
  ssr: false,
  loading: () => null,
});

function FeatureClient({ homeCategories: initialData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sliderRefs = useRef([]);
  const [selectedSizes, setSelectedSizes] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDirectBuy, setIsDirectBuy] = useState(false);

  const [homeCategories, setHomeCategories] = useState(
    Array.isArray(initialData?.data) ? initialData.data : []
  );
  const [currentPage, setCurrentPage] = useState(initialData?.current_page || 1);
  const [hasMorePages, setHasMorePages] = useState(initialData?.has_more || false);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const router = useRouter();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    if (initialData?.error) {
      toast.error(initialData.error);
    }
  }, [initialData]);

  const normalizedSlots = useMemo(() => {
    return (Array.isArray(homeCategories) ? homeCategories : [])
      .map((slot) => ({
        ...slot,
        products: Array.isArray(slot?.products) ? slot.products : [],
      }))
      .filter((slot) => slot.products.length > 0);
  }, [homeCategories]);

  const handleCloseDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  function handleAddToCart(product, type, preQty) {
    const targetProduct = selectedProduct || product;

    const existingCart = cartItems.find(
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

    if (!selectedProduct) {
      dispatch(
        addToCart({
          id: product.id,
          title: product.title,
          size: "",
          price: product.price,
          image: product.images?.[0]?.image
            ? baseUrl + product.images[0].image
            : "",
          colorImage: null,
          preQty: preQty ?? 1,
        })
      );
      toast.success("Added to cart!");
      return;
    }

    const needsSizeSelection = targetProduct.sizes?.length > 0;
    const needsColorSelection = targetProduct.colors?.length > 1;

    if (needsSizeSelection && !selectedSizes) {
      Swal.fire({
        title: "Please Select A Size",
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    if (needsColorSelection && !selectedColor) {
      Swal.fire({
        title: "Please Select A Color",
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    const selectedVariant =
      targetProduct.sizes?.find((v) => v.id == selectedSizes) ||
      targetProduct.sizes?.[0];

    const finalPrice = selectedVariant?.pivot?.price ?? targetProduct.price;

    dispatch(
      addToCart({
        id: targetProduct.id,
        title: targetProduct.title,
        size: selectedSizes || "",
        price: finalPrice,
        image: targetProduct.images?.[0]?.image
          ? baseUrl + targetProduct.images[0].image
          : "",
        colorImage: selectedColor ? baseUrl + selectedColor : null,
        preQty: preQty ?? 1,
      })
    );

    setSelectedSizes("");
    setSelectedColor("");

    if (type === "buy") {
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
        { cache: "no-store" }
      );

      const responseData = await response.json();

      const nextSlots = Array.isArray(responseData?.data) ? responseData.data : [];

      if (nextSlots.length > 0) {
        setHomeCategories((prev) => [...prev, ...nextSlots]);
        setCurrentPage(nextPage);
        setHasMorePages(responseData?.has_more ?? false);
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
    return <div className="text-center my-5">Error: {initialData.error}</div>;
  }

  if (!normalizedSlots.length) {
    return <div className="text-center my-5">No categories found</div>;
  }

  return (
    <div className="container mb-3 mb-md-5 mt-0 py-2">
      <div className="row position-relative">
        {normalizedSlots.map((slot, slotIndex) => {
          if (!sliderRefs.current[slotIndex]) {
            sliderRefs.current[slotIndex] = React.createRef();
          }

          const products = slot.products || [];
          const isSlider = products.length >= 4;

          return (
            <React.Fragment key={slot.id || slotIndex}>
              <div className="col-12 d-flex justify-content-between align-items-center position-relative home_page_card_header mb-2">
                <div className="slot-name">
                  <small className="featured-heading">{slot.name}</small>
                </div>

                {isSlider && (
                  <Link
                    href={`/frontEnd/${slot.slug ?? slot.id}`}
                    className="btn btn-outline-dark btn-sm fw-semibold"
                  >
                    View All
                  </Link>
                )}
              </div>

              {isSlider ? (
                <div className="col-12">
                  <FeatureSlider
                    products={products}
                    handleAddToCart={handleAddToCart}
                    sliderRef={sliderRefs.current[slotIndex]}
                  />
                </div>
              ) : (
                <div className="row mx-0 mb-4">
                  {products.map((product, productIndex) => (
                    <div
                      key={product.id || productIndex}
                      className="col-6 col-lg-3 col-md-4 px-1 px-md-2"
                    >
                      <ProductCard
                        slotProducts={product}
                        slotLength={products.length}
                        handleAddToCart={handleAddToCart}
                      />
                    </div>
                  ))}
                </div>
              )}
            </React.Fragment>
          );
        })}

        {hasMorePages && (
          <div className="col-12 text-center my-4">
            <button
              className="slot-loadmore-btn"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : (
                <div>Load More</div>
              )}
            </button>
          </div>
        )}
      </div>

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