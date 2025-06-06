"use client";
import React from "react";
import { FaTrash, FaPlus, FaMinus, FaHeart } from "react-icons/fa";
import Link from "next/link";
import Navbar from "../components/frontEnd/nabvar/navber";
import { useSelector } from "react-redux";


function CartPage() {
  
let cartItems = useSelector((state=>state.cart.items))
if (cartItems.length === 0) {
  return (
    <div>
      <Navbar />
      <div className="container py-5 text-center">
        <h3>Your cart is empty</h3>
        <Link href="/" className="btn btn-primary mt-3">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
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
              cartItems?.map((item)=>(
            <div class="row">
             
             <div class="col-lg-3 col-md-12 mb-4 ">
              
              <div class="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                <img src={item.image}
                  class="w-100" alt="Blue Jeans Jacket" />
                <a href="#!">
                  <div class="mask" style={{backgroundColor: "rgba(251, 251, 251, 0.2)"}}></div>
                </a>
              </div>
            
            </div>

            <div class="col-lg-5 col-md-6 mb-4 mb-lg-0">
            
              <p><strong>{item.title}</strong></p>
               <p>Size: {item.size || "No Size"}</p>
              <button  type="button" data-mdb-button-init data-mdb-ripple-init class=" me-1 mb-2" data-mdb-tooltip-init
                title="Remove item">
                <FaTrash />
              </button>
              <button  type="button" data-mdb-button-init data-mdb-ripple-init class=" mb-2" data-mdb-tooltip-init
                title="Move to the wish list">
                <FaHeart />
              </button>
           
            </div>

            <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
              
              <div class="d-flex mb-4" style={{maxWidth: "300px"}}>
                <button data-mdb-button-init data-mdb-ripple-init class=" px-3 me-2"
                  onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                  <FaMinus />
                </button>

                <div data-mdb-input-init class="">
                  <input id="form1" min="0" name="quantity" value={item.qty} type="number" class="form-control" />
                </div>

                <button data-mdb-button-init data-mdb-ripple-init class=" px-3 ms-2"
                  onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                 <FaPlus />
                </button>
              </div>
              

              <p class="text-start text-md-center">
                <strong>{item.price} TK </strong>
              </p>
            
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
                <span>$53.98</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                Shipping
                <span>Gratis</span>
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                <div>
                  <strong>Total amount</strong>
                  <strong>
                    <p class="mb-0">(including VAT)</p>
                  </strong>
                </div>
                <span><strong>$53.98</strong></span>
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