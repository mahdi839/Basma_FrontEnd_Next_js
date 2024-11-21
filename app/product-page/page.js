"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaMinus, FaPhone, FaPlus } from "react-icons/fa";

export default function page() {
  const [imgUrl, setImgUrl] = useState("");
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
           <button className=" order_now">Order Now</button> <br />
           <button className=" call_now">
             <span className="pe-1">
               <FaPhone />
             </span>
             01795802507
           </button>
           </div>
          </div>
        </div>
      </div>
    </>
  );
}
