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

export default async function Footer() {
  let data = {};
  let socialData = {};

  // Always define backendUrl once
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.endsWith("/")
    ? process.env.NEXT_PUBLIC_BACKEND_URL.slice(0, -1)
    : process.env.NEXT_PUBLIC_BACKEND_URL || "";

  try {
    // Fetch footer data with error handling
    const footerResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/footer-settings`,
      {
        next: { revalidate: 60 },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!footerResponse.ok) {
      console.error(`Footer API failed: ${footerResponse.status} ${footerResponse.statusText}`);
    } else {
      const responseText = await footerResponse.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse footer data:", parseError);
          console.log("Response text:", responseText);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching footer data:", error);
  }

  try {
    // Fetch social links data with error handling
    const socialResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/social-links-first`,
      {
        next: { revalidate: 60 },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!socialResponse.ok) {
      console.error(`Social links API failed: ${socialResponse.status} ${socialResponse.statusText}`);
    } else {
      const responseText = await socialResponse.text();
      if (responseText) {
        try {
          socialData = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse social data:", parseError);
          console.log("Response text:", responseText);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching social data:", error);
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-warning-subtle position-relative overflow-hidden pt-5">
      <div className="container position-relative py-4">
        <div className="row g-4">
          {/* Logo Section */}
          <div className="col-md-6 col-lg-3 mb-1 mb-lg-4 mb-lg-0 footer_logo_section">
            <div className="logo_section_mobile_border">
              <div className=" rounded  footer_logo_div">
                <Link href="/">
                  {data.logo_path ? (
                    <img
                      className="desktop_logo"
                      src={backendUrl + data.logo_path}
                      alt="Company Logo"
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center" style={{ width: 91, height: 80 }}>
                      <span>Logo</span>
                    </div>
                  )}
                </Link>
              </div>

              <p className="text-muted mb-2 mb-lg-4 ">
                {data?.company_description || "Your company description here"}
              </p>

              <div className="d-flex gap-3">
                {socialData?.facebook && (
                  <Link href={socialData.facebook} className="text-dark fs-5">
                    <FaFacebook />
                  </Link>
                )}
                {socialData?.instagram && (
                  <Link href={socialData.instagram} className="text-dark fs-5">
                    <FaInstagram />
                  </Link>
                )}
                {data?.company_phone && (
                  <a
                    href={`https://wa.me/${data.company_phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark fs-5"
                  >
                    <FaWhatsappSquare />
                  </a>
                )}
                {socialData?.youtube && (
                  <Link href={socialData.youtube} className="text-dark fs-5">
                    <FaYoutube />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="col-md-6 col-lg-3 mb-1 mb-md-4 mb-lg-0 pt-2 pt-lg-0 ">
            <div className="footer_store_info">
              <h5 className="fw-bold mb-2 mb-md-4 pb-2">Store Information</h5>
              <ul className="list-unstyled text-muted">
                {data?.company_address && (
                  <li className="mb-3 d-flex">
                    <CiLocationOn className="text-dark mt-1 me-md-3 fs-5" />
                    <span>{data.company_address}</span>
                  </li>
                )}
                {data?.company_phone && (
                  <li className="mb-3 d-flex">
                    <FaPhone className="text-dark mt-1 me-3 fs-5" />
                    <span>{data.company_phone}</span>
                  </li>
                )}
                {data?.company_email && (
                  <li className="d-flex">
                    <CiMail className="text-dark mt-1 me-3 fs-5" />
                    <span>{data.company_email}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Account Links */}
          <div className="col-md-6 col-lg-3 mb-1 mb-md-4 mb-lg-0 ">
            <div className="footer_account">
              <h5 className="fw-bold mb-4 pb-2">My Account</h5>
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
          </div>

          {/* Useful Links */}
          <div className="col-md-6 col-lg-3 mb-4 mb-lg-0 ">
            <div className="footer_links">
              <h5 className="fw-bold mb-4 pb-2">Useful Links</h5>
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
        </div>

        {/* Divider */}
        <hr className="my-5 opacity-25" />

        {/* Copyright */}
        <div className="d-flex flex-wrap align-items-center justify-content-center pb-3">
          <p className="text-muted mb-0 me-3">
            &copy; {currentYear} {data?.company_name || "My Company"}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}