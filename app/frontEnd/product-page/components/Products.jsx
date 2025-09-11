"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaFirstOrder, FaMinus, FaPhone, FaPlus } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";
import Zoom from "react-medium-image-zoom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/CartSlice";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import "react-medium-image-zoom/dist/styles.css";

export default function Products({ product }) {
  const [imgUrl, setImgUrl] = useState("");
  const [activeTab, setActiveTab] = useState("desc");
  const [show, setShow] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState(0)
  let dispatch = useDispatch()
  let cartItems = useSelector(state => state.cart.items)
  let baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter()
  useEffect(() => {
    if (product) {
      setIsLoading(false)
      if (product.sizes && product.sizes.length > 0) {
        setPrice(product.sizes[0].pivot.price)
      }
    }
    if (product.error) {
      toast.error(product.error)
    }
  }, [product])

  function showImage(id) {
    const clickedImg = product.images.find((img) => img.id == id);
    setImgUrl(baseUrl + clickedImg.image);
  }

  function showTab(id) {
    setActiveTab(id);
  }

  function showAccording(id) {
    setShow((prev) => (prev == id ? 0 : id));
  }

  let selectedSize = ""
  let selectSize = (e) => {
    let sizeId = e.target.value;
    selectedSize = product.sizes.find(size => size.id == sizeId)
    setPrice(selectedSize.pivot.price)
  }

  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  function handleAddToCart(id, type) {
    let existingProduct = cartItems.find(item => item.id === id);
    if (existingProduct && type === 'add') {
      Swal.fire({
        title: "Already in the cart",
        text: "This product is already in your cart",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340"
      })
      return;
    }

    if (product.sizes.length > 1 && !selectedSize) {
      Swal.fire({
        title: "Size Required",
        text: "Please Select A Size",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340"
      })
      return;
    }

    dispatch(addToCart({
      id: product.id,
      title: product.title,
      size: selectedSize ?? "",
      price: product.sizes[0]?.pivot?.price ?? product.price,
      image: baseUrl + product.images?.[0]?.image || ""
    }));
    toast.success("Added to cart!");
    if (type === "order") {
      router.push("/frontEnd/checkout")
    }
  }

  return (
    <>
      <div className="container product-page-container">
        <div className="row my-4 my-md-5">
          {/* Product Images */}
          <div className="product_image col-12 col-md-6 mb-4 mb-md-0">
            <div className="main_image mb-3 mb-md-4 text-center">
              <div className="image-container">
                <Zoom>
                  <img
                    src={imgUrl ? imgUrl : baseUrl + product?.images?.[0]?.image}
                    className="card-img-top"
                    alt="product image"
                  />
                </Zoom>
              </div>
            </div>
            <div className="sub_image d-flex gap-2 gap-md-3 justify-content-center align-items-center flex-wrap">
              {product?.images?.map((img) => (
                <div
                  key={img.id}
                  className="thumbnail"
                  onClick={() => showImage(img.id)}
                >
                  <Image
                    className="pl-2"
                    src={baseUrl + img.image}
                    alt="product thumbnail"
                    width={80}
                    height={80}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Description */}
          <div className="product_desc col-12 col-md-6">
            <div className="ms-md-5">
              <h1 className="product-title fw-bold mb-3">{product?.title}</h1>
              <h3 className="product-price mb-4">৳ {price || product.price || product?.sizes[0]?.pivot.price}</h3>

              {product.sizes.length > 0 && (
                <div className="size-selector mb-4">
                  <span className="size-label me-3 fw-bold">Select Size:</span>
                  <div className="size-options d-flex flex-wrap gap-2">
                    {product.sizes?.map((size, index) => (
                      <div className="form-check" key={size.id}>
                        <input
                          className="form-check-input"
                          id={`size-${size.id}`}
                          type="radio"
                          name="size"
                          value={size.id}
                          onChange={selectSize}
                          defaultChecked={
                            cartItems.some(
                              (item) => item.id === product.id && item.size == size.id
                            )
                          }
                        />
                        <label className="form-check-label fw-bold" htmlFor={`size-${size.id}`}>
                          {size.size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="product-description mb-4">
                {product.description}
              </p>

              <div className="action-buttons d-flex gap-2 flex-wrap">
                <button className="btn-grad px-3 py-2 rounded-0" onClick={() => handleAddToCart(product.id, "add")}>
                  Add To Cart
                </button>
                <button className="btn-grad px-3 py-2 rounded-0" onClick={() => handleAddToCart(product.id, "order")}>
                  <span className="pe-1">
                    <FaFirstOrder />
                  </span>
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="desc_tab_container mt-4 mt-md-5">
          {/* Tabs Header */}
          <div className="tabs-header d-flex flex-wrap justify-content-center gap-2 gap-md-3 mb-4">
            <button
              className={`tab-btn ${activeTab === "desc" ? "active" : ""}`}
              onClick={() => showTab("desc")}
            >
              Description
            </button>
            <button
              className={`tab-btn ${activeTab === "faq" ? "active" : ""}`}
              onClick={() => showTab("faq")}
            >
              FAQ
            </button>
            <button
              className={`tab-btn ${activeTab === "terms" ? "active" : ""}`}
              onClick={() => showTab("terms")}
            >
              Product Video
            </button>
          </div>

          {/* Content Sections */}
          <div className="tab-content">
            {/* Description Tab */}
            {activeTab === "desc" && (
              <div className="description-content animated-fade">
                <div className="content-card p-3 p-md-4">
                  <div className="description-text">
                    {product.description}
                  </div>
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === "faq" && (
              <div className="faq-content animated-fade">
                <div className="content-card p-3 p-md-4">
                  <div className="accordion-list">
                    {product?.faqs?.length > 0 ? (
                      product.faqs.map((faq) => (
                        <div
                          className={`accordion-item ${show === faq.id ? "active" : ""}`}
                          key={faq.id}
                        >
                          <div
                            className="accordion-header p-3"
                            onClick={() => showAccording(faq.id)}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <h4 className="question-text m-0">{faq.question}</h4>
                              <span className="accordion-icon">
                                {show === faq.id ? <IoIosArrowDown /> : <IoIosArrowUp />}
                              </span>
                            </div>
                          </div>
                          {show === faq.id && (
                            <div className="accordion-body p-3">
                              <p className="answer-text m-0">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : <div className="text-center text-danger p-3">No FAQs found.</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Video Tab */}
            {activeTab === "terms" && (
              <div className="terms-content animated-fade">
                <div className="content-card p-3 p-md-4">
                  {product?.video_url ? (
                    <div className="video-container ratio ratio-16x9">
                      <iframe
                        className="youtube-embed"
                        src={`https://www.youtube.com/embed/${getYoutubeVideoId(product.video_url)}`}
                        title="Product Video"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="text-center text-danger">No video available.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


    </>
  );
}