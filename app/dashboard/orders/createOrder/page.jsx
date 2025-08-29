
"use client"
import React from 'react'

export default function page() {
   
  return (
   <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div
        className="card shadow-lg rounded-3 border-0 w-100"
        style={{ maxWidth: "800px" }}
      >
        <div
          className="card-header text-white py-3 rounded-top-3"
          style={{ background: "#7d59bf" }}
        >
          <h5 className="mb-0 text-center">Create Order</h5>
        </div>

        <div className="card-body p-4">
          <form>
            <div className="row g-4">
              {/* Name */}
              <div className="col-md-6">
                <div >
                  <input
                    type="text"
                    className="form-control border-secondary"
                    id="name"
                    placeholder="Customer Name"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="col-md-6">
                <div >
                  <input
                    type="text"
                    className="form-control border-secondary"
                    id="phone"
                    placeholder="Phone"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="col-12">
                <div >
                  <textarea
                    className="form-control border-secondary"
                    id="address"
                    placeholder="Address"
                    style={{ height: "100px" }}
                  ></textarea>
                </div>
              </div>

              {/* District */}
              <div className="col-md-6">
                <div >
                  <select
                    className="form-select border-secondary"
                    id="district"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select District
                    </option>
                    <option value="dhaka">Dhaka</option>
                    <option value="chittagong">Chittagong</option>
                    <option value="khulna">Khulna</option>
                  </select>
                </div>
              </div>

              {/* Ordered Products */}
              <div className="col-md-6">
                <div >
                  <select
                    className="form-select border-secondary"
                    id="products"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Product
                    </option>
                    <option value="product1">Product 1</option>
                    <option value="product2">Product 2</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className="col-md-6">
                <div >
                  <select
                    className="form-select border-secondary"
                    id="status"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    <option value="pending">Pending</option>
                    <option value="placed">Placed</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancel">Cancel</option>
                  </select>
                </div>
              </div>

              {/* Shipping Cost */}
              <div className="col-md-6">
                <div >
                  <input
                    type="number"
                    className="form-control border-secondary"
                    id="shipping"
                    placeholder="Shipping Cost"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="col-md-6">
                <div >
                  <select
                    className="form-select border-secondary"
                    id="payment"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Payment Method
                    </option>
                    <option value="cod">Cash on Delivery</option>
                    <option value="bkash">Bkash</option>
                    <option value="card">Card</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-5 pt-3 border-top">
              <div className="d-flex gap-2 justify-content-center">
                <button className="btn bg-danger" type="button">
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  Save Order
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
