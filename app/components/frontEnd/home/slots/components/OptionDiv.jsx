import React from "react";
import { FaTimes } from "react-icons/fa";

export default function OptionDiv({
  showOptionDiv,
  setShowOptionDiv,
  selectedSizes,
  handleSizeSelect,
  product,
  handleAddToCart,
}) {
  return (
    showOptionDiv.productId === product?.id &&
    showOptionDiv.status === true && (
      <div className="position-absolute option-div d-flex flex-column justify-content-center">
        <button
          className="position-absolute close-btn bg-transparent border-0"
          onClick={() => setShowOptionDiv({ productId: null, status: false })}
        >
          <FaTimes className="text-dark" />
        </button>

        <div className="size-selector-container p-3">
          <div className="mb-3">
            <select
              className="form-select form-select-sm"
              value={selectedSizes}
              onChange={(e) => handleSizeSelect(e)}
            >
              <option value="">
                Choose {product?.variants[0]?.attribute ?? ""}{" "}
              </option>
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.value}>
                  {variant.value} - ৳{variant.price}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => handleAddToCart(product)}
            className="btn-grad w-100 btn-sm"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    )
  );
}
