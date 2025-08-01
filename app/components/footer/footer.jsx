import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaWhatsappSquare,
  FaPhone,
} from "react-icons/fa";
import { CiLocationOn, CiMail } from "react-icons/ci";

export default function Footer() {
  return (
    <footer className="bg-warning-subtle position-relative overflow-hidden pt-5">
      {/* Top curve */}
     

      <div className="container position-relative py-4">
        <div className="row g-4">
          {/* Logo Section */}
          <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
            <Link href="#" className="d-inline-block mb-4">
              <div className="bg-white p-2 rounded shadow-sm d-inline-block">
                <img 
                  src="/images/logo.svg" 
                  alt="Company Logo" 
                  className="img-fluid"
                  style={{ height: "40px" }}
                />
              </div>
            </Link>
            <p className="text-muted mb-4">
              Providing premium products with exceptional customer service since 2010. We're committed to quality and customer satisfaction.
            </p>
            <div className="d-flex gap-3">
              <Link href="#" className="text-dark fs-5">
                <FaFacebook />
              </Link>
              <Link href="#" className="text-dark fs-5">
                <FaInstagram />
              </Link>
              <Link href="#" className="text-dark fs-5">
                <FaWhatsappSquare />
              </Link>
              <Link href="#" className="text-dark fs-5">
                <FaYoutube />
              </Link>
            </div>
          </div>

          {/* Store Information */}
          <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
            <h5 className="fw-bold mb-4  pb-2">Store Information</h5>
            <ul className="list-unstyled text-muted">
              <li className="mb-3 d-flex">
                <CiLocationOn className="text-dark mt-1 me-3 fs-5" />
                <span>
                  My Company, 42 Puffin street<br />12345 Puffinville France
                </span>
              </li>
              <li className="mb-3 d-flex">
                <FaPhone className="text-dark mt-1 me-3 fs-5" />
                <span>01795802507</span>
              </li>
              <li className="d-flex">
                <CiMail className="text-dark mt-1 me-3 fs-5" />
                <span>hasanarefi56574@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
            <h5 className="fw-bold mb-4  pb-2">My Account</h5>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                <Link href="#" className="text-muted text-decoration-none d-block mb-3">
                  My Profile
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-muted text-decoration-none d-block mb-3">
                  Login/Register
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted text-decoration-none d-block">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
            <h5 className="fw-bold mb-4  pb-2">Useful Links</h5>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                <Link href="#" className="text-muted text-decoration-none d-block mb-3">
                  About
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-muted text-decoration-none d-block mb-3">
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-muted text-decoration-none d-block mb-3">
                  Terms & Condition
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted text-decoration-none d-block">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <hr className="my-5 opacity-25" />

        {/* Copyright */}
        <div className="d-flex flex-wrap align-items-center justify-content-center pb-3">
          <p className="text-muted mb-0 me-3">
            &copy; {new Date().getFullYear()} My Company. All rights reserved.
          </p>
         
        </div>
      </div>
    </footer>
  );
}