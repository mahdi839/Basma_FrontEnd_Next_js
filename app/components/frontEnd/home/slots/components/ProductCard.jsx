import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { FaCartArrowDown } from "react-icons/fa";
import { GrAidOption } from "react-icons/gr";
import Zoom from "react-medium-image-zoom";
const ProductCard = React.memo(function ProductCard({
  slotProducts,
  handleOpenModal,
  handleAddToCart,
  slotLength,
  className
}) {
  let baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const sizesCount = slotProducts?.sizes_count ?? 0;
  const colorsCount = Array.isArray(slotProducts?.colors)
    ? slotProducts.colors.length
    : 0;
  const showSelectOptions =
    sizesCount > 0 || colorsCount > 1;


  return (
    <div className={`${slotLength >= 4 ? "px-1" : ''} ${className} my-2 my-md-5 position-relative`}>
      <div
        className="card product-div p-1 p-md-2 bg-white h-100 product-card position-relative"
      >
        {/* Product Image */}
        <div
          className="position-relative overflow-hidden product-image-container"
        >
          <Link href={`/frontEnd/product-page/${slotProducts?.id}`}>
            <Image
              width={500}
              height={400}
              src={
                slotProducts?.images?.[0]?.image
                  ? baseUrl + slotProducts?.images[0]?.image
                  : ""
              }
              className="position-absolute w-100 h-100 object-fit-cover p-0 p-md-3 product-image"
              alt={slotProducts?.title}
              priority={false}
            />
          </Link>
          {/* Product Actions */}
          <div
            className="quick-add-btn product-actions position-absolute d-flex flex-column"
          >
            <Link href={`/frontEnd/product-page/${slotProducts?.id}`}>
              <button
                className="rounded-circle mb-2 p-2 action-btn d-flex justify-content-center"
              >
                <CiSearch className="fs-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Product Body */}
        <div className="card-body px-2 px-md-3 pb-1 pb-md-2 pt-2 pt-md-3">
          <p className="mb-1">
            <Link
              href={`/frontEnd/product-page/${slotProducts?.id}`}
              className="text-decoration-none text-dark fw-bold"
            >
              {slotProducts?.title}
            </Link>
          </p>
          <div className="d-flex justify-content-between align-items-center mt-1 mt-md-2">
            <div>
              <span
                className="fw-bold product-price"
              >
                {`${slotProducts?.price ? "৳" : ""} ${slotProducts?.price ?? ""}`}
              </span>
            </div>
          </div>
        </div>

        <div
          className="card-footer bg-transparent border-0 pt-0 add-to-cart-footer d-lg-none d-block px-2 px-md-3"
        >
          {showSelectOptions ? (
            <button
              type="button"
              className="btn-grad w-100 rounded-0 select-options-btn-sm py-1"
              onClick={() => handleOpenModal(slotProducts)}
            >
              Select options
            </button>
          ) : (
            <button
              type="button"
              className="btn-grad w-100 rounded-0 add-to-cart-btn-sm py-1"
              onClick={() => handleAddToCart(slotProducts)}
            >
              Add to cart
            </button>
          )}

        </div>

        <div
          className="card-footer bg-transparent border-0 pt-0 pb-3 px-3 add-to-cart-footer-lg d-none d-lg-block"
        >
          {showSelectOptions ? (
            <button
              type="button"
              className="btn-grad w-100 rounded-0 select-options-btn-sm py-1"
              onClick={() => handleOpenModal(slotProducts)}
            >
              Select options
            </button>
          ) : (
            <button
              type="button"
              className="btn-grad w-100 rounded-0 add-to-cart-btn-sm py-1"
              onClick={() => handleAddToCart(slotProducts)}
            >
              Add to cart
            </button>
          )}

        </div>
      </div>
      {slotProducts.status === 'prebook' && (
        <div
          className="position-absolute  m-2 px-3 py-1  shadow-sm product_status_badge"
          style={{ fontSize: "12px", letterSpacing: "0.5px" }}
        >
          PRE-BOOK
        </div>
      )}
    </div>
  );
});

export default ProductCard;