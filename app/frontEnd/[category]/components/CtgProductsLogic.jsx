"use client"

import React, { useEffect, useState,} from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from '@/redux/slices/CartSlice';
import Swal from "sweetalert2";
import DynamicLoader from "@/app/components/loader/dynamicLoader";

import ProductCard from "@/app/components/frontEnd/home/slots/components/ProductCard";
export default function CtgProductsLogic({products,category}) {
  
const [isLoading, setIsLoading] = useState(true)
  const [showOptionDiv, setShowOptionDiv] = useState({
    productId: null,
    status: false
  });
  const [selectedSizes, setSelectedSizes] = useState("");
  let baseUrl = process.env.BACKEND_URL;
  const dispatch = useDispatch ()
  const cartItems = useSelector(state=>state.cart.items)
  useEffect(() => {
    if (products) {
      setIsLoading(false)
    }
    if (products?.error) {
      toast.error(products.error)
    }


  }, [products]);

   if (isLoading) {
      return <DynamicLoader /> ;
    }
  
    if (products?.error) {
      return <div className="text-center my-5">Error: {products.error}</div>;
    }
  
    if (!products?.length) {
      return <div className="text-center my-5 text-danger">No products found</div>;
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
    <div className="container  ">
       
    <div className="row position-relative ">
    
    {products?.map((product, index) => (
       <div className="col-lg-3 col-md-4 col-sm-6">
        
        <ProductCard slotProducts={product}
        showOptionDiv = {showOptionDiv}
        setShowOptionDiv = {setShowOptionDiv}
        selectedSizes = {selectedSizes}
        handleSizeSelect = {handleSizeSelect}
        handleAddToCart = {handleAddToCart}
        handleOptionDiv= {handleOptionDiv} />
       </div>
      ))}
      </div>
      </div >
  )
}
