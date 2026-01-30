import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaWhatsappSquare,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaChevronRight,
  FaShieldAlt,
  FaTruck,
  FaCreditCard,
  FaHeadset
} from "react-icons/fa";
import './footer.css'

export default async function Footer() {
  let data = {};
  let socialData = {};

  try {
    const footerResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/footer-settings`,
      {
        next: { revalidate: 60 },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (footerResponse.ok) {
      const responseText = await footerResponse.text();
      if (responseText) data = JSON.parse(responseText);
    }
  } catch (error) {
    console.error("Error fetching footer data:", error);
  }

  try {
    const socialResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/social-links-first`,
      {
        next: { revalidate: 60 },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (socialResponse.ok) {
      const responseText = await socialResponse.text();
      if (responseText) socialData = JSON.parse(responseText);
    }
  } catch (error) {
    console.error("Error fetching social data:", error);
  }

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "All Products", href: "/products" },
      { name: "New Arrivals", href: "/" },
      { name: "Best Sellers", href: "/" },
      // { name: "Sale", href: "/products/sale" },
      // { name: "Gift Cards", href: "/gift-cards" }
    ],
    support: [
      // { name: "Contact Us", href: "/" },
      // { name: "FAQ", href: "/faq" },
      { name: "Privacy Policy", href: "/frontEnd/privacy_policy" },
      { name: "Returns & Exchanges", href: "/frontEnd/return_policy" },
      { name: "Size Guide", href: "/size-guide" }
    ],
    company: [
      { name: "About Us", href: "/frontEnd/about_us" },
      { name: "Our Story", href: "/" },
      { name: "Careers", href: "/" },
      // { name: "Store Locator", href: "/stores" }
    ],
    // legal: [
      
    //   { name: "Terms of Service", href: "/terms" },
    //   // { name: "Accessibility", href: "/accessibility" },
    //   // { name: "Sitemap", href: "/sitemap" }
    // ]
  };

  return (
    <footer className="footer_bg position-relative overflow-hidden pt-5">
     
      {/* Main Footer Content */}
      <div className="container py-4">
        <div className="row g-4">
          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-box rounded-4 p-4 h-100">
              <Link href="/" className="d-block mb-3">
                <Image
                  src="/img/logo.png"
                  alt={data?.company_name || "Eyara Fashion"}
                  width={180}
                  height={50}
                  style={{ objectFit: 'contain' }}
                  priority
                  className="img-fluid"
                />
              </Link>
              
              <p className="text-white mb-4 small">
                {data.company_description || "Premium fashion for the modern lifestyle. Quality products with exceptional customer service."}
              </p>
              
              {/* Social Links */}
              <div className="d-flex gap-2 mb-4 flex-wrap">
                {socialData?.facebook && (
                  <a 
                    href={socialData.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn btn-sm rounded-circle p-2"
                  >
                    <FaFacebook className="text-white" />
                  </a>
                )}
                {socialData?.instagram && (
                  <a 
                    href={socialData.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn btn-sm rounded-circle p-2"
                  >
                    <FaInstagram className="text-white" />
                  </a>
                )}
                {socialData?.youtube && (
                  <a 
                    href={socialData.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn btn-sm rounded-circle p-2"
                  >
                    <FaYoutube className="text-white" />
                  </a>
                )}
                {data?.company_phone && (
                  <a 
                    href={`https://wa.me/880${data.company_phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn btn-sm rounded-circle p-2"
                  >
                    <FaWhatsappSquare className="text-white" />
                  </a>
                )}
              </div>
              
              {/* Contact Info Box */}
              <div className="contact-box rounded-3 p-3">
                <h6 className="text-white mb-3 fw-bold">Contact Info</h6>
                {data?.company_phone && (
                  <div className="d-flex align-items-center mb-2">
                    <FaPhone className="text-white me-2 fs-6" />
                    <a href={`tel:${data.company_phone}`} className="text-white small text-decoration-none">
                      {data.company_phone}
                    </a>
                  </div>
                )}
                {data?.company_email && (
                  <div className="d-flex align-items-center mb-2">
                    <FaEnvelope className="text-white me-2 fs-6" />
                    <a href={`mailto:${data.company_email}`} className="text-white small text-decoration-none">
                      {data.company_email}
                    </a>
                  </div>
                )}
                {data?.company_address && (
                  <div className="d-flex align-items-start">
                    <FaMapMarkerAlt className="text-white me-2 mt-1 fs-6" />
                    <span className="text-white small">
                      {data.company_address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="col-lg-8">
            <div className="row g-4">
              {Object.entries(footerLinks).map(([key, links]) => (
                <div key={key} className="col-6 col-md-3">
                  <div className="footer-box rounded-4 p-4 h-100">
                    <h6 className="text-white mb-3 fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>
                      {key}
                    </h6>
                    <ul className="list-unstyled mb-0">
                      {links.map((link, index) => (
                        <li key={index} className="mb-2">
                          <Link 
                            href={link.href}
                            className="text-white d-flex align-items-center text-decoration-none link-hover"
                          >
                            <FaChevronRight className="me-2 chevron-icon" style={{ fontSize: '10px' }} />
                            <span className="small text-white">{link.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-white border-opacity-25" />

        {/* Bottom Bar */}
        <div className="row align-items-center py-3">
          <div className="col-md-6 mb-3 mb-md-0 text-center text-md-start">
            <p className="text-white mb-0 small">
              © {currentYear} {data?.company_name || "Eyara Fashion"}. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="text-white mb-0 small">
              Developed By - <a 
                href="https://wa.me/8801795802507" 
                target="_blank" 
                rel="noopener noreferrer"
                className="developer-link text-white text-decoration-none fw-bold"
              >
                Mehedi Hasan
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}