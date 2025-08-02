"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaFirstOrder, FaMinus, FaPhone, FaPlus } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/CartSlice";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";



export default function Products({ product }) {
  const [imgUrl, setImgUrl] = useState("");
  const [activeTab, setActiveTab] = useState("desc");
  const [show, setShow] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState(0)
  let dispatch = useDispatch()
  let cartItems = useSelector(state=>state.cart.items)
  let baseUrl = process.env.BACKEND_URL;
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
    setPrice(seletedSize.pivot.price)
  }

  

  const getYoutubeVideoId = (url) => {
    if (!url) return null;

    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
  };

  

  function handleAddToCart (id,type){
    let existingProduct = cartItems.find(item=>item.id ===id);
    if(existingProduct){
      Swal.fire({
        title: "Already in the cart",
        text: "This product is already in your cart",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor:"#DB3340"
      })
      return;
    }

    dispatch(addToCart({
          id: product.id,
          title: product.title,
          size: selectedSize ?? "",
          price: product.sizes[0]?.pivot?.price?? product.price,
          image: baseUrl+product.images?.[0]?.image || ""
        }));
        toast.success("Added to cart!");
        if(type==="order"){
           router.push("/frontEnd/checkout")
         }
  }
  return (
    <>
      <div className="container">
        <div className="row my-5">
          <div className="product_image col-6 d-flex flex-column ">
            <div className="main_image mb-4 " style={{ background: "#0202" }}>
              <Image
                src={imgUrl ? imgUrl : baseUrl + product?.images?.[0].image}
                className="card-img-top"
                alt="product image"
                width={500}
                height={400}
              />
            </div>
            <div className="sub_image d-flex gap-3 justify-content-center align-content-center">
              {product?.images?.map((img) => (
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
              <p className="fw-bold">{product?.title}</p>
              <h5 className="product_price">৳ {product.price || product?.sizes[0]?.pivot.price}</h5>
              <div className="flex justify-content-center align-items-center mt-3 size-div">
                {product.sizes.length>0 &&(
                  <span className="me-3 fw-bold">Select</span>
                )}
                {product.sizes?.map((size, index) => (
                  <div className="d-flex d-inline" key={size.id}>
                    <input className="me-3 " id="m" type="radio" name="size" value={size.id} onChange={selectSize} defaultChecked={index === 0} />
                    <label htmlFor="m" className="me-3 fw-bold">
                      {size.size}
                    </label>
                  </div>

                ))}


              </div>
              <p className="pt-2">
                {product.description}
              </p>
            </div>
            <div className="d-flex gap-2 ms-5">
              
                <button className="btn-grad px-3 py-1 rounded-0" onClick={()=>handleAddToCart(product.id,"add")}>Add To Cart</button>
                <button className="btn-grad px-3 py-1 rounded-0" onClick={()=>handleAddToCart(product.id,"order")}>
                <span className="pe-1">
                  <FaFirstOrder />
                </span>
                Order Now
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
                <div className="content-card d-flex justify-content-between">
                 
                  <div className="description-text">
                    {product.description}
                  </div>

                  {product?.video_url && (
                    <div className="video-container mt-4 w-full">
                      <div className="video-wrapper">
                        <iframe
                          className="youtube-embed"
                          src={`https://www.youtube.com/embed/${getYoutubeVideoId(product.video_url)}`}
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
                  
                  <div className="accordion-list">
                    
                    {product?.faqs.length>0? (
                      product?.faqs?.map((faq) => (
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
                    ))
                    ):<div className="text-center text-danger">No FAQs found.</div>}
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
