"use client";
import React, { useEffect, useState } from "react";
import District from "@/app/frontEnd/checkout/components/District";
import useStoreData from "@/app/hooks/useStoreData";
import useShowData from "@/app/hooks/useShowData";
import { FaRemoveFormat } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Button from "@/app/components/dashboard/components/button/Button";

export default function CreateOrderPage() {
  const { storeData, loading: submitting } = useStoreData();
  const { showData, data, loading } = useShowData();
  
  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  
  // Cart state
  const [cart, setCart] = useState([
    { id: "", title: "", size: "", unitPrice: 0, qty: 1, totalPrice: 0 }
  ]);

  // Fetch products on component mount
  useEffect(() => {
    showData(process.env.BACKEND_URL + "api/orders/create");
  }, []);

  // Handle district change
  const handleDistrict = (selected) => {
    setDistrict(selected?.value || "");
  };

  // Handle product selection
  const handleProductSelect = (index, productId) => {
    const selectedProduct = data?.data?.products?.find(p => p.id === parseInt(productId));
    if (!selectedProduct) return;

    const updatedCart = [...cart];
    updatedCart[index] = {
      ...updatedCart[index],
      id: selectedProduct.id,
      title: selectedProduct.title,
      size: "",
      unitPrice: selectedProduct.sizes?.length > 0 ? 0 : selectedProduct.price,
      totalPrice: selectedProduct.sizes?.length > 0 ? 0 : selectedProduct.price * updatedCart[index].qty
    };

    setCart(updatedCart);
  };

  // Handle size selection
  const handleSizeSelect = (index, sizeData) => {
    if (!sizeData) return;
    
    // Parse size data (format: "sizeId|sizeName|price")
    const [sizeId, sizeName, price] = sizeData.split('|');
    
    const updatedCart = [...cart];
    updatedCart[index] = {
      ...updatedCart[index],
      size: sizeName,
      unitPrice: parseInt(price),
      totalPrice: parseInt(price) * updatedCart[index].qty
    };

    setCart(updatedCart);
  };

  // Update cart item
  const handleCartChange = (index, field, value) => {
    const updatedCart = [...cart];
    updatedCart[index][field] = value;

    // Auto-calculate total price
    if (field === "qty") {
      updatedCart[index].totalPrice = 
        (Number(updatedCart[index].unitPrice) || 0) * (Number(value) || 0);
    }
    if (field === "unitPrice") {
      updatedCart[index].totalPrice = 
        (Number(value) || 0) * (Number(updatedCart[index].qty) || 0);
    }

    setCart(updatedCart);
  };

  // Add new product row
  const addProductRow = () => {
    setCart([
      ...cart,
      { id: "", title: "", size: "", unitPrice: 0, qty: 1, totalPrice: 0 }
    ]);
  };

  // Remove product row
  const removeProductRow = (index) => {
    if (cart.length > 1) {
      setCart(cart.filter((_, i) => i !== index));
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0);
  const total = subtotal + (Number(shippingCost) || 0);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!name || !address || !district || !paymentMethod) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate cart
    const validCartItems = cart.filter(item => item.id && item.qty > 0);
    if (validCartItems.length === 0) {
      alert("Please add at least one product to the order");
      return;
    }

    const payload = {
      name,
      phone,
      address,
      district,
      shipping_cost: Number(shippingCost),
      delivery_notes: deliveryNotes,
      payment_method: paymentMethod,
      cart: validCartItems
    };

    await storeData(process.env.BACKEND_URL + "api/orders", payload, "Order Created Successfully");
    
    // Reset form after successful submission
    if (!submitting) {
      setName("");
      setPhone("");
      setAddress("");
      setDistrict("");
      setShippingCost(0);
      setPaymentMethod("");
      setDeliveryNotes("");
      setCart([{ id: "", title: "", size: "", unitPrice: 0, qty: 1, totalPrice: 0 }]);
    }
  };

  // Get available sizes for selected product
  const getAvailableSizes = (productId) => {
    const product = data?.data?.products?.find(p => p.id === productId);
    return product?.sizes || [];
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light p-3">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
              
              {/* Header */}
              <div className="card-header text-white py-4" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                <div className="d-flex align-items-center">
                  <i className="fas fa-plus-circle me-3 fs-4"></i>
                  <div>
                    <h4 className="mb-0 fw-bold">Create New Order</h4>
                    <small className="opacity-75">Add a new order to the system</small>
                  </div>
                </div>
              </div>

              <div className="card-body p-4">
                <div className="row g-4">
                  
                  {/* Customer Information Section */}
                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-header bg-transparent border-0 pb-0">
                        <h6 className="text-primary fw-bold mb-0">
                          <i className="fas fa-user me-2"></i>Customer Information
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Customer Name *</label>
                            <input
                              type="text"
                              className="form-control border-2"
                              placeholder="Enter customer name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Phone Number</label>
                            <input
                              type="text"
                              className="form-control border-2"
                              placeholder="Enter phone number"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold">Address *</label>
                            <textarea
                              className="form-control border-2"
                              rows="3"
                              placeholder="Enter full address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">District *</label>
                            <District value={district} onChange={handleDistrict} required />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Payment Method *</label>
                            <select
                              className="form-select border-2"
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              required
                            >
                              <option value="">Select Payment Method</option>
                              <option value="cash">Cash on Delivery</option>
                              <option value="bkash">Bkash</option>
                              <option value="card">Card Payment</option>
                            </select>
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold">Delivery Notes</label>
                            <textarea
                              className="form-control border-2"
                              rows="2"
                              placeholder="Special delivery instructions (optional)"
                              value={deliveryNotes}
                              onChange={(e) => setDeliveryNotes(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products Section */}
                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-header bg-transparent border-0 pb-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="text-primary fw-bold mb-0">
                            <i className="fas fa-shopping-cart me-2"></i>Order Items
                          </h6>
                          <button
                            type="button"
                            onClick={addProductRow}
                            className="btn btn-sm btn-outline-primary rounded-pill"
                          >
                            <i className="fas fa-plus me-1"></i>Add Product
                          </button>
                        </div>
                      </div>
                      
                      <div className="card-body">
                        <div className="row g-3">
                          {cart.map((item, index) => {
                            const selectedProduct = data?.data?.products?.find(p => p.id === item.id);
                            const availableSizes = getAvailableSizes(item.id);
                            
                            return (
                              <div key={index} className="col-12">
                                <div className="card border border-secondary rounded-3">
                                  <div className="card-body p-3">
                                    <div className="row g-3 align-items-end">
                                      
                                      {/* Product Selection */}
                                      <div className="col-md-3">
                                        <label className="form-label fw-semibold small">Product *</label>
                                        <select
                                          className="form-select border-2"
                                          value={item.id}
                                          onChange={(e) => handleProductSelect(index, e.target.value)}
                                          required
                                        >
                                          <option value="">Select Product</option>
                                          {data?.data?.products?.map((product) => (
                                            <option key={product.id} value={product.id}>
                                              {product.title}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* Size Selection */}
                                      <div className="col-md-2">
                                        <label className="form-label fw-semibold small">Size</label>
                                        {availableSizes.length > 0 ? (
                                          <select
                                            className="form-select border-2"
                                            value={item.size ? `${item.size}|${item.unitPrice}` : ""}
                                            onChange={(e) => {
                                              if (e.target.value) {
                                                const [sizeName, price] = e.target.value.split('|');
                                                handleCartChange(index, "size", sizeName);
                                                handleCartChange(index, "unitPrice", parseInt(price));
                                                handleCartChange(index, "totalPrice", parseInt(price) * item.qty);
                                              } else {
                                                handleCartChange(index, "size", "");
                                                handleCartChange(index, "unitPrice", selectedProduct?.price || 0);
                                                handleCartChange(index, "totalPrice", (selectedProduct?.price || 0) * item.qty);
                                              }
                                            }}
                                          >
                                            <option value="">Select Size</option>
                                            {availableSizes.map((size) => (
                                              <option key={size.id} value={`${size.size}|${size.price}`}>
                                                {size.size} - ৳{size.pivot.price}
                                              </option>
                                            ))}
                                          </select>
                                        ) : (
                                          <input
                                            type="text"
                                            className="form-control border-2 bg-light"
                                            value="No sizes"
                                            disabled
                                          />
                                        )}
                                      </div>

                                      {/* Unit Price */}
                                      <div className="col-md-2">
                                        <label className="form-label fw-semibold small">Unit Price *</label>
                                        <input
                                          type="number"
                                          className="form-control border-2"
                                          placeholder="0"
                                          value={availableSizes?.pivot?.price??item.unitPrice}
                                          onChange={(e) => {
                                            handleCartChange(index, "unitPrice", e.target.value);
                                            const total = (Number(e.target.value) || 0) * (Number(item.qty) || 0);
                                            handleCartChange(index, "totalPrice", total);
                                          }}
                                          min="0"
                                          step="0.01"
                                          required
                                        />
                                      </div>

                                      {/* Quantity */}
                                      <div className="col-md-2">
                                        <label className="form-label fw-semibold small">Quantity *</label>
                                        <input
                                          type="number"
                                          className="form-control border-2"
                                          placeholder="1"
                                          value={item.qty}
                                          onChange={(e) => handleCartChange(index, "qty", e.target.value)}
                                          min="1"
                                          required
                                        />
                                      </div>

                                      {/* Total Price */}
                                      <div className="col-md-2">
                                        <label className="form-label fw-semibold small">Total</label>
                                        <div className="input-group">
                                          <span className="input-group-text bg-success text-white fw-bold">৳</span>
                                          <input
                                            type="text"
                                            className="form-control bg-success bg-opacity-10 border-success fw-bold"
                                            value={item.totalPrice.toFixed(2)}
                                            disabled
                                          />
                                        </div>
                                      </div>

                                      {/* Remove Button */}
                                      <div className="col-md-1">
                                        {cart.length > 1 && (
                                          <button
                                          className="border-0 "
                                            onClick={() => removeProductRow(index)}
                                          >
                                            <MdDelete size={22} className="text-danger border-none" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="col-12">
                    <div className="card border-0" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
                      <div className="card-body text-white">
                        <h6 className="fw-bold mb-3">
                          <i className="fas fa-calculator me-2"></i>Order Summary
                        </h6>
                        
                        <div className="row g-3">
                          <div className="col-md-4">
                            <label className="form-label fw-semibold text-white">Shipping Cost *</label>
                            <div className="input-group">
                              <span className="input-group-text">৳</span>
                              <input
                                type="number"
                                className="form-control border-2"
                                placeholder="0"
                                value={shippingCost}
                                onChange={(e) => setShippingCost(e.target.value)}
                                min="0"
                                step="0.01"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="col-md-4">
                            <label className="form-label fw-semibold text-white">Subtotal</label>
                            <div className="input-group">
                              <span className="input-group-text bg-info text-white">৳</span>
                              <input
                                type="text"
                                className="form-control bg-info bg-opacity-25 border-info text-dark fw-bold"
                                value={subtotal.toFixed(2)}
                                disabled
                              />
                            </div>
                          </div>
                          
                          <div className="col-md-4">
                            <label className="form-label fw-semibold text-white">Grand Total</label>
                            <div className="input-group">
                              <span className="input-group-text bg-warning text-dark fw-bold">৳</span>
                              <input
                                type="text"
                                className="form-control bg-warning bg-opacity-25 border-warning text-dark fw-bold fs-5"
                                value={total.toFixed(2)}
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-12">
                    <div className="d-flex justify-content-center gap-3 pt-3 border-top">
                      <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="btn btn-outline-secondary btn-lg px-5 rounded-pill"
                      >
                        <i className="fas fa-arrow-left me-2"></i>Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting || cart.every(item => !item.id)}
                        className="btn btn-primary btn-lg px-5 rounded-pill"
                        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none" }}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Creating Order...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>Create Order
                          </>
                        )}
                      </button>
                    </div>
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