"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaFirstOrder, FaMinus, FaPhone, FaPlus } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";



export default function Products({ products }) {
  const [imgUrl, setImgUrl] = useState("");
  const [activeTab, setActiveTab] = useState("desc");
  const [show, setShow] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState(0)

  let baseUrl = process.env.BACKEND_URL;

  useEffect(() => {
    if (products) {
      setIsLoading(false)
      if (products.sizes && products.sizes.length > 0) {
        setPrice(products.sizes[0].pivot.price)
      }
    }
    if (products.error) {
      toast.error(products.error)
    }
  }, [products])

  console.log(products)

  function showImage(id) {
    const clickedImg = products.images.find((img) => img.id == id);
    setImgUrl(baseUrl + clickedImg.image);
  }

  function showTab(id) {
    setActiveTab(id);
  }
  function showAccording(id) {
    setShow((prev) => (prev == id ? 0 : id));
  }

  let selectSize = (e) => {
    let sizeId = e.target.value;
    let seletedSize = products.sizes.find(size => size.id == sizeId)
    setPrice(seletedSize.pivot.price)
  }

  const getYoutubeVideoId = (url) => {
    if (!url) return null;

    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
  };
  return (
    <>
      <div className="container">
        <div className="row my-5">
          <div className="product_image col-6 d-flex flex-column ">
            <div className="main_image mb-4 " style={{ background: "#0202" }}>
              <Image
                src={imgUrl ? imgUrl : baseUrl + products?.images?.[0].image}
                className="card-img-top"
                alt="product image"
                width={500}
                height={400}
              />
            </div>
            <div className="sub_image d-flex gap-3 justify-content-center align-content-center">
              {products?.images?.map((img) => (
                <div
                  key={img.id}
                  style={{
                    width: "8rem",
                    border: "1px solid #0101",
                    padding: "1rem",
                    cursor: "pointer",
                  }}
                >
                  <Image
                    src={baseUrl + img.image}
                    className=""
                    alt="product image"
                    width={100}
                    height={100}
                    onClick={() => showImage(img.id)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="product_desc col-6 ">
            <div className="ms-5">
              <p className="fw-bold">{products?.title}</p>
              <h5 className="product_price">{price || products?.sizes[0]?.pivot.price}</h5>
              <div className="flex justify-content-center align-items-center mt-3 size-div">
                <span className="me-3 fw-bold">Select</span>
                {products.sizes.map((size, index) => (
                  <div className="d-flex d-inline" key={size.id}>
                    <input className="me-3 " id="m" type="radio" name="size" value={size.id} onChange={selectSize} defaultChecked={index === 0} />
                    <label htmlFor="m" className="me-3 fw-bold">
                      {size.size}
                    </label>
                  </div>

                ))}


              </div>
              <p className="pt-2">
                {products.description}
              </p>
            </div>
            <div className="d-flex ms-5">
              <div className="qty-div">
                <FaMinus className="cart-minus" />
                <input type="nubmer" id="cart-qty" value="1" />
                <FaPlus className="cart-plus" />
              </div>
              <div className="ms-3">
                <button className="btn cart-button">Add To Cart</button>
              </div>
            </div>
            <div className="ms-5">
              <button className=" order_now">
                <span className="pe-1">
                  <FaFirstOrder />
                </span>
                Order Now
              </button>
              <br />
              <button className=" call_now">
                <span className="pe-1">
                  <FaPhone />
                </span>
                01795802507
              </button>
            </div>
          </div>
        </div>
        <div className="desc_tab_container">
          {/* Tabs Header */}
          <div className="tabs-header d-flex justify-content-center gap-3 mb-4">
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
              ADDITIONAL INFORMATION
            </button>
          </div>

          {/* Content Sections */}
          <div className="tab-content">
            {/* Description Tab */}
            {activeTab === "desc" && (
              <div className="description-content animated-fade">
                <div className="content-card">
                  <h3 className="section-title mb-4">Product Details</h3>
                  <p className="description-text">
                    {products.description}
                  </p>

                  {products?.video_url && (
                    <div className="video-container mt-4 w-full">
                      <div className="video-wrapper">
                        <iframe
                          className="youtube-embed"
                          src={`https://www.youtube.com/embed/${getYoutubeVideoId(products.video_url)}`}
                          title="Product Video"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === "faq" && (
              <div className="faq-content animated-fade">
                <div className="content-card">
                  <h3 className="section-title mb-4">Frequently Asked Questions</h3>
                  <div className="accordion-list">
                    {products?.faqs?.map((faq) => (
                      <div
                        className={`accordion-item ${show === faq.id ? "active" : ""}`}
                        key={faq.id}
                      >
                        <div
                          className="accordion-header"
                          onClick={() => showAccording(faq.id)}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <h4 className="question-text">{faq.question}</h4>
                            <span className="accordion-icon">
                              {show === faq.id ? <IoIosArrowDown /> : <IoIosArrowUp />}
                            </span>
                          </div>
                        </div>
                        {show === faq.id && (
                          <div className="accordion-body">
                            <p className="answer-text">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Terms Tab */}
            {activeTab === "terms" && (
              <div className="terms-content animated-fade">
                <div className="content-card">
                  <h3 className="section-title mb-4">Additional Information</h3>
                  <div className="terms-text">
                    <p>
                      {/* Your terms content here */}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
