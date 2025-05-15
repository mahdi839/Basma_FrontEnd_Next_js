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
        <div className="desc_tab_header d-flex justify-content-center gap-5">
          <button
            className={`btn ${activeTab == "desc" ? "active" : ""} `}
            onClick={() => showTab("desc")}
          >
            Description
          </button>
          <button
            className={`btn ${activeTab == "faq" ? "active" : ""} `}
            onClick={() => showTab("faq")}
          >
            FAQ
          </button>
          <button
            className={`btn ${activeTab == "terms" ? "active" : ""} `}
            onClick={() => showTab("terms")}
          >
            Terms & condition
          </button>
        </div>
        {activeTab == "desc" && (
          <div className="flex justify-content-center desc-text">
            <p className="p-3">
              {products.description}
            </p>



            {products?.video_url && (
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
                {(() => {
                  // Only proceed if there's a video URL
                  if (!products?.video_url) return null;

                  // Extract the video ID
                  const videoId = getYoutubeVideoId(products.video_url);

                  // Only render if we have a valid video ID
                  if (!videoId) return null;

                  return (
                    <iframe
                      width="560"
                      height="315"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    ></iframe>
                  );
                })()}
              </div>
            )}

          </div>
        )}
        {activeTab == "faq" && (
          <div className=" faq-text card  my-3">
            {
              products?.faqs?.map((faq) => (
                <div
                  className="d-flex flex-column border accordion-div mx-auto mb-2   mt-3 "
                  onClick={() => showAccording(faq.id)}
                >
                  <div className="d-flex justify-content-between  border ">
                    <p className="pt-2 ps-3">
                      {faq.question}
                    </p>
                    <span className="pt-2">
                      {show == faq.id ? (
                        <IoIosArrowDown className="custome-icon " />
                      ) : (
                        <IoIosArrowUp className="custome-icon" />
                      )}
                    </span>
                  </div>
                  {show == faq.id && (
                    <div className="text-center px-3 pt-2">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            }

          </div>
        )}
        {activeTab == "terms" && (
          <div className="flex justify-content-center terms-text">
            <p className="p-3 ">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by
              injected humour, or randomised words which don't look even
              slightly believable. If you are going to use a passage of Lorem
              Ipsum, you need to be sure there isn't anything embarrassing
              hidden in the middle of text. All the Lorem Ipsum generators on
              the Internet tend to repeat predefined chunks as necessary, making
              this the first true generator on the Internet. It uses a
              dictionary of over 200 Latin words, combined with a handful of
              model sentence structures, to generate Lorem Ipsum which looks
              reasonable. The generated Lorem Ipsum is therefore always free
              from repetition, injected humour, or non-characteristic words etc.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
