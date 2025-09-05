import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { FaCartArrowDown } from "react-icons/fa";
import OptionDiv from "./OptionDiv";

import { GrAidOption } from "react-icons/gr";
const ProductCard = React.memo(function ProductCard({
  slotProducts,
  showOptionDiv,
  setShowOptionDiv,
  selectedSizes,
  handleSizeSelect,
  handleAddToCart,
  handleOptionDiv,
}) {
  let baseUrl = process.env.BACKEND_URL;

  return (
    <div className={`px-md-2 my-5`}>
      <div
        className="card product-div  p-2 bg-white h-100 product-card position-relative"
       
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
                  : "/img/product/dress-1.png"
              }
              className="position-absolute w-100 h-100 object-fit-cover p-3 product-image"
              alt={slotProducts?.title}
              
            />
          </Link>
          {/* Product Actions */}
          {showOptionDiv.status === false && (
            <div
              className="quick-add-btn product-actions position-absolute d-flex flex-column "
              
            >
              <Link href={`/frontEnd/product-page/${slotProducts?.id}`}>
                <button
                  className="  rounded-circle mb-2 p-2 action-btn d-flex justify-content-center"
                
                >
                  <CiSearch className="fs-5 "  />
                </button>
              </Link>
             
            </div>
          )}

          {/* Quick add to cart button (shown on hover) */}
        </div>

        {/* Product Body */}
        <div className="card-body px-3 pb-2 pt-3">
          <h5 className="card-title mb-1">
            <Link
              href={`/frontEnd/product-page/${slotProducts?.id}`}
              className="text-decoration-none text-dark product-title"
            
            >
              {slotProducts?.title}
            </Link>
          </h5>
          <Link href={`/frontEnd/product-page/${slotProducts?.id}`}>
            <p
              className="text-muted small mb-2 product-subtitle"
              
            >
              {slotProducts?.sub_title}
            </p>
          </Link>

          <div className="d-flex  justify-content-between align-items-center mt-2">
            <div>
              <span
                className="text-dark fw-bold product-price"
              >
                ৳{slotProducts?.sizes[0]?.pivot.price || slotProducts?.price}
              </span>
            </div>
          </div>
        </div>

        <div
          className="card-footer bg-transparent border-0 pt-0 pb-3  add-to-cart-footer d-lg-none d-block"
          
        >
          {slotProducts?.sizes?.length > 1 ? (
            <button
              type="button"
              className="bg-transparent w-100 rounded-0"
              onClick={(e) => handleOptionDiv(e, slotProducts?.id)}
            >
              <GrAidOption className="me-2" />
              Select options
            </button>
          ) : (
            <button
              className="btn-grad w-100 rounded-0"
              onClick={() => handleAddToCart(slotProducts)}
            >
              <FaCartArrowDown className="me-2" />
              Add to cart
            </button>
          )}
        </div>

        <div
          className="card-footer bg-transparent border-0 pt-0 pb-3 px-3 add-to-cart-footer-lg d-none d-lg-block "
          
        >
          {slotProducts?.sizes?.length > 1 ? (
            <button
              type="button"
              className="bg-transparent w-100 rounded-0"
              onClick={(e) => handleOptionDiv(e, slotProducts?.id)}
            >
              <GrAidOption className="me-2" />
              Select options
            </button>
          ) : (
            <button
              className="btn-grad w-100 rounded-0"
              onClick={() => handleAddToCart(slotProducts)}
            >
              <FaCartArrowDown className="me-2" />
              Add to cart
            </button>
          )}
        </div>
        {/* options div component start */}

        <OptionDiv
          showOptionDiv={showOptionDiv}
          setShowOptionDiv={setShowOptionDiv}
          selectedSizes={selectedSizes}
          handleSizeSelect={handleSizeSelect}
          product={slotProducts}
          handleAddToCart={handleAddToCart}
        />

        {/* options selection div end */}
      </div>
    </div>
  );
});
export default ProductCard;
