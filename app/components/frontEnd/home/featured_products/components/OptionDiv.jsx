import React from 'react'
import { FaTimes } from 'react-icons/fa'

export default function OptionDiv({showOptionDiv,setShowOptionDiv,selectedSizes,handleSizeSelect,product}) {
  return (
    showOptionDiv.productId === product.id && showOptionDiv.status === true && (
        <div className="position-absolute option-div d-flex flex-column justify-content-center">
          <button
            className="position-absolute close-btn bg-transparent border-0"
            onClick={() => setShowOptionDiv({ productId: null, status: false })}
          >
            <FaTimes className="text-dark" />
          </button>

          <div className="size-selector-container p-3">
            <h6 className="text-center mb-3">SELECT SIZE</h6>

            <div className="mb-3">
              <select
                className="form-select form-select-sm"
                value={selectedSizes}
                onChange={(e) => handleSizeSelect(e)}
              >
                <option value="">Choose size</option>
                {product.sizes.map(size => (
                  <option key={size.id} value={size.id}>
                    {size.size} - ৳{size.pivot.price}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-dark w-100 btn-sm"
             
            >
              ADD TO CART
            </button>
          </div>
        </div>
      )
  )
}
