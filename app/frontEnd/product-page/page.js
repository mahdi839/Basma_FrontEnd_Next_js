"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaFirstOrder, FaMinus, FaPhone, FaPlus } from "react-icons/fa";

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";



export default function page() {
  const [imgUrl, setImgUrl] = useState("");
  const [activeTab, setActiveTab] = useState("desc");
  const [show, setShow] = useState(0);

  let images = [
    {
      id: 1,
      src: "/img/product/dress-1.png",
    },
    {
      id: 2,
      src: "/img/featured/feature-1.jpg",
    },
    {
      id: 3,
      src: "/img/featured/feature-2.jpg",
    },
  ];

  function showImage(id) {
    const clickedImg = images.find((img) => img.id == id);
    setImgUrl(clickedImg.src);
    
  }

  function showTab(id) {
    setActiveTab(id);
  }
  function showAccording(id) {
    setShow((prev) => (prev == id ? 0 : id));
  }
  return (
    <>
      <div className="container">
        <div className="row my-5">
          <div className="product_image col-6 d-flex flex-column ">
            <div className="main_image mb-4 " style={{ background: "#0202" }}>
              <Image
                src={imgUrl ? imgUrl : "/img/product/dress-1.png"}
                className="card-img-top"
                alt="product image"
                width={500}
                height={400}
              />
            </div>
            <div className="sub_image d-flex gap-3 justify-content-center align-content-center">
              {images.map((img) => (
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
                    src={img.src}
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
              <p className="fw-bold">2024 autumn new girl nice wallet</p>
              <h5 className="product_price">450tk</h5>
              <div className="flex justify-content-center align-items-center mt-3 size-div">
                <span className="me-3 fw-bold">Select</span>
                <input className="me-3 " id="m" type="radio" name="size" />
                <label htmlFor="m" className="me-3 fw-bold">
                  M
                </label>
                <input className="me-3 " type="radio" name="size" />
                <label htmlFor="l" className="me-3 fw-bold">
                  L
                </label>
                <input className="me-3 " type="radio" name="size" />
                <label htmlFor="xl" className="me-3 fw-bold">
                  xl
                </label>
                <input className="me-3 " type="radio" name="size" />
                <label htmlFor="xxl" className="me-3 fw-bold">
                  xxl
                </label>
              </div>
              <p className="pt-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.lorem jkdjfks kjflk kjsdklfja l skdfjls tlerjl lkjfla
                lajreiruoeriu isdroerio oajfkd fklas fkldf la{" "}
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
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>

            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                overflow: "hidden",
                marginBottom:'2rem'
              }}
            >
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/po0s-Dawm4U?si=eb5_4OJBaMMgWZ-P"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              ></iframe>
            </div>
          </div>
        )}
        {activeTab == "faq" && (
          <div className=" faq-text card  my-3">
            <div
              className="d-flex flex-column border accordion-div mx-auto mb-2   mt-3 "
              onClick={() => showAccording(1)}
            >
              <div className="d-flex justify-content-between  border ">
                <p className="pt-2 ps-3">
                  how much price? is this product available? i want this how
                  much price? is this product available? i want this
                </p>
                <span className="pt-2">
                  {show == 1 ? (
                    <IoIosArrowDown className="custome-icon " />
                  ) : (
                    <IoIosArrowUp className="custome-icon" />
                  )}
                </span>
              </div>
              {show == 1 && (
                <div className="text-center px-3 pt-2">
                  Contrary to popular belief, Lorem Ipsum is not simply random
                  text. It has roots in a piece of classical Latin literature
                  from 45 BC, making it over 2000 years old. Richard McClintock,
                  a Latin professor at Hampden-Sydney College in Virginia,
                  looked up one of the more obscure Latin words, consectetur,
                  from a Lorem Ipsum passage, and going through the cites of the
                  word in classical literature, discovered the undoubtable
                  source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of
                  "de Finibus Bonorum et Malorum" (The Extremes of Good and
                  Evil) by Cicero, written in 45 BC. This book is a treatise on
                  the theory of ethics, very popular during the Renaissance. The
                  first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
                  comes from a line in section 1.10.32.
                </div>
              )}
            </div>
            <div
              className="d-flex flex-column border accordion-div mx-auto mb-2   mt-3 "
              onClick={() => showAccording(2)}
            >
              <div className="d-flex justify-content-between  border">
                <p className="pt-2 ps-3">
                  how much price? is this product available? i want this
                </p>
                <span className="pt-2">
                  {show == 2 ? (
                    <IoIosArrowDown className="custome-icon " />
                  ) : (
                    <IoIosArrowUp className="custome-icon" />
                  )}
                </span>
              </div>
              {show == 2 && (
                <div className="text-center px-3 pt-2">
                  Contrary to popular belief, Lorem Ipsum is not simply random
                  text. It has roots in a piece of classical Latin literature
                  from 45 BC, making it over 2000 years old. Richard McClintock,
                  a Latin professor at Hampden-Sydney College in Virginia,
                  looked up one of the more obscure Latin words, consectetur,
                  from a Lorem Ipsum passage, and going through the cites of the
                  word in classical literature, discovered the undoubtable
                  source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of
                  "de Finibus Bonorum et Malorum" (The Extremes of Good and
                  Evil) by Cicero, written in 45 BC. This book is a treatise on
                  the theory of ethics, very popular during the Renaissance. The
                  first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
                  comes from a line in section 1.10.32.
                </div>
              )}
            </div>
            <div
              className="d-flex flex-column border accordion-div mx-auto mb-2   mt-3 "
              onClick={() => showAccording(3)}
            >
              <div className="d-flex justify-content-between border ">
                <p className="pt-2 ps-3">
                  how much price? is this product available? i want this
                </p>
                <span className="pt-2">
                  {show == 3 ? (
                    <IoIosArrowDown className="custome-icon " />
                  ) : (
                    <IoIosArrowUp className="custome-icon" />
                  )}
                </span>
              </div>
              {show == 3 && (
                <div className="text-center px-3 pt-2">
                  Contrary to popular belief, Lorem Ipsum is not simply random
                  text. It has roots in a piece of classical Latin literature
                  from 45 BC, making it over 2000 years old. Richard McClintock,
                  a Latin professor at Hampden-Sydney College in Virginia,
                  looked up one of the more obscure Latin words, consectetur,
                  from a Lorem Ipsum passage, and going through the cites of the
                  word in classical literature, discovered the undoubtable
                  source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of
                  "de Finibus Bonorum et Malorum" (The Extremes of Good and
                  Evil) by Cicero, written in 45 BC. This book is a treatise on
                  the theory of ethics, very popular during the Renaissance. The
                  first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
                  comes from a line in section 1.10.32.
                </div>
              )}
            </div>
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
