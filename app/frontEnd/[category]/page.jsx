import React from 'react'
// import React, { useEffect, useState, useRef, } from "react";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { FaCartArrowDown,FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GrAidOption } from "react-icons/gr";
import { toast } from "react-toastify";
// import OptionDiv from "./components/OptionDiv";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from '@/redux/slices/CartSlice';
import Swal from "sweetalert2";
import DynamicLoader from "@/app/components/loader/dynamicLoader";
import { getData } from '@/lib/api';
export default async function page({params}) {
    let data =[]
      try{
        data = await getData(`api/products?slug=${params.category}`)
      }catch(err){
        data = {error:err.message}
      }

  return (
 
      
    <div className="container my-5 py-4">
    <div className="row position-relative">
    {data?.data?.map((product, index) => (
        <div key={index} className='col-lg-3 col-md-6'>
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
              {/* {
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
              } */}



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
              </div>
            </div>

            <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-3 add-to-cart-footer d-lg-none d-block" style={{ zIndex: '10' }}>
              {product.sizes.length > 1 ? <button type="button" className="bg-transparent w-100 rounded-0"
                // onClick={(e) => handleOptionDiv(e, product.id)}
              >
                <GrAidOption className="me-2" />
                Select options
              </button> :
                <button className="bg-transparent w-100 rounded-0" 
                // onClick={()=>handleAddToCart(product)}
                >
                  <FaCartArrowDown className="me-2" />
                  Add to cart
                </button>}

            </div>

            <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-3 add-to-cart-footer d-none d-lg-block" style={{ zIndex: '10' }}>
              {product.sizes.length > 1 ? (<button type="button" className="bg-transparent w-100 rounded-0"
                // onClick={(e) => handleOptionDiv(e, product.id)}
              >
                <GrAidOption className="me-2" />
                Select options
              </button>) :
                (<button className="bg-transparent w-100 rounded-0"
                    //  onClick={()=>handleAddToCart(product)}
                >
                  <FaCartArrowDown className="me-2" />
                  Add to cart
                </button>)}

            </div>
            {/* options div component start */}
           
           {/* <OptionDiv
            showOptionDiv = {showOptionDiv}
            setShowOptionDiv = {setShowOptionDiv}
            selectedSizes = {selectedSizes}
            handleSizeSelect = {handleSizeSelect}
            product = {product}
            handleAddToCart = {handleAddToCart}
             /> */}
           
            {/* options selection div end */}
          </div>

        </div>
      ))}
      </div>
      </div >
  )
}
