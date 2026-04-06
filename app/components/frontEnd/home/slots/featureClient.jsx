"use client";

import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/CartSlice";
import Swal from "sweetalert2";
import DynamicLoader from "@/app/components/loader/dynamicLoader";
import ProductCard from "./components/ProductCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

function FeatureClient({ homeCategories: initialData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
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
          const products = slot.products || [];

          return (
            <React.Fragment key={slot.id || slotIndex}>
              <div className="col-12 d-flex justify-content-between align-items-center position-relative home_page_card_header mb-2">
                <div className="slot-name">
                  <small className="featured-heading">{slot.name}</small>
                </div>

                <Link
                  href={`/frontEnd/${slot.slug ?? slot.id}`}
                  className="btn btn-outline-dark btn-sm fw-semibold"
                >
                  View All
                </Link>
              </div>

              <div className="row mx-0 mb-4">
                {products.map((product, productIndex) => (
                  <div
                    key={product.id || productIndex}
                    className="col-6 col-md-4 col-lg-3 px-1 px-md-2 mb-3"
                  >
                    <ProductCard
                      slotProducts={product}
                      slotLength={products.length}
                    />
                  </div>
                ))}
              </div>
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
    </div>
  );
}

export default FeatureClient;