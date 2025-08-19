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
import axios from "axios";

export default async function Footer() {
  console.log("✅ Footer component rendering on server...");
  const footerData = await fetch(
    `${process.env.BACKEND_URL}api/footer-settings`,
    {
      cache: "no-store",
    }
  );
  if (!footerData.ok) {
    console.log("Error fetching footer data");
  }

  const data = await footerData.json();
  console.log(data);

   // Always define backendUrl once
  const backendUrl = process.env.BACKEND_URL.endsWith("/")
    ? process.env.BACKEND_URL.slice(0, -1)
    : process.env.BACKEND_URL;

  return (
    <footer className="bg-warning-subtle position-relative overflow-hidden pt-5">
      {/* Top curve */}

      <div className="container position-relative py-4">
        <div className="row g-4">
          {/* Logo Section */}
          <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
            <Link href="#" className="d-inline-block mb-4">
              <div className="bg-white p-2 rounded shadow-sm d-inline-block">
                <Link href="/">
                  <Image src={backendUrl+data.logo_path} alt="" width={200} height={40} />
                </Link>
              </div>
            </Link>
            <p className="text-muted mb-4">{data?.company_description}</p>
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
                 {data?.company_address}
                 
                </span>
              </li>
              <li className="mb-3 d-flex">
                <FaPhone className="text-dark mt-1 me-3 fs-5" />
                <span>{data?.company_phone}</span>
              </li>
              <li className="d-flex">
                <CiMail className="text-dark mt-1 me-3 fs-5" />
                <span>{data?.company_email}</span>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
            <h5 className="fw-bold mb-4  pb-2">My Account</h5>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-muted text-decoration-none d-block mb-3"
                >
                  My Profile
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-muted text-decoration-none d-block mb-3"
                >
                  Login/Register
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted text-decoration-none d-block"
                >
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
                <Link
                  href="#"
                  className="text-muted text-decoration-none d-block mb-3"
                >
                  About
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-muted text-decoration-none d-block mb-3"
                >
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-muted text-decoration-none d-block mb-3"
                >
                  Terms & Condition
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted text-decoration-none d-block"
                >
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
