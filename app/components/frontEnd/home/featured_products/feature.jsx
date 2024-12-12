import React from "react";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { FaCartArrowDown } from "react-icons/fa";
import Link from "next/link";
function Feature() {
  return (
    <div className="container">
      <div className="row">
        <h2 className="text-center py-2 featured_heading bold font-weight-bold">
          Featured Products
        </h2>
        <div className="col-12 d-flex flex-wrap gap-3 py-5">
          <div class="card" style={{ width: "18rem" }}>
            <Image
              src="/img/product/dress-1.png"
              className="card-img-top"
              alt="product image"
              width={500}
              height={250}
            />

            <div className="product-option d-flex  flex-column justify-content-center rounded align-items-center">
              <FaCartArrowDown className="fs-4 " />
              <Link href="/frontEnd/product-page"> <CiSearch className="fs-4 mt-2 text-white" /> </Link> 
            </div>

            <div className="pt-5 pb-3 justify-content-center d-flex flex-column px-3">
              <div>
                <Link href="/product-page">
                  2024 autumn new girl nice wallet
                </Link>
              </div>
              <div className="mt-3">
                <span class="text-decoration-line-through me-2 ">$35.00</span>{" "}
                <br />
                <span class="product_price  fw-bold">$35.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feature;
