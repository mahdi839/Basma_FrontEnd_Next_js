"use client";
import React, { useEffect, useState, useRef, } from "react";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { FaCartArrowDown, FaStar, FaStarHalfAlt, FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GrAidOption } from "react-icons/gr";
import { toast } from "react-toastify";
import OptionDiv from "./components/OptionDiv";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from '@/redux/slices/CartSlice';
import Swal from "sweetalert2";
import DynamicLoader from "@/app/components/loader/dynamicLoader";
import ProductCard from "./components/ProductCard";


function FeatureClient({ products }) {

  const [isLoading, setIsLoading] = useState(true)
  const sliderRef = useRef(null);
  const [showOptionDiv, setShowOptionDiv] = useState({
    productId: null,
    status: false
  });
  const [selectedSizes, setSelectedSizes] = useState("");

  let baseUrl = process.env.BACKEND_URL;
  const dispatch = useDispatch ()
  const cartCount = useSelector(state=>state.cart.count);
  const cartItems = useSelector(state=>state.cart.items)
  useEffect(() => {
    if (products) {
      setIsLoading(false)
    }
    if (products?.error) {
      toast.error(products.error)
    }


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
          slidesToShow: 1,
          slidesToScroll: 1,

        }
      }
    ]
  };
  if (isLoading) {
    return <DynamicLoader /> ;
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

  function handleSizeSelect (e){
    setSelectedSizes(e.target.value)
  }

   function handleAddToCart (product){
     setShowOptionDiv(false)
    
    let existingCart = cartItems.find(existProduct=> existProduct.id === product.id)
    if(existingCart){
      Swal.fire(
       {
         title: "Already in the cart",
        text: "This product is already in your cart",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor:"#DB3340"
       }
      )
      return;
    }

    // check if user select size or not for multiple sizes
    if(product.sizes.length>1 && !selectedSizes){
        Swal.fire({
          title: "Please Select A Size",
          icon: "warning",
          confirmButtonText: "Ok",
          confirmButtonColor:"#DB3340"
        })
        return;
    }
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      size: selectedSizes ?? "",
      price: product.sizes[0]?.pivot?.price?? product.price,
      image: baseUrl+product.images?.[0]?.image || ""
    }));

    setSelectedSizes(""); // Reset selection
    toast.success("Added to cart!");
   
   }
   
  return (
    <div className="container my-5 py-4">
      <div className="row position-relative">

    {
      products && products.map((slot)=>(
        <>
           {/* Header with navigation buttons */}
        <div className="col-12 d-flex justify-content-between align-items-center mb-1 position-relative">
          <h2 className="featured-heading font-weight-bold mb-0" style={{ fontSize: '24px', fontWeight: '600', color: '#222' }}>
            {slot.slot_name}
          </h2>
          
             <div className="d-flex gap-2">
            <button
              className=" d-flex align-items-center justify-content-center slider-nav-btn"
              style={{ width: '36px', height: '36px' }}
              onClick={() => sliderRef.current.slickPrev()}
            >
              <FaChevronLeft className="slider-arrow" style={{ fontSize: '14px' }} />
            </button>
            <button
              className=" p-2 d-flex align-items-center justify-content-center slider-nav-btn"
              style={{ width: '36px', height: '36px', borderColor: '#e1e1e1' }}
              onClick={() => sliderRef.current.slickNext()}
            >
              <FaChevronRight className="slider-arrow" />
            </button>
          </div>
        
         
        </div>

        {/* Full-width HR line with colored portion */}
        <div className="col-12 position-relative mb-4 ml-3 mt-2 overflow-hidden">
          <hr className="feature-hr m-0" />
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100px',
            height: '2px',
            backgroundColor: '#e83e8c',
            zIndex: '1'
          }}></div>
        </div>
        {slot.slot_details?.map((detail)=>(
          <ProductCard 
            slotProducts={detail?.products}
            slotCategoryProducts={detail?.category?.products}
            showOptionDiv = {showOptionDiv}
            setShowOptionDiv = {setShowOptionDiv}
            selectedSizes = {selectedSizes}
            handleSizeSelect = {handleSizeSelect}
            handleAddToCart = {handleAddToCart}
            handleOptionDiv= {handleOptionDiv}
             sliderRef={sliderRef} 
           />
        ))}
           
        
        </>
      ))
    }
     
        
      </div>


    </div>
  );
}

export default FeatureClient;