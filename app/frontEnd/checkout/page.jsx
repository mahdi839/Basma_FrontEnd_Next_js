"use client";
import React, { useEffect, useState } from "react";
import { FaLock, FaMoneyBill } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux/slices/CartSlice";
import Link from "next/link";
import District from "./components/District";
import useGetSingleData from "@/app/hooks/useGetSingleData";
import useStoreData from "@/app/hooks/useStoreData";
import { useRouter } from "next/navigation";


function CheckoutPage() {
  const cartItems = useSelector(state => state.cart.items);
  const totalPrice = cartItems.reduce((total, item) => total + item.totalPrice, 0);
  const dispatch = useDispatch();
  const [shippingAmount, setShippingAmount] = useState(0);
  const route = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    district: '',
    payment_method: 'cash',
    delivery_notes: '',
    cart: cartItems,
    shipping_cost: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const { fetchSingleData, loading, data } = useGetSingleData()
  const latestApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + "api/shipping-costs-latest"
  useEffect(() => {
    fetchSingleData(latestApiUrl)
  }, [])
  useEffect(() => {

    if (data && formData.district) {
      const isDhaka = formData.district === 'dhaka';

      if (data.inside_dhaka && data.outside_dhaka) {
        setShippingAmount(isDhaka ? data.inside_dhaka : data.outside_dhaka);
      } else if (data.one_shipping_cost) {
        setShippingAmount(data.one_shipping_cost);
      } else {
        setShippingAmount(0); // fallback
      }
    }
  }, [data, formData.district])

  const handleDistrictChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      district: selectedOption?.value || "",
    }));
  };
  const { storeData } = useStoreData();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Update shipping_cost in formData before sending
    const updatedFormData = {
      ...formData,
      shipping_cost: shippingAmount,
    };

    const storeOrderUrl = process.env.NEXT_PUBLIC_BACKEND_URL + "api/orders";
    storeData(storeOrderUrl, updatedFormData, 'Thank you for your purchase! Order placed successfully.');
    dispatch(clearCart())
    route.push("/")

  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-header py-3">
              <h5 className="mb-0">Checkout Details</h5>
            </div>

            <form onSubmit={handleSubmit} className="card-body">
              {/* Personal Information */}
              <div className="mb-4">
                <h5 className="mb-3">Personal Information</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label"> Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>


                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input
                      type="number"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-4">
                <h5 className="mb-3">Shipping Address</h5>
                <div className="row g-3 mb-3">
                  <div className="col-md-12">

                    <div className="mb-3">
                      <label htmlFor="district" className="form-label">District</label>
                      <District
                        value={formData.district}
                        onChange={handleDistrictChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Notes Field */}
                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">Delivery Notes (Optional)</label>
                  <textarea
                    className="form-control"
                    id="delivery_notes"
                    name="delivery_notes"
                    rows="3"
                    placeholder=""
                    value={formData.delivery_notes}
                    onChange={handleChange}
                  ></textarea>
                  <div className="form-text">E.g., building location, landmark, or preferred delivery time</div>
                </div>

              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <h5 className="mb-3">Payment Method</h5>
                <div className="d-flex flex-column gap-3">

                  <div className="form-check border rounded p-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="cash"
                      value={formData.cash}
                      checked={formData.payment_method === 'cash'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label d-flex align-items-center" htmlFor="cash">
                      <FaMoneyBill className="me-2 fs-5 text-success" />
                      Cash on Delivery
                    </label>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <Link href="/cart" className="btn btn-outline-secondary">
                  Back to Cart
                </Link>
                <button type="submit" className="btn btn-primary" >
                  <FaLock className="me-2" />
                  Complete Purchase
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-4">
          <div className={`card shadow-sm `}>
            <div className={``}></div>
            <div className="card-header py-3">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush mb-4">
                {cartItems.map(item => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <div>
                      <span className="fw-medium">{item.title}</span>
                      <div className="small text-muted">
                        Qty: {item.qty} × {item.unitPrice} TK
                      </div>
                    </div>
                    <span>{item.totalPrice} TK</span>
                  </li>
                ))}

                <li className="list-group-item d-flex justify-content-between align-items-center px-0 border-bottom-0">
                  <span>Subtotal</span>
                  <span>{totalPrice} TK</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 border-bottom-0">
                  <span>Shipping</span>
                  <span className="text-success">{shippingAmount}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 fw-bold fs-5">
                  <span>Total</span>
                  <span>{totalPrice + shippingAmount} TK</span>
                </li>
              </ul>

              <div className="alert alert-info small mb-4">
                <div className="d-flex">
                  <div className="flex-shrink-0 me-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                    </svg>
                  </div>
                  <div>
                    Your personal data will be used to process your order and for other purposes described in our privacy policy.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;