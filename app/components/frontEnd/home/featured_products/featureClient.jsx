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
    return <div className="text-center my-5"><FaSpinner size={30} /></div>;
  }

  if (products?.error) {
    return <div className="text-center my-5">Error: {products.error}</div>;
  }

  if (!products?.data?.length) {
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
    if(product.sizes.length>0 && !selectedSizes){
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
      price: product.sizes?product.sizes[0]?.pivot?.price :  product.price,
      image: product.images?.[0]?.image || "/default-image.jpg"
    }));

    setSelectedSizes(""); // Reset selection
    toast.success("Added to cart!");
   }
   console.log(cartCount)
  return (
    <div className="container my-5 py-4">
      <div className="row position-relative">
        {/* Header with navigation buttons */}
        <div className="col-12 d-flex justify-content-between align-items-center mb-1 position-relative">
          <h2 className="featured-heading font-weight-bold mb-0" style={{ fontSize: '24px', fontWeight: '600', color: '#222' }}>
            Featured Products
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



        <Slider ref={sliderRef} {...settings} className="w-100 ">
          {products?.data?.map((product, index) => (
            <div key={index} className={`px-2 ${index===0?'first-slide':''}`}>
              <div className="card product-div  p-2 bg-white h-100 product-card position-relative"
                style={{
                  borderRadius: '0',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 10px rgba(0,0,0,0.03)'
                }}>
                {/* Sale Badge */}
                {
                  product.discount && product.discount !== null && (
                    <div className="position-absolute  text-white px-1 py-2 small sale-badge rounded-circle"
                    >
                      -{typeof product.discount === "number" && product.discount > 0 ? product.discount : ""}%
                    </div>
                  )
                }



                {/* Product Image */}

                <div className="position-relative overflow-hidden product-image-container"
                  style={{ paddingTop: '100%', backgroundColor: '#f9f9f9' }}>
                  <Link href={`/frontEnd/product-page/${product.id}`}>
                    <Image
                      width={500}
                      height={400}
                      src={product.images?.[0]?.image ? baseUrl + product.images[0].image : "/img/product/dress-1.png"}

                      className="position-absolute w-100 h-100 object-fit-cover p-3"
                      alt={product.title}
                      style={{ top: '0', left: '0', transition: 'transform 0.3s ease' }}
                    />
                  </Link>
                  {/* Product Actions */}
                  {
                    showOptionDiv.status === false && (
                      <div className="quick-add-btn product-actions position-absolute d-flex flex-column "
                        style={{ zIndex: 10 }}>
                        <Link href={`/frontEnd/product-page/${product.id}`}>
                          <button className="  rounded-circle mb-2 p-2 action-btn d-flex justify-content-center"
                            style={{ width: '36px', height: '36px', border: '1px solid var(--primary-colo)', zIndex: '99' }}>
                            <CiSearch className="fs-5" style={{ color: '#000' }} />
                          </button>
                        </Link>
                        <button className="    rounded-circle p-2 action-btn d-flex justify-content-center"
                          style={{ width: '36px', height: '36px', border: '1px solid var(--primary-colo' }}>
                          <FaCartArrowDown className="fs-5" style={{ color: '#000' }} />
                        </button>
                      </div>
                    )
                  }



                  {/* Quick add to cart button (shown on hover) */}

                </div>



                {/* Product Body */}
                <div className="card-body px-3 pb-2 pt-3">
                  <h5 className="card-title mb-1">
                    <Link href={`/frontEnd/product-page/${product.id}`}
                      className="text-decoration-none text-dark product-title"
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#222',
                        transition: 'color 0.2s ease',
                        display: '-webkit-box',
                        WebkitLineClamp: '1',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                      {product.title}
                    </Link>
                  </h5>
                  <Link href={`/frontEnd/product-page/${product.id}`}>
                    <p className="text-muted small mb-2 product-subtitle"
                      style={{
                        fontSize: '13px',
                        color: '#888',
                        display: '-webkit-box',
                        WebkitLineClamp: '1',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                      {product?.sub_title}
                    </p>
                  </Link>

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div>
                      <span className="text-dark fw-bold product-price"
                        style={{ fontSize: '16px', fontWeight: '600' }}>
                        ৳{product.sizes[0]?.pivot.price || product.price}
                      </span>
                    </div>
                    <div className="text-warning small product-rating">
                      <FaStar style={{ fontSize: '12px' }} />
                      <FaStar style={{ fontSize: '12px' }} />
                      <FaStar style={{ fontSize: '12px' }} />
                      <FaStar style={{ fontSize: '12px' }} />
                      <FaStarHalfAlt style={{ fontSize: '12px' }} />
                      <span className="text-muted ms-1" style={{ fontSize: '12px' }}>(12)</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-3 add-to-cart-footer d-lg-none d-block" style={{ zIndex: '10' }}>
                  {product.sizes.length > 1 ? <button type="button" className="bg-transparent w-100 rounded-0"
                    onClick={(e) => handleOptionDiv(e, product.id)}
                  >
                    <GrAidOption className="me-2" />
                    Select options
                  </button> :
                    <button className="bg-transparent w-100 rounded-0" onClick={()=>handleAddToCart(product)}>
                      <FaCartArrowDown className="me-2" />
                      Add to cart
                    </button>}

                </div>

                <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-3 add-to-cart-footer d-none d-lg-block" style={{ zIndex: '10' }}>
                  {product.sizes.length > 1 ? (<button type="button" className="bg-transparent w-100 rounded-0"
                    onClick={(e) => handleOptionDiv(e, product.id)}
                  >
                    <GrAidOption className="me-2" />
                    Select options
                  </button>) :
                    (<button className="bg-transparent w-100 rounded-0" onClick={()=>handleAddToCart(product)}>
                      <FaCartArrowDown className="me-2" />
                      Add to cart
                    </button>)}

                </div>
                {/* options div component start */}
               
               <OptionDiv
                showOptionDiv = {showOptionDiv}
                setShowOptionDiv = {setShowOptionDiv}
                selectedSizes = {selectedSizes}
                handleSizeSelect = {handleSizeSelect}
                product = {product}
                handleAddToCart = {handleAddToCart}
                 />
               
                {/* options selection div end */}
              </div>

            </div>
          ))}
        </Slider>
      </div>


    </div>
  );
}

export default FeatureClient;