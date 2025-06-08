"use client";
import React from "react";
import { FaTrash, FaPlus, FaMinus, FaHeart } from "react-icons/fa";
import Link from "next/link";
import Navbar from "../components/frontEnd/nabvar/navber";
import { useDispatch, useSelector } from "react-redux";
import { increament,decreament,removeCart } from "@/redux/slices/CartSlice";


function CartPage() {
  
let cartItems = useSelector((state=>state.cart.items))
let getTotalPrice = cartItems.reduce((total,item)=>total+item.totalPrice,0)
let dispatch = useDispatch()

function handleIncreament (id){
  dispatch(increament({id}))
}

function handleDecreament (id){
  dispatch(decreament({id}))
}

function handleRemove (id){
  dispatch(removeCart({id}))
}



  return (
    <div >
     
     <Navbar />
     <section class="h-100 gradient-custom">
  <div class="container py-5">
    <div class="row d-flex justify-content-center my-4">
      <div class="col-md-8">
        <div class="card mb-4">
          <div class="card-header py-3">
            <h5 class="mb-0">Items in Your Cart: <span className="text-danger">( {cartItems.length} )</span> </h5>
          </div>
          <div class="card-body">
         {
           cartItems.length === 0?(
            <div className="container py-5 text-center">
    <div className="empty-cart-container" style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '40px 20px',
      borderRadius: '10px',
      boxShadow: '0 0 15px rgba(0,0,0,0.1)',
      backgroundColor: '#fff'
    }}>
      <h3 style={{
        color: '#dc3545',
        marginBottom: '20px',
        fontWeight: '600'
      }}>
        Your Cart Is Empty
      </h3>
      <p style={{
        color: '#6c757d',
        marginBottom: '25px',
        fontSize: '1.1rem'
      }}>
        Looks like you haven't added anything to your cart yet
      </p>
      <Link 
        href="/" 
        className="btn btn-primary"
        style={{
          padding: '10px 25px',
          borderRadius: '5px',
          fontWeight: '500',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          outline:'none',
          border: 'none'
        }}
      >
        Continue Shopping
      </Link>
    </div>
  </div>
          ):  cartItems?.map((item)=>(
            <div className="row align-items-center mb-4 pb-3 border-bottom">
            {/* Product Image */}
            <div className="col-lg-3 col-md-4 col-12 mb-4 mb-lg-0">
              <div className="bg-image hover-zoom ripple rounded overflow-hidden position-relative">
                <img 
                  src={item.image} 
                  className="w-100" 
                  alt={item.title}
                  style={{
                    height: '160px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
                <div className="hover-overlay">
                  <div className="mask" style={{backgroundColor: "rgba(251, 251, 251, 0.15)"}}></div>
                </div>
              </div>
            </div>
          
            {/* Product Info */}
            <div className="col-lg-4 col-md-4 col-12 mb-4 mb-md-0">
              <h5 className="mb-2" style={{fontWeight: '600'}}>{item.title}</h5>
              <p className="mb-2 text-muted">Price: <span className="text-dark">{item.unitPrice}</span></p>
              <p className="mb-2 text-muted">Size: <span className="text-dark">{item.size || "No Size"}</span></p>
             
            </div>
          
            {/* Quantity & Price */}
            <div className="col-lg-4 col-md-4 col-12">
             <div className="d-flex gap-3">
             <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <button 
                    className="border-0 py-1 px-2"
                    onClick={() => handleDecreament(item.id)}
                    disabled={item.qty <= 1}
                  >
                    <FaMinus />
                  </button>
                  
                  <input 
                    type="number" 
                    min="1" 
                    value={item.qty} 
                    className=" text-center mx-2" 
                    style={{width: '60px'}}
                    readOnly
                  />
                  
                  <button 
                    className="border-0 py-1 px-2"
                    onClick={() => handleIncreament(item.id)}
                  >
                    <FaPlus />
                  </button>
                </div>
                
               
              </div>
              <div className="d-flex  gap-2 align-items-center mb-3">
               
                <button 
                  type="button" 
                  className="border-0 me-2 py-1 px-2"
                  onClick={() => handleRemove(item.id)}
                  
                >
                  <FaTrash className="me-1" />
                  
                </button>
              </div>
             </div>
            </div>
          </div>
             ))
         }
          
           

            <hr class="my-4" />

           
          </div>
        </div>
       
      </div>
      <div class="col-md-4">
        <div class="card mb-4">
          <div class="card-header py-3">
            <h5 class="mb-0">Summary</h5>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li
                class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                Products
                <span>{getTotalPrice} TK</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                Shipping
                <span>Gratis</span>
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                <div>
                  <strong>Total amount</strong>
                </div>
                <span><strong>{getTotalPrice}TK</strong></span>
              </li>
            </ul>

            <button  type="button" data-mdb-button-init data-mdb-ripple-init class=" btn-lg btn-block">
              Go to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
     </section>
   
     
    </div>
  );
}

export default CartPage;