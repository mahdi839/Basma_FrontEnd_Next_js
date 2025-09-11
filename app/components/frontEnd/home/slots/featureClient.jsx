"use client";
import React, { useEffect, useState, useRef, } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from '@/redux/slices/CartSlice';
import Swal from "sweetalert2";
import DynamicLoader from "@/app/components/loader/dynamicLoader";
import ProductCard from "./components/ProductCard";
import Link from "next/link";
import Image from "next/image";

function FeatureClient({ products, slotData }) {

  const [isLoading, setIsLoading] = useState(true)
  const sliderRefs = useRef([]);
  const [showOptionDiv, setShowOptionDiv] = useState({
    productId: null,
    status: false
  });
  const [selectedSizes, setSelectedSizes] = useState("");

  let baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch()
  const cartCount = useSelector(state => state.cart.count);
  const cartItems = useSelector(state => state.cart.items)
  useEffect(() => {
    if (products) {
      setIsLoading(false)
    }
    if (products?.error) {
      toast.error(products.error)
    }

    sliderRefs.current = sliderRefs.current.slice(0, products?.length || 0);
  }, [products]);


  // Slider settings with autoplay
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,

    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,

        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,

        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,

        }
      }
    ]
  };
  if (isLoading) {
    return <DynamicLoader />;
  }

  if (products?.error) {
    return <div className="text-center my-5">Error: {products.error}</div>;
  }

  if (!products?.length) {
    return <div className="text-center my-5">No products found</div>;
  }

  function handleOptionDiv(e, productid) {
    e.preventDefault()
    setShowOptionDiv({
      productId: productid,
      status: true
    })
  }

  function handleSizeSelect(e) {
    setSelectedSizes(e.target.value)
  }

  function handleAddToCart(product) {
    setShowOptionDiv(false)

    let existingCart = cartItems.find(existProduct => existProduct.id === product.id)
    if (existingCart) {
      Swal.fire(
        {
          title: "Already in the cart",
          text: "This product is already in your cart",
          icon: "info",
          confirmButtonText: "Ok",
          confirmButtonColor: "#DB3340"
        }
      )
      return;
    }

    // check if user select size or not for multiple sizes
    if (product.sizes.length > 1 && !selectedSizes) {
      Swal.fire({
        title: "Please Select A Size",
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340"
      })
      return;
    }
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      size: selectedSizes ?? "",
      price: product.sizes[0]?.pivot?.price ?? product.price,
      image: baseUrl + product.images?.[0]?.image || ""
    }));

    setSelectedSizes(""); // Reset selection
    toast.success("Added to cart!");

  }

  return (
    <div className="container mb-5 mt-0 py-2 ">
      <div className="row position-relative">
        {products &&
          products.map((slot, slotIndex) => {
            // Initialize ref if it doesn't exist
            if (!sliderRefs.current[slotIndex]) {
              sliderRefs.current[slotIndex] = React.createRef();
            }

            return (
              <React.Fragment key={slot.id || slotIndex}>
                {/* Header with navigation buttons */}
                {
                  slotData.map((item) => {
                    if (item.slot.slot_name === slot.slot_name) {
                      return (
                        <Link key={item.id} href={item.link} className="text-decoration-none text-dark my-3">
                          <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}storage/${item.banner_images[0].path}`} style={{ width: '100%', height: 'auto' }} />
                        </Link>
                      );
                    }
                  }
                  )}
                <div className="col-12 d-flex justify-content-between align-items-center mb-1 position-relative">


                  <h2 className="featured-heading font-weight-bold mb-0  fs-5 fs-md-3 fs-lg-2 fs-xl-1" style={{ fontWeight: '600', color: '#222' }}>
                    {slot.slot_name}
                  </h2>


                  {
                    slot.slot_details?.length >= 4 && (
                      <div className="d-flex gap-2 mb-1">
                        <button
                          className="d-flex align-items-center justify-content-center slider-nav-btn"
                          // Connect to this specific slider
                          onClick={() => sliderRefs.current[slotIndex]?.current?.slickPrev()}
                        >
                          <FaChevronLeft className="slider-arrow"  />
                        </button>
                        <button
                          className="p-2 d-flex align-items-center justify-content-center slider-nav-btn"
                          
                          // Connect to this specific slider
                          onClick={() => sliderRefs.current[slotIndex]?.current?.slickNext()}
                        >
                          <FaChevronRight className="slider-arrow" />
                        </button>
                      </div>
                    )}

                </div>



                <div className="col-12 position-relative  ml-3 mt-0 overflow-hidden">
                  <hr className="feature-hr m-0" />
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100px',
                    height: '5px',
                    backgroundColor: '#e83e8c',
                    zIndex: '1'
                  }}></div>
                </div>



                {
                  slot.slot_details?.length >= 4 && (
                    <Slider
                      ref={sliderRefs.current[slotIndex]}
                      {...settings}
                      className="w-100"
                    >
                      {slot.slot_details?.map((detail, detailIndex) => (
                        <ProductCard
                          key={detail.id || detailIndex}
                          slotProducts={detail?.product}
                          showOptionDiv={showOptionDiv}
                          setShowOptionDiv={setShowOptionDiv}
                          selectedSizes={selectedSizes}
                          handleSizeSelect={handleSizeSelect}
                          handleAddToCart={handleAddToCart}
                          handleOptionDiv={handleOptionDiv}
                          slotLength = {slot.slot_details?.length}
                        />
                      ))}
                    </Slider>
                  )
                }

                {
                  slot.slot_details?.length < 4 && (

                    <div className="row">
                      {
                        slot.slot_details?.map((detail, detailIndex) => (
                          <div className=" col-6 col-lg-3 col-md-4">
                            <ProductCard
                              key={detail.id || detailIndex}
                              slotProducts={detail?.product}
                              showOptionDiv={showOptionDiv}
                              setShowOptionDiv={setShowOptionDiv}
                              selectedSizes={selectedSizes}
                              handleSizeSelect={handleSizeSelect}
                              handleAddToCart={handleAddToCart}
                              handleOptionDiv={handleOptionDiv}

                            />
                          </div>
                        ))
                      }
                    </div>

                  )
                }
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
}

export default FeatureClient;