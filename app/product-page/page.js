"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function page() {
    const [imgUrl, setImgUrl] = useState('')
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

  function showImage (id){
     const clickedImg = images.find(img=>img.id == id)
     setImgUrl(clickedImg.src)
  }
  return (
    <>
      <div className="container">
        <div className="row my-5">
          <div className="product_image col-6 d-flex flex-column ">
            <div className="main_image mb-4 " style={{ background: "#0202" }}>
              <Image
                src={imgUrl?imgUrl:"/img/product/dress-1.png"}
                className="card-img-top"
                alt="product image"
                width={500}
                height={400}
              />
            </div>
            <div className="sub_image d-flex gap-3 justify-content-center align-content-center">
              
               {
                images.map((img)=>(
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
                  onClick={()=>showImage(img.id)}
                />

                  </div>
                ))
               }
           
            </div>
          </div>
          <div className="product_desc col-6 bg-dark"></div>
        </div>
      </div>
    </>
  );
}
