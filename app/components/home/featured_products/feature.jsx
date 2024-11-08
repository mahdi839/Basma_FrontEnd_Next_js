import React from "react";
import Image from "next/image";
function Feature() {
  return (
    <div className="container">
      <div className="row">
        <h2 className="text-center py-2 featured_heading bold font-weight-bold">
          Featured Products
        </h2>
        <div className="col-12 d-flex flex-wrap gap-3 py-5">
          <div class="card" style={{ width: "15rem" }}>
            <Image
              src="/img/product/product-1.jpg"
              className="card-img-top"
              alt="product image"
              width={500}
              height={250}
            />
           <div className="py-2 justify-content-center d-flex flex-column align-items-center">
           <h4>Dress</h4>
           <h6 className="product_price">1000 tk</h6>
           </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Feature;
